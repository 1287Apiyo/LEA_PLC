import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { getInstructorScope, instructorCanAccessLearner } from "@/lib/instructor-access";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

function serialiseSubmission(id: string, submission: Row, names: Map<string, string>, courses: Map<string, Row>) {
  const courseId = String(submission.courseId ?? "");
  const lessonId = String(submission.lessonId ?? "");
  const course = courses.get(courseId) ?? {};
  const lessons = Array.isArray(course.lessons) ? course.lessons as Row[] : [];
  const lesson = lessons.find((item) => String(item.id ?? "") === lessonId);
  return {
    id,
    learner_id: String(submission.learnerId ?? ""),
    learner_name: names.get(String(submission.learnerId ?? "")) ?? "Learner",
    course_id: courseId,
    course_title: String(course.title ?? courseId),
    lesson_id: lessonId,
    lesson_title: String(lesson?.title ?? lessonId),
    assignment: String(submission.assignment ?? lesson?.assignment ?? ""),
    response_text: String(submission.response_text ?? ""),
    evidence_url: submission.evidence_url ? String(submission.evidence_url) : null,
    status: ["submitted", "graded", "approved", "revision_requested"].includes(String(submission.status))
      ? String(submission.status)
      : "submitted",
    submitted_at: String(submission.submitted_at ?? submission.created_at ?? ""),
    submission_count: Number(submission.submission_count ?? 1),
    versions: Array.isArray(submission.versions) ? submission.versions : [],
    grade: submission.grade === null || submission.grade === undefined ? null : Number(submission.grade),
    feedback: String(submission.feedback ?? ""),
    rubric: submission.rubric && typeof submission.rubric === "object" ? submission.rubric : {},
    graded_at: String(submission.graded_at ?? ""),
    graded_by: String(submission.graded_by ?? ""),
  };
}

/** GET /api/v1/instructor/submissions — review queue for the instructor's courses. */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "instructor" && auth.user.role !== "administrator") return jsonError("Instructor access required.", 403);

  const db = getDb();
  const isAdmin = ["administrator", "admin"].includes(String(auth.user.role));
  const scope = isAdmin ? null : await getInstructorScope(String(auth.user.id ?? ""));
  const courseIds = isAdmin
    ? new Set((await db.collection("courses").limit(500).get()).docs.map((doc) => doc.id))
    : scope?.courseIds ?? new Set<string>();
  const [submissionSnap, courseSnap, userSnap] = await Promise.all([
    db.collection("submissions").limit(1000).get(),
    db.collection("courses").limit(500).get(),
    db.collection("users").where("role", "==", "learner").limit(1000).get(),
  ]);
  const courses = new Map(courseSnap.docs.map((doc) => [doc.id, { id: doc.id, ...doc.data() } as Row]));
  const names = new Map(userSnap.docs.map((doc) => [doc.id, String(doc.data().name ?? doc.data().email ?? "Learner")]));
  const url = new URL(req.url);
  const status = url.searchParams.get("status")?.trim();
  const search = url.searchParams.get("search")?.toLowerCase().trim() ?? "";
  const rows = submissionSnap.docs
    .filter((doc) => {
      const submission = doc.data() as Row;
      const courseId = String(submission.courseId ?? submission.course_id ?? "");
      const learnerId = String(submission.learnerId ?? submission.learner_id ?? "");
      if (isAdmin) return courseIds.has(courseId);
      return Boolean(scope && courseIds.has(courseId) && instructorCanAccessLearner(scope, learnerId, courseId));
    })
    .map((doc) => serialiseSubmission(doc.id, doc.data(), names, courses))
    .filter((row) => !status || status === "all" || row.status === status)
    .filter((row) => !search || [row.learner_name, row.course_title, row.lesson_title, row.response_text].some((value) => String(value).toLowerCase().includes(search)))
    .sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)));

  return jsonOk({
    data: rows,
    meta: {
      total: rows.length,
      pending: rows.filter((row) => row.status === "submitted").length,
      revision_requested: rows.filter((row) => row.status === "revision_requested").length,
      approved: rows.filter((row) => row.status === "approved").length,
      graded: rows.filter((row) => row.status === "graded").length,
    },
  });
}
