import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

type FirestoreRow = Record<string, unknown>;

function submissionResponse(id: string, courseId: string, lessonId: string, submission: FirestoreRow) {
  return {
    id,
    course_id: courseId,
    lesson_id: lessonId,
    response_text: String(submission.response_text ?? ""),
    evidence_url: submission.evidence_url ? String(submission.evidence_url) : null,
    status: ["submitted", "graded", "approved", "revision_requested"].includes(String(submission.status))
      ? String(submission.status)
      : "submitted",
    submitted_at: String(submission.submitted_at ?? submission.created_at ?? ""),
    submission_count: Number(submission.submission_count ?? 1),
    last_edited_at: String(submission.last_edited_at ?? submission.updated_at ?? submission.submitted_at ?? ""),
    versions: Array.isArray(submission.versions)
      ? (submission.versions as FirestoreRow[]).map((version) => ({
          version: Number(version.version ?? 1),
          response_text: String(version.response_text ?? ""),
          evidence_url: version.evidence_url ? String(version.evidence_url) : null,
          submitted_at: String(version.submitted_at ?? ""),
          status: ["submitted", "graded", "approved", "revision_requested"].includes(String(version.status))
            ? String(version.status)
            : "submitted",
        }))
      : [],
    grade: submission.grade === null || submission.grade === undefined ? null : Number(submission.grade),
    feedback: String(submission.feedback ?? ""),
    graded_at: String(submission.graded_at ?? ""),
    graded_by: String(submission.graded_by ?? ""),
    rubric: submission.rubric && typeof submission.rubric === "object" ? submission.rubric : {},
    resubmission_requested: submission.status === "revision_requested",
    review_history: Array.isArray(submission.review_history) ? submission.review_history : [],
  };
}

async function loadSubmission(courseId: string, lessonId: string, learnerId: string) {
  const db = getDb();
  const snapshot = await db.collection("submissions").where("learnerId", "==", learnerId).limit(500).get();
  return {
    db,
    doc: snapshot.docs.find((item) => {
      const row = item.data();
      return String(row.courseId ?? "") === courseId && String(row.lessonId ?? "") === lessonId;
    }),
  };
}

async function saveSubmission(
  req: Request,
  ctx: { params: Promise<{ id: string; lessonId: string }> },
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can submit assignments.", 403);

  const db = getDb();
  const { id: courseId, lessonId } = await ctx.params;
  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return jsonError("Course not found.", 404);

  const course = courseSnap.data() ?? {};
  const lessons = Array.isArray(course.lessons) ? course.lessons as FirestoreRow[] : [];
  const lesson = lessons.find((item) => String(item.id ?? "") === lessonId);
  if (!lesson) return jsonError("Lesson not found.", 404);
  if (!String(lesson.assignment ?? "").trim()) return jsonError("This lesson has no assignment.", 422);

  const enrolmentSnap = await db
    .collection("enrolments")
    .where("learnerId", "==", auth.user.id)
    .limit(100)
    .get();
  const enrolment = enrolmentSnap.docs.find((doc) => String(doc.data().courseId ?? "") === courseId);
  if (!enrolment) return jsonError("You are not enrolled in this course.", 404);

  const body = (await req.json().catch(() => null)) as FirestoreRow | null;
  const responseText = typeof body?.response_text === "string" ? body.response_text.trim() : "";
  const evidenceUrl = typeof body?.evidence_url === "string" ? body.evidence_url.trim() : "";
  if (responseText.length < 20) return jsonError("Please add at least 20 characters describing your work.", 422);
  if (responseText.length > 12000) return jsonError("Your submission is too long. Keep it under 12,000 characters.", 422);
  if (evidenceUrl && !/^https?:\/\//i.test(evidenceUrl)) {
    return jsonError("Evidence links must begin with http:// or https://.", 422);
  }

  const loaded = await loadSubmission(courseId, lessonId, auth.user.id);
  const existing = loaded.doc;
  const previous = (existing?.data() ?? {}) as FirestoreRow;
  const previousStatus = String(previous.status ?? "");
  if (existing && ["graded", "approved"].includes(previousStatus)) {
    return jsonError("This submission is locked after grading. Ask your instructor to request a revision before editing it.", 409);
  }

  const now = new Date().toISOString();
  const priorVersions = Array.isArray(previous.versions)
    ? previous.versions as FirestoreRow[]
    : previous.response_text
      ? [{
          version: 1,
          response_text: String(previous.response_text),
          evidence_url: previous.evidence_url ? String(previous.evidence_url) : null,
          submitted_at: String(previous.submitted_at ?? previous.created_at ?? now),
          status: previousStatus || "submitted",
        }]
      : [];
  const nextVersion = priorVersions.length + 1;
  const reviewHistory = Array.isArray(previous.review_history) ? [...previous.review_history] : [];
  if (previous.grade !== undefined || String(previous.feedback ?? "").trim()) {
    reviewHistory.push({
      grade: previous.grade ?? null,
      feedback: String(previous.feedback ?? ""),
      status: previousStatus || "submitted",
      graded_at: String(previous.graded_at ?? ""),
      graded_by: String(previous.graded_by ?? ""),
      recorded_at: now,
    });
  }
  const versions = [
    ...priorVersions,
    {
      version: nextVersion,
      response_text: responseText,
      evidence_url: evidenceUrl || null,
      submitted_at: now,
      status: "submitted",
    },
  ];
  const payload: FirestoreRow = {
    learnerId: auth.user.id,
    courseId,
    lessonId,
    assignment: String(lesson.assignment ?? ""),
    response_text: responseText,
    evidence_url: evidenceUrl || null,
    status: "submitted",
    submitted_at: now,
    updated_at: now,
    last_edited_at: now,
    submission_count: nextVersion,
    versions,
    review_history: reviewHistory,
    grade: null,
    feedback: "",
    rubric: {},
    graded_at: null,
    graded_by: null,
    resubmission_requested: false,
  };

  const submissionRef = existing?.ref ?? db.collection("submissions").doc();
  if (existing) await submissionRef.update(payload);
  else await submissionRef.set({ ...payload, created_at: now });
  const saved = await submissionRef.get();
  return jsonOk({ data: submissionResponse(submissionRef.id, courseId, lessonId, saved.data() ?? payload) });
}

/** POST /api/v1/courses/[id]/lessons/[lessonId]/submission — create or resubmit learner work. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string; lessonId: string }> }) {
  return saveSubmission(req, ctx);
}

/** PATCH /api/v1/courses/[id]/lessons/[lessonId]/submission — edit work after a revision request. */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string; lessonId: string }> }) {
  return saveSubmission(req, ctx);
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string; lessonId: string }> },
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can view submissions.", 403);

  const { id: courseId, lessonId } = await ctx.params;
  const { doc } = await loadSubmission(courseId, lessonId, auth.user.id);
  if (!doc) return jsonOk({ data: null });
  return jsonOk({ data: submissionResponse(doc.id, courseId, lessonId, doc.data()) });
}
