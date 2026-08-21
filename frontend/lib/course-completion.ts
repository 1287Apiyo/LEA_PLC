import { randomBytes } from "node:crypto";
import type { Firestore } from "firebase-admin/firestore";
import { normaliseLessonQuiz } from "@/lib/lesson-quizzes";

export interface CourseCompletion {
  course_id: string;
  course_title: string;
  eligible: boolean;
  certificate_id: string | null;
  verification_code: string | null;
  rules: {
    lessons_viewed: { passed: boolean; completed: number; required: number };
    assignments_submitted: { passed: boolean; submitted: number; required: number };
    quizzes_passed: { passed: boolean; passed_count: number; required: number };
    grades: { passed: boolean; average: number | null; threshold: number; graded: number; required: number };
  };
  assignments: Array<{ lesson_id: string; title: string; submitted: boolean; status: string; grade: number | null }>;
  quizzes: Array<{ lesson_id: string; title: string; passed: boolean; score: number | null; attempts: number }>;
}

export async function evaluateCourseCompletion(db: Firestore, learnerId: string, courseId: string): Promise<CourseCompletion | null> {
  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return null;
  const course = courseSnap.data() ?? {};
  const lessons = Array.isArray(course.lessons) ? course.lessons as Record<string, unknown>[] : [];
  const enrolmentSnap = await db.collection("enrolments").where("learnerId", "==", learnerId).limit(500).get();
  const enrolmentDoc = enrolmentSnap.docs.find((doc) => String(doc.data().courseId ?? "") === courseId);
  if (!enrolmentDoc) return null;
  const enrolment = enrolmentDoc.data();
  const completedLessons = new Set(Array.isArray(enrolment.completed_lessons) ? enrolment.completed_lessons.map(String) : []);

  const [submissionSnap, quizSnap, certificateSnap] = await Promise.all([
    db.collection("submissions").where("learnerId", "==", learnerId).limit(1000).get(),
    db.collection("quiz_attempts").where("learnerId", "==", learnerId).limit(1000).get(),
    db.collection("certificates").where("learnerId", "==", learnerId).limit(500).get(),
  ]);
  const submissions = submissionSnap.docs.filter((doc) => String(doc.data().courseId ?? "") === courseId);
  const submissionByLesson = new Map(submissions.map((doc) => [String(doc.data().lessonId ?? ""), doc.data()]));
  const quizAttempts = quizSnap.docs.filter((doc) => String(doc.data().courseId ?? "") === courseId);
  const quizByLesson = new Map<string, Record<string, unknown>[]>();
  quizAttempts.forEach((doc) => {
    const lessonId = String(doc.data().lessonId ?? "");
    const list = quizByLesson.get(lessonId) ?? [];
    list.push(doc.data());
    quizByLesson.set(lessonId, list);
  });

  const assignmentLessons = lessons.filter((lesson) => String(lesson.assignment ?? "").trim());
  const assignments = assignmentLessons.map((lesson) => {
    const lessonId = String(lesson.id ?? "");
    const submission = submissionByLesson.get(lessonId);
    return {
      lesson_id: lessonId,
      title: String(lesson.title ?? lessonId),
      submitted: Boolean(submission),
      status: String(submission?.status ?? "missing"),
      grade: submission?.grade === null || submission?.grade === undefined ? null : Number(submission.grade),
    };
  });
  const quizRows = lessons.map((lesson) => {
    const lessonId = String(lesson.id ?? "");
    const attempts = quizByLesson.get(lessonId) ?? [];
    const passed = attempts.some((attempt) => attempt.passed === true);
    const score = attempts.length ? Math.max(...attempts.map((attempt) => Number(attempt.score ?? 0))) : null;
    return { lesson_id: lessonId, title: String(lesson.title ?? lessonId), passed, score, attempts: attempts.length, questions: normaliseLessonQuiz(lesson).questions.length };
  });
  const graded = assignments.filter((assignment) => assignment.grade !== null);
  const average = graded.length ? Math.round(graded.reduce((sum, assignment) => sum + Number(assignment.grade ?? 0), 0) / graded.length) : null;
  const threshold = 60;
  const rules = {
    lessons_viewed: { passed: lessons.length > 0 && lessons.every((lesson) => completedLessons.has(String(lesson.id ?? ""))), completed: lessons.filter((lesson) => completedLessons.has(String(lesson.id ?? ""))).length, required: lessons.length },
    assignments_submitted: { passed: assignments.every((assignment) => assignment.submitted), submitted: assignments.filter((assignment) => assignment.submitted).length, required: assignments.length },
    quizzes_passed: { passed: quizRows.every((quiz) => quiz.passed), passed_count: quizRows.filter((quiz) => quiz.passed).length, required: quizRows.length },
    grades: { passed: graded.length === assignments.length && (average ?? 0) >= threshold, average, threshold, graded: graded.length, required: assignments.length },
  };
  const existing = certificateSnap.docs.find((doc) => String(doc.data().courseId ?? doc.data().course_id ?? "") === courseId);
  const eligible = rules.lessons_viewed.passed && rules.assignments_submitted.passed && rules.quizzes_passed.passed && rules.grades.passed;
  return {
    course_id: courseId,
    course_title: String(course.title ?? courseId),
    eligible,
    certificate_id: existing?.id ?? null,
    verification_code: existing ? String(existing.data().verification_code ?? existing.data().code ?? "") : null,
    rules,
    assignments,
    quizzes: quizRows.map(({ lesson_id, title, passed, score, attempts }) => ({ lesson_id, title, passed, score, attempts })),
  };
}

export async function issueCourseCertificate(db: Firestore, learnerId: string, courseId: string) {
  const completion = await evaluateCourseCompletion(db, learnerId, courseId);
  if (!completion) return { error: "You are not enrolled in this course." } as const;
  if (!completion.eligible) return { completion, error: "Complete every required lesson, assignment, mastery check, and grade threshold before requesting a certificate." } as const;
  if (completion.certificate_id) return { completion, certificate: { id: completion.certificate_id, verification_code: completion.verification_code }, existing: true } as const;

  const now = new Date().toISOString();
  const verificationCode = `LEA-${courseId.slice(0, 4).toUpperCase()}-${randomBytes(5).toString("hex").toUpperCase()}`;
  const certificate = await db.collection("certificates").add({
    learnerId,
    courseId,
    course_title: completion.course_title,
    verification_code: verificationCode,
    code: verificationCode,
    status: "earned",
    issued_at: now,
    created_at: now,
    completion_evidence: completion.rules,
  });
  await db.collection("notifications").add({
    recipientId: learnerId,
    learnerId,
    type: "certificate_earned",
    title: "Certificate earned",
    body: `Your ${completion.course_title} certificate is ready to verify and share.`,
    href: "/learner/certificates",
    read: false,
    created_at: now,
  });
  return { completion, certificate: { id: certificate.id, verification_code: verificationCode }, existing: false } as const;
}
