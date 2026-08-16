import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

/** POST /api/v1/courses/[id]/enroll — enrols the authenticated learner. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can enrol in courses.", 403);
  const db = getDb();

  const { id: courseId } = await ctx.params;
  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return jsonError("Course not found.", 404);

  const existing = await db
    .collection("enrolments")
    .where("learnerId", "==", auth.user.id)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();
  if (!existing.empty) {
    const doc = existing.docs[0];
    return jsonOk({ data: { id: doc.id, ...doc.data(), already_enrolled: true } });
  }

  const lessons = (courseSnap.data()?.lessons ?? []) as Array<{ id?: string; order?: number }>;
  const firstLesson = lessons.sort((a, b) => Number(a.order) - Number(b.order))[0];
  const enrolment = {
    id: `enr-${randomBytes(4).toString("hex")}`,
    learnerId: auth.user.id,
    courseId,
    progress: 0,
    completed_lessons: [],
    next_lesson: firstLesson?.id ?? null,
    status: "active",
    enrolled_at: new Date().toISOString(),
  };
  await db.collection("enrolments").doc(enrolment.id).set(enrolment);

  return jsonOk(
    {
      data: {
        id: enrolment.id,
        progress: 0,
        completed_lessons: [],
        next_lesson: enrolment.next_lesson,
        enrolled_at: enrolment.enrolled_at,
      },
    },
    201
  );
}
