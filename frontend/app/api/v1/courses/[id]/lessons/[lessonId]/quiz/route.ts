import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { normaliseLessonQuiz } from "@/lib/lesson-quizzes";

export const runtime = "nodejs";

function asAnswers(value: unknown) {
  if (!value || typeof value !== "object") return {} as Record<string, string>;
  const answers: Record<string, string> = {};
  for (const [key, answer] of Object.entries(value as Record<string, unknown>)) {
    if (typeof answer === "string" || typeof answer === "number") answers[key] = String(answer);
  }
  return answers;
}

async function loadLesson(courseId: string, lessonId: string) {
  const db = getDb();
  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return { error: jsonError("Course not found.", 404) } as const;
  const lessons = Array.isArray(courseSnap.data()?.lessons)
    ? courseSnap.data()?.lessons as Record<string, unknown>[]
    : [];
  const lesson = lessons.find((item) => String(item.id ?? "") === lessonId);
  if (!lesson) return { error: jsonError("Lesson not found.", 404) } as const;
  return { db, lesson } as const;
}

async function requireEnrolment(learnerId: string, courseId: string) {
  const db = getDb();
  const snapshot = await db.collection("enrolments").where("learnerId", "==", learnerId).limit(200).get();
  return snapshot.docs.find((doc) => String(doc.data().courseId ?? "") === courseId) ?? null;
}

/** POST /api/v1/courses/[id]/lessons/[lessonId]/quiz — grade and save a mastery attempt. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string; lessonId: string }> },
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can take mastery checks.", 403);

  const { id: courseId, lessonId } = await ctx.params;
  const loaded = await loadLesson(courseId, lessonId);
  if ("error" in loaded) return loaded.error;
  const enrolment = await requireEnrolment(auth.user.id, courseId);
  if (!enrolment) return jsonError("You are not enrolled in this course.", 404);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const answers = asAnswers(body?.answers);
  const quiz = normaliseLessonQuiz(loaded.lesson);
  const correct = quiz.questions.filter((question) => answers[question.id] === String(question.correct_index)).length;
  const score = Math.round((correct / quiz.questions.length) * 100);
  const passed = score >= quiz.pass_percent;
  const db = loaded.db;
  const attemptsSnapshot = await db.collection("quiz_attempts").where("learnerId", "==", auth.user.id).limit(500).get();
  const previousAttempts = attemptsSnapshot.docs.filter((doc) => {
    const item = doc.data();
    return String(item.courseId ?? "") === courseId && String(item.lessonId ?? "") === lessonId;
  });
  const now = new Date().toISOString();
  const attemptRef = db.collection("quiz_attempts").doc();
  const payload = {
    learnerId: auth.user.id,
    courseId,
    lessonId,
    answers,
    score,
    passed,
    pass_percent: quiz.pass_percent,
    correct_count: correct,
    question_count: quiz.questions.length,
    attempt_number: previousAttempts.length + 1,
    submitted_at: now,
    created_at: now,
  };
  await attemptRef.set(payload);

  return jsonOk({
    data: {
      id: attemptRef.id,
      course_id: courseId,
      lesson_id: lessonId,
      score,
      passed,
      pass_percent: quiz.pass_percent,
      correct_count: correct,
      question_count: quiz.questions.length,
      attempt_number: previousAttempts.length + 1,
      submitted_at: now,
      explanations: quiz.questions.map((question) => ({
        question_id: question.id,
        selected_index: answers[question.id] ?? null,
        correct_index: question.correct_index,
        correct: answers[question.id] === String(question.correct_index),
        explanation: question.explanation,
      })),
    },
  }, 201);
}

/** GET /api/v1/courses/[id]/lessons/[lessonId]/quiz — latest mastery attempt and history. */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string; lessonId: string }> },
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can view mastery checks.", 403);

  const { id: courseId, lessonId } = await ctx.params;
  const loaded = await loadLesson(courseId, lessonId);
  if ("error" in loaded) return loaded.error;
  if (!(await requireEnrolment(auth.user.id, courseId))) return jsonError("You are not enrolled in this course.", 404);

  const snapshot = await loaded.db.collection("quiz_attempts").where("learnerId", "==", auth.user.id).limit(500).get();
  const attempts: Record<string, unknown>[] = snapshot.docs
    .filter((doc) => String(doc.data().courseId ?? "") === courseId && String(doc.data().lessonId ?? "") === lessonId)
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Record<string, unknown>)
    .sort((a, b) => String(b.submitted_at ?? "").localeCompare(String(a.submitted_at ?? "")));
  return jsonOk({ data: { quiz: normaliseLessonQuiz(loaded.lesson), latest: attempts[0] ?? null, attempts } });
}
