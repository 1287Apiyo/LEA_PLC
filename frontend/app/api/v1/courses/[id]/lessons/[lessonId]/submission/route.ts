import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

/** POST /api/v1/courses/[id]/lessons/[lessonId]/submission — saves learner work. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string; lessonId: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can submit assignments.", 403);

  const db = getDb();
  const { id: courseId, lessonId } = await ctx.params;
  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return jsonError("Course not found.", 404);

  const course = courseSnap.data() ?? {};
  const lessons = Array.isArray(course.lessons) ? (course.lessons as Record<string, unknown>[]) : [];
  const lesson = lessons.find((item) => String(item.id ?? "") === lessonId);
  if (!lesson) return jsonError("Lesson not found.", 404);
  if (!String(lesson.assignment ?? "").trim()) return jsonError("This lesson has no assignment.", 422);

  const enrolmentSnap = await db
    .collection("enrolments")
    .where("learnerId", "==", auth.user.id)
    .limit(100)
    .get();
  let enrolment = undefined as (typeof enrolmentSnap.docs)[number] | undefined;
  for (const doc of enrolmentSnap.docs) {
    if (String(doc.data().courseId ?? "") === courseId) {
      enrolment = doc;
      break;
    }
  }
  if (!enrolment) return jsonError("You are not enrolled in this course.", 404);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const responseText = typeof body?.response_text === "string" ? body.response_text.trim() : "";
  const evidenceUrl = typeof body?.evidence_url === "string" ? body.evidence_url.trim() : "";
  if (responseText.length < 20) {
    return jsonError("Please add at least 20 characters describing your work.", 422);
  }
  if (responseText.length > 12000) return jsonError("Your submission is too long. Keep it under 12,000 characters.", 422);
  if (evidenceUrl && !/^https?:\/\//i.test(evidenceUrl)) {
    return jsonError("Evidence links must begin with http:// or https://.", 422);
  }

  const existingSnap = await db
    .collection("submissions")
    .where("learnerId", "==", auth.user.id)
    .limit(500)
    .get();
  let existing = undefined as (typeof existingSnap.docs)[number] | undefined;
  for (const doc of existingSnap.docs) {
    const item = doc.data();
    if (String(item.courseId ?? "") === courseId && String(item.lessonId ?? "") === lessonId) {
      existing = doc;
      break;
    }
  }

  const now = new Date().toISOString();
  const payload = {
    learnerId: auth.user.id,
    courseId,
    lessonId,
    assignment: String(lesson.assignment ?? ""),
    response_text: responseText,
    evidence_url: evidenceUrl || null,
    status: "submitted",
    submitted_at: now,
    updated_at: now,
    ...(existing?.data()?.grade !== undefined ? { grade: existing.data()?.grade } : {}),
    ...(existing?.data()?.feedback ? { feedback: existing.data()?.feedback } : {}),
  };

  const submissionRef = existing?.ref ?? db.collection("submissions").doc();
  if (existing) await submissionRef.update(payload);
  else await submissionRef.set({ ...payload, created_at: now });

  return jsonOk({
    data: {
      id: submissionRef.id,
      course_id: courseId,
      lesson_id: lessonId,
      response_text: responseText,
      evidence_url: evidenceUrl || null,
      status: "submitted",
      submitted_at: now,
      grade: payload.grade ?? null,
      feedback: payload.feedback ?? "",
    },
  });
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string; lessonId: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can view submissions.", 403);

  const db = getDb();
  const { id: courseId, lessonId } = await ctx.params;
  const submissionSnap = await db
    .collection("submissions")
    .where("learnerId", "==", auth.user.id)
    .limit(500)
    .get();
  let submissionDoc = undefined as (typeof submissionSnap.docs)[number] | undefined;
  for (const doc of submissionSnap.docs) {
    const item = doc.data();
    if (String(item.courseId ?? "") === courseId && String(item.lessonId ?? "") === lessonId) {
      submissionDoc = doc;
      break;
    }
  }
  if (!submissionDoc) return jsonOk({ data: null });

  const submission = submissionDoc.data();
  return jsonOk({
    data: {
      id: submissionDoc.id,
      course_id: courseId,
      lesson_id: lessonId,
      response_text: String(submission.response_text ?? ""),
      evidence_url: submission.evidence_url ? String(submission.evidence_url) : null,
      status: submission.status === "graded" ? "graded" : "submitted",
      submitted_at: String(submission.submitted_at ?? submission.created_at ?? ""),
      grade: submission.grade === null || submission.grade === undefined ? null : Number(submission.grade),
      feedback: String(submission.feedback ?? ""),
    },
  });
}

