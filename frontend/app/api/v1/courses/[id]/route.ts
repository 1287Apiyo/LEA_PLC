import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { learnerNames } from "@/lib/firebase/enrich";
import { courseMaterialsFor } from "@/lib/course-materials";

export const runtime = "nodejs";

function serialiseLessonContent(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const sections = Array.isArray(value.sections) ? value.sections : [];
  if (!sections.length) return null;
  return {
    version: Number(value.version ?? 1),
    eyebrow: String(value.eyebrow ?? "Slide-aligned lesson"),
    learning_goal: String(value.learning_goal ?? ""),
    deck: String(value.deck ?? ""),
    slide_topic: String(value.slide_topic ?? ""),
    slide_refs: Array.isArray(value.slide_refs) ? value.slide_refs.map(String) : [],
    sections: sections
      .filter((section): section is Record<string, unknown> => Boolean(section) && typeof section === "object")
      .map((section, index) => ({
        id: String(section.id ?? `section-${index + 1}`),
        title: String(section.title ?? `Section ${index + 1}`),
        kind: String(section.kind ?? "concept"),
        body: String(section.body ?? ""),
      })),
  };
}

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
  const submissionsByLesson = new Map<string, Record<string, unknown>>();
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

    const submissionSnap = await db
      .collection("submissions")
      .where("learnerId", "==", auth.user.id)
      .limit(500)
      .get();
    for (const submissionDoc of submissionSnap.docs) {
      const submission = submissionDoc.data();
      if (String(submission.courseId ?? "") !== id) continue;
      const lessonId = String(submission.lessonId ?? "");
      if (lessonId) submissionsByLesson.set(lessonId, { id: submissionDoc.id, ...submission });
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
  const courseResources = new Map<string, Record<string, unknown>>();
  for (const currentLesson of lessons) {
    const lessonResources = Array.isArray(currentLesson.resources) ? currentLesson.resources : [];
    for (const currentResource of lessonResources as Record<string, unknown>[]) {
      const resourceId = String(currentResource.id ?? currentResource.url ?? 'resource');
      if (!courseResources.has(resourceId)) courseResources.set(resourceId, currentResource);
    }
  }
  const resources = [...courseResources.values()].map((currentResource, index) => ({
    id: String(currentResource.id ?? `resource-${index + 1}`),
    title: String(currentResource.title ?? 'Learning resource'),
    type: String(currentResource.type ?? 'reference'),
    url: String(currentResource.url ?? ''),
    download_url: String(currentResource.download_url ?? ''),
    description: String(currentResource.description ?? ''),
  }));

  return jsonOk({
    data: {
      id,
            title: String(course.title ?? "Untitled course"),
      description: String(course.description ?? ""),
      summary: String(course.summary ?? course.description ?? ""),
      programme,
      programme_id: String(course.programme ?? ""),
      sequence: Number(course.sequence ?? 99),
      level: String(course.level ?? "Applied"),
      track: String(course.track ?? "Core"),
      outcomes: Array.isArray(course.outcomes) ? course.outcomes.map(String) : [],
      skills: Array.isArray(course.skills) ? course.skills.map(String) : [],
      deliverable: String(course.deliverable ?? course.project ?? ""),
      project: String(course.project ?? course.deliverable ?? ""),
      trend_tags: Array.isArray(course.trend_tags) ? course.trend_tags.map(String) : [],
      duration_weeks: Number(course.duration_weeks ?? 0),
      resource_count: Number(course.resource_count ?? resources.length),
      video_count: Number(course.video_count ?? new Set(lessons.map((lesson) => String(lesson.video_url ?? '')).filter(Boolean)).size),
      resources,
      course_materials: courseMaterialsFor(id),
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
        video_source: String(l.video_source ?? ""),
                description: String(l.description ?? ""),
        notes: String(l.notes ?? ""),
        lesson_content: serialiseLessonContent(l.lesson_content),
        assignment: String(l.assignment ?? ""),

        resources: Array.isArray(l.resources)
          ? (l.resources as Record<string, unknown>[]).map((currentResource, resourceIndex) => ({
              id: String(currentResource.id ?? `resource-${resourceIndex + 1}`),
              title: String(currentResource.title ?? 'Learning resource'),
              type: String(currentResource.type ?? 'reference'),
              url: String(currentResource.url ?? ''),
              download_url: String(currentResource.download_url ?? ''),
              description: String(currentResource.description ?? ''),
            }))
          : [],
        submission: submissionsByLesson.has(String(l.id ?? `lesson-${i + 1}`))
          ? (() => {
              const submission = submissionsByLesson.get(String(l.id ?? `lesson-${i + 1}`))!;
              return {
                id: String(submission.id ?? ""),
                course_id: String(submission.courseId ?? id),
                lesson_id: String(submission.lessonId ?? l.id ?? `lesson-${i + 1}`),
                response_text: String(submission.response_text ?? ""),
                evidence_url: submission.evidence_url ? String(submission.evidence_url) : null,
                status: submission.status === "graded" ? "graded" : "submitted",
                submitted_at: String(submission.submitted_at ?? submission.created_at ?? ""),
                grade: submission.grade === null || submission.grade === undefined ? null : Number(submission.grade),
                feedback: String(submission.feedback ?? ""),
              };
            })()
          : null,
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
