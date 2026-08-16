import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { loadRefMaps, resolveReferences } from "@/lib/firebase/enrich";

export const runtime = "nodejs";

/** Resource → Firestore collection mapping (must match the list route). */
const COLLECTIONS: Record<string, string> = {
  learners: "users",
  instructors: "users",
  staff: "users",
  programmes: "programmes",
  courses: "courses",
  content: "content",
  classes: "classes",
  attendance: "attendance",
  assessments: "assessments",
  certificates: "certificates",
  companies: "companies",
  schools: "schools",
  partners: "partners",
  projects: "projects",
  events: "events",
  leads: "leads",
  assignments: "assignments",
  submissions: "submissions",
  materials: "materials",
  announcements: "announcements",
  messages: "messages",
  achievements: "achievements",
  progress: "enrolments",
  bookmarks: "bookmarks",
  downloads: "downloads",
  finance: "payments",
  notifications: "notifications",
};

const SENSITIVE = new Set(["salt", "password_hash"]);

function sanitize(row: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (!SENSITIVE.has(key)) clean[key] = value;
  }
  return clean;
}

/** GET /api/v1/[resource]/[id] — returns a single document. */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ resource: string; id: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const { resource, id } = await ctx.params;
  const collection = COLLECTIONS[resource];
  if (!collection) return jsonError("Unknown resource.", 404);

  const db = getDb();
  const docRef = db.collection(collection).doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return jsonError("Record not found.", 404);

  const data = sanitize({ id, ...snap.data() });

  // Ecosystem enrichment:
  // - User records (learners/instructors/staff) get their enrolled courses
  //   with progress, so the admin detail page shows what they're studying.
  // - Every other record gets its raw reference ids resolved to labels.
  if (resource === "learners" || resource === "instructors" || resource === "staff") {
    const enrSnap = await db.collection("enrolments").where("learnerId", "==", id).get();
    const courseSnap = await db.collection("courses").limit(200).get();
    const titles = new Map(courseSnap.docs.map((d) => [d.id, String(d.data().title ?? d.id)]));
    data.enrolments = enrSnap.docs.map((doc) => {
      const enr = doc.data();
      const courseId = String(enr.courseId ?? "");
      return {
        courseId,
        course_title: titles.get(courseId) ?? courseId,
        progress: Number(enr.progress ?? 0),
        completed_lessons: (enr.completed_lessons as string[]) ?? [],
        enrolled_at: String(enr.enrolled_at ?? ""),
      };
    });
    data.courses_enrolled = (data.enrolments as unknown[]).length;
  } else {
    const maps = await loadRefMaps();
    resolveReferences([data], maps);
  }

  return jsonOk({ data });
}

/** PATCH /api/v1/[resource]/[id] — updates a document. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ resource: string; id: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const { resource, id } = await ctx.params;
  const collection = COLLECTIONS[resource];
  if (!collection) return jsonError("Unknown resource.", 404);

  const db = getDb();
  const docRef = db.collection(collection).doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return jsonError("Record not found.", 404);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid payload.", 422);

  // Never allow the document id or sensitive auth fields to be overwritten.
  const { id: _ignored, salt, password_hash, ...updates } = body;
  updates.updated_at = new Date().toISOString();

  await docRef.update(updates);
  const updated = await docRef.get();
  return jsonOk({ data: sanitize({ id, ...updated.data() }) });
}

/** DELETE /api/v1/[resource]/[id] — removes a document. */
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ resource: string; id: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const { resource, id } = await ctx.params;
  const collection = COLLECTIONS[resource];
  if (!collection) return jsonError("Unknown resource.", 404);

  const db = getDb();
  const docRef = db.collection(collection).doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return jsonError("Record not found.", 404);

  await docRef.delete();
  return jsonOk({ message: "Deleted." });
}
