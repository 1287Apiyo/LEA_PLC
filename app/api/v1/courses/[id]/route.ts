import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { learnerNames } from "@/lib/firebase/enrich";

export const runtime = "nodejs";

/**
 * Course detail — GET returns the course with its lessons and the current
 * learner's enrolment (progress, completed lessons, next lesson). PATCH/DELETE
 * mirror the generic resource route (admin editing).
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const { id } = await ctx.params;
  const snap = await db.collection("courses").doc(id).get();
  if (!snap.exists) return jsonError("Course not found.", 404);
  const course = snap.data()!;

  let programme = String(course.programme ?? "");
  if (programme) {
    const prg = await db.collection("programmes").doc(programme).get();
    if (prg.exists) programme = String(prg.data()?.title ?? programme);
  }

  let enrolment: Record<string, unknown> | null = null;
  if (auth.user.role === "learner") {
    const enrSnap = await db
      .collection("enrolments")
      .where("learnerId", "==", auth.user.id)
      .where("courseId", "==", id)
      .limit(1)
      .get();
    if (!enrSnap.empty) {
      const doc = enrSnap.docs[0];
      enrolment = { id: doc.id, ...doc.data() };
    }
  }

  // Admin/instructor view: every learner enrolled in this course, with progress.
  let enrolments: Record<string, unknown>[] | null = null;
  if (auth.user.role !== "learner") {
    const enrSnap = await db.collection("enrolments").where("courseId", "==", id).get();
    const names = await learnerNames(enrSnap.docs.map((d) => String(d.data().learnerId ?? "")));
    enrolments = enrSnap.docs.map((d) => {
      const enr = d.data();
      const learnerId = String(enr.learnerId ?? "");
      const info = names.get(learnerId);
      return {
        learnerId,
        learner_name: info?.name ?? "—",
        learner_email: info?.email ?? "",
        progress: Number(enr.progress ?? 0),
        completed_lessons: (enr.completed_lessons as string[]) ?? [],
        enrolled_at: String(enr.enrolled_at ?? ""),
      };
    });
  }

  const lessons = (course.lessons ?? []) as Record<string, unknown>[];

  return jsonOk({
    data: {
      id,
      title: String(course.title ?? "Untitled course"),
      description: String(course.description ?? ""),
      programme,
      coding: Boolean(course.coding),
      playground_language: course.playground_language ?? null,
      workspace_type: course.workspace_type ?? (course.coding ? "code" : null),
      status: course.status ?? "active",
      lesson_count: lessons.length,
      learners: enrolments?.length ?? null,
      enrolments,
      lessons: lessons.map((l, i) => ({
        id: String(l.id ?? `lesson-${i + 1}`),
        title: String(l.title ?? `Lesson ${i + 1}`),
        duration_minutes: Number(l.duration_minutes ?? 0),
        video_url: String(l.video_url ?? ""),
        description: String(l.description ?? ""),
        notes: String(l.notes ?? ""),
        assignment: String(l.assignment ?? ""),
        order: Number(l.order ?? i + 1),
      })),
      enrolment: enrolment
        ? {
            id: String(enrolment.id),
            progress: Number(enrolment.progress ?? 0),
            completed_lessons: (enrolment.completed_lessons as string[]) ?? [],
            next_lesson: enrolment.next_lesson ?? null,
            enrolled_at: String(enrolment.enrolled_at ?? ""),
          }
        : null,
    },
  });
}

/** PATCH /api/v1/courses/[id] — updates a course. */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const { id } = await ctx.params;
  const docRef = db.collection("courses").doc(id);
  if (!(await docRef.get()).exists) return jsonError("Course not found.", 404);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid payload.", 422);
  const { id: _ignored, ...updates } = body;
  updates.updated_at = new Date().toISOString();
  await docRef.update(updates);

  const updated = await docRef.get();
  return jsonOk({ data: { id, ...updated.data() } });
}

/** DELETE /api/v1/courses/[id] — removes a course and its enrolments. */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const { id } = await ctx.params;
  const docRef = db.collection("courses").doc(id);
  if (!(await docRef.get()).exists) return jsonError("Course not found.", 404);

  await docRef.delete();
  const enrSnap = await db.collection("enrolments").where("courseId", "==", id).get();
  for (const doc of enrSnap.docs) await doc.ref.delete();

  return jsonOk({ message: "Deleted." });
}
