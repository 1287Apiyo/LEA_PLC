import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

/** POST /api/v1/courses/[id]/lessons/[lessonId]/complete — marks a lesson done and recomputes progress. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string; lessonId: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can complete lessons.", 403);
  const db = getDb();

  const { id: courseId, lessonId } = await ctx.params;
  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return jsonError("Course not found.", 404);
  const lessons = (courseSnap.data()?.lessons ?? []) as Array<{ id?: string; order?: number }>;
  if (!lessons.some((l) => l.id === lessonId)) return jsonError("Lesson not found.", 404);

  const enrSnap = await db
    .collection("enrolments")
    .where("learnerId", "==", auth.user.id)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();
  if (enrSnap.empty) return jsonError("You are not enrolled in this course.", 404);
  const enrRef = enrSnap.docs[0].ref;
  const enr = enrSnap.docs[0].data();

  const completed = new Set<string>((enr.completed_lessons as string[]) ?? []);
  completed.add(lessonId);
  const completedLessons = [...completed];

  const sorted = [...lessons].sort((a, b) => Number(a.order) - Number(b.order));
  const nextLesson = sorted.find((l) => !completed.has(String(l.id)))?.id ?? null;
  const progress = sorted.length > 0 ? Math.round((completedLessons.length / sorted.length) * 100) : 0;

  await enrRef.update({
    completed_lessons: completedLessons,
    progress,
    next_lesson: nextLesson,
    updated_at: new Date().toISOString(),
  });

  return jsonOk({ data: { progress, completed_lessons: completedLessons, next_lesson: nextLesson } });
}
