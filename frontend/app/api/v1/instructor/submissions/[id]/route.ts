import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { instructorCanAccessCourseById } from "@/lib/instructor-access";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

function rubricValues(value: unknown) {
  if (!value || typeof value !== "object") return {} as Record<string, number>;
  const rubric: Record<string, number> = {};
  for (const [key, score] of Object.entries(value as Row)) {
    const numeric = Number(score);
    if (Number.isFinite(numeric)) rubric[key] = Math.max(0, Math.min(100, numeric));
  }
  return rubric;
}

/** PATCH /api/v1/instructor/submissions/[id] — grade, approve, or request revision. */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "instructor" && auth.user.role !== "administrator") return jsonError("Instructor access required.", 403);

  const { id } = await ctx.params;
  const db = getDb();
  const submissionRef = db.collection("submissions").doc(id);
  const submissionSnap = await submissionRef.get();
  if (!submissionSnap.exists) return jsonError("Submission not found.", 404);
  const existing = submissionSnap.data() as Row;
  const courseId = String(existing.courseId ?? "");
  if (auth.user.role !== "administrator" && !(await instructorCanAccessCourseById(String(auth.user.id ?? ""), courseId))) {
    return jsonError("You are not assigned to this course.", 403);
  }

  const body = (await req.json().catch(() => null)) as Row | null;
  const grade = Number(body?.grade);
  if (!Number.isFinite(grade) || grade < 0 || grade > 100) return jsonError("Grade must be a number from 0 to 100.", 422);
  const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : "";
  if (feedback.length > 5000) return jsonError("Feedback must be under 5,000 characters.", 422);
  const rawStatus = String(body?.status ?? "graded");
  const status = rawStatus === "pass" ? "approved" : rawStatus;
  if (!["graded", "approved", "revision_requested"].includes(status)) {
    return jsonError("Status must be graded, approved, or revision_requested.", 422);
  }

  const now = new Date().toISOString();
  const review = {
    grade,
    feedback,
    status,
    rubric: rubricValues(body?.rubric),
    graded_at: now,
    graded_by: auth.user.id,
  };
  const history = Array.isArray(existing.review_history) ? [...existing.review_history] : [];
  history.push({ ...review, recorded_at: now });
  const updates: Row = {
    grade,
    feedback,
    status,
    rubric: review.rubric,
    graded_at: now,
    graded_by: auth.user.id,
    resubmission_requested: status === "revision_requested",
    review_history: history,
    updated_at: now,
  };
  await submissionRef.update(updates);

  const learnerId = String(existing.learnerId ?? "");
  if (learnerId) {
    await db.collection("notifications").add({
      recipientId: learnerId,
      learnerId,
      type: status === "revision_requested" ? "assignment_revision" : "assignment_feedback",
      title: status === "revision_requested" ? "Revision requested" : "Assignment feedback is ready",
      body: status === "revision_requested"
        ? "Your instructor requested a revision. Open the course to edit and resubmit your assignment."
        : `Your assignment has been reviewed and received ${grade}%.`,
      href: `/learner/courses/${courseId}`,
      read: false,
      created_at: now,
    });
  }

  return jsonOk({ data: { id, ...existing, ...updates } });
}
