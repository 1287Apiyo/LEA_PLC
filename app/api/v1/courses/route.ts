import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser, rowsFrom } from "@/lib/firebase/api-helpers";
import { enrolmentCountsByCourse, loadRefMaps, resolveReferences } from "@/lib/firebase/enrich";

export const runtime = "nodejs";

/**
 * Course catalog — GET returns every active course enriched with programme
 * name, lesson counts and the caller's enrolment (for learners). POST creates
 * a course document (same contract as the generic resource route).
 */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.toLowerCase() ?? "";

  const courseSnap = await db.collection("courses").limit(200).get();
  const prgSnap = await db.collection("programmes").get();
  const prgTitles = new Map(prgSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)]));

  const courses = rowsFrom(courseSnap);

  // Live enrolment counts per course (admin/instructor "Learners" column).
  const enrolmentCounts = await enrolmentCountsByCourse();

  // Learner's enrolments for the enrolled flags
  let enrolmentMap = new Map<string, Record<string, unknown>>();
  if (auth.user.role === "learner") {
    const enrSnap = await db.collection("enrolments").where("learnerId", "==", auth.user.id).get();
    enrolmentMap = new Map(enrSnap.docs.map((d) => [String(d.data().courseId), { id: d.id, ...d.data() }]));
  }

  let data = courses
    .filter((c) => (c.status ?? "active") !== "archived")
    .map((c) => {
      const lessons = (c.lessons as any[]) ?? [];
      return {
        id: String(c.id),
        title: String(c.title ?? "Untitled course"),
        description: String(c.description ?? ""),
        programme: prgTitles.get(String(c.programme)) ?? "",
        lessons: lessons.length,
        lessons_count: lessons.length,
        total_minutes: lessons.reduce((s, l) => s + Number(l?.duration_minutes ?? 0), 0),
        coding: Boolean(c.coding),
        playground_language: c.playground_language ?? null,
        workspace_type: c.workspace_type ?? (c.coding ? "code" : null),
        trainer: c.trainer ? String(c.trainer) : null,
        price: c.price ?? null,
        learners: enrolmentCounts.get(String(c.id)) ?? 0,
        status: c.status ?? "active",
      };
    });

  // Resolve the trainer id into a display name (admin "Trainer" column).
  const maps = await loadRefMaps();
  resolveReferences(data, maps);

  if (search) {
    data = data.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.programme.toLowerCase().includes(search)
    );
  }

  data = data.map((c) => {
    const enr = enrolmentMap.get(c.id);
    return {
      ...c,
      enrolled: Boolean(enr),
      progress: enr ? Number(enr.progress ?? 0) : null,
      enrolment_id: enr ? String(enr.id) : null,
    };
  });

  return jsonOk({ data, meta: { total: data.length } });
}

/** POST /api/v1/courses — creates a course (mirrors the generic resource route). */
export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid payload.", 422);

  const id = body.id ? String(body.id) : `crs-${randomBytes(4).toString("hex")}`;
  const data = {
    ...body,
    id,
    lessons: Array.isArray(body.lessons) ? body.lessons : [],
    status: body.status ?? "active",
    created_at: body.created_at ?? new Date().toISOString(),
  };
  await db.collection("courses").doc(id).set(data);
  return jsonOk({ data: { ...data, lessons: data.lessons.length } }, 201);
}
