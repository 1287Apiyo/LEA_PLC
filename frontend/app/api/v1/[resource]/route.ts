import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import {
  enrolmentCountsByCourse,
  loadRefMaps,
  resolveReferences,
} from "@/lib/firebase/enrich";
import { issueCourseCertificate } from "@/lib/course-completion";

export const runtime = "nodejs";

/**
 * Generic resource endpoints — one pattern for every module table.
 *
 * Resource → Firestore mapping (users are split by role; everything else
 * maps to its collection). Unseeded resources return empty lists.
 */
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
  payments: "payments",
  invoices: "invoices",
  expenses: "expenses",
  notifications: "notifications",
  onboarding_assessments: "onboarding_assessments",
  career_profiles: "career_profiles",
  career_applications: "career_applications",
  learner_preferences: "learner_preferences",
  quiz_attempts: "quiz_attempts",
};

const ROLE_FILTERS: Record<string, string> = {
  learners: "learner",
  instructors: "instructor",
  staff: "staff",
};

const LEARNER_CREATE_RESOURCES = new Set(["messages", "bookmarks", "downloads", "projects", "onboarding_assessments", "career_profiles", "career_applications", "learner_preferences", "certificates"]);
const LEARNER_SCOPED_RESOURCES = new Set([
  "classes",
  "attendance",
  "certificates",
  "projects",
  "submissions",
  "messages",
  "achievements",
  "progress",
  "bookmarks",
  "downloads",
  "notifications",
  "onboarding_assessments",
  "career_profiles",
  "career_applications",
  "learner_preferences",
  "assignments",
  "quiz_attempts",
]);

const SENSITIVE = new Set(["salt", "password_hash"]);

function sanitize(row: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (!SENSITIVE.has(key)) clean[key] = value;
  }
  return clean;
}

function hasLearnerOwner(row: Record<string, unknown>, learnerId: string) {
  return ["learnerId", "learner_id", "userId", "user_id", "ownerId", "owner_id", "created_by", "recipientId", "recipient_id", "senderId", "sender_id"]
    .some((key) => String(row[key] ?? "") === learnerId);
}

async function learnerRows(resource: string, learnerId: string) {
  const db = getDb();
  const base = db.collection(COLLECTIONS[resource]);
  const snap = await base.limit(200).get();
  let rows = snap.docs.map((doc) => sanitize({ id: doc.id, ...doc.data() }));

  const enrolmentSnap = await db.collection("enrolments").where("learnerId", "==", learnerId).get();
  const enrolledCourseIds = new Set(enrolmentSnap.docs.map((doc) => String(doc.data().courseId ?? "")));

  if (resource === "progress") {
    rows = rows.filter((row) => String(row.learnerId ?? row.learner_id ?? "") === learnerId);
  } else if (resource === "assignments" || resource === "classes") {
    rows = rows.filter((row) => hasLearnerOwner(row, learnerId) || enrolledCourseIds.has(String(row.courseId ?? row.course_id ?? "")));
  } else if (resource === "achievements") {
    rows = rows.filter((row) => hasLearnerOwner(row, learnerId) || row.is_global === true || row.scope === "learner");
  } else if (LEARNER_SCOPED_RESOURCES.has(resource)) {
    rows = rows.filter((row) => hasLearnerOwner(row, learnerId));
  }

  return rows;
}

/** GET /api/v1/[resource]?page=1&per_page=10&search=…&sort=…&order=… */
export async function GET(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const { resource } = await ctx.params;
  const collection = COLLECTIONS[resource];
  if (!collection) return jsonOk({ data: [], meta: emptyMeta(1, 10) });

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const perPage = Math.min(50, Math.max(1, Number(url.searchParams.get("per_page") ?? 10) || 10));
  const search = url.searchParams.get("search")?.toLowerCase() ?? "";
  const sort = url.searchParams.get("sort");
  const order = url.searchParams.get("order") === "desc" ? -1 : 1;

  const roleFilter = ROLE_FILTERS[resource];
  let rows = auth.user.role === "learner" && LEARNER_SCOPED_RESOURCES.has(resource)
    ? await learnerRows(resource, auth.user.id)
    : await (roleFilter
      ? db.collection(collection).where("role", "==", roleFilter).limit(200).get()
      : db.collection(collection).limit(200).get()).then((snap) => snap.docs.map((d) => sanitize({ id: d.id, ...d.data() })));

  // Ecosystem enrichment — attach live enrolment counts to courses and resolve
  // raw reference ids (course/learner/trainer/programme/assignment) into
  // human-readable labels for every other resource.
  if (resource === "courses") {
    const counts = await enrolmentCountsByCourse();
    rows = rows.map((row) => ({ ...row, learners: counts.get(String(row.id)) ?? 0 }));
  }
  if (!roleFilter) {
    const maps = await loadRefMaps();
    resolveReferences(rows, maps);
  }

  if (search) {
    rows = rows.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(search))
    );
  }

  if (sort && sort !== "id") {
    rows = [...rows].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * order;
      return String(av ?? "").localeCompare(String(bv ?? "")) * order;
    });
  }

  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = rows.slice(start, start + perPage);

  return jsonOk({
    data,
    meta: {
      current_page: page,
      per_page: perPage,
      total,
      last_page: lastPage,
      from: data.length ? start + 1 : null,
      to: data.length ? start + data.length : null,
    },
  });
}

/** POST /api/v1/[resource] — creates a document in the mapped collection. */
export async function POST(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const { resource } = await ctx.params;
  const collection = COLLECTIONS[resource];
  if (!collection) return jsonError("Unknown resource.", 404);
  if (auth.user.role === "learner" && !LEARNER_CREATE_RESOURCES.has(resource)) {
    return jsonError("Learners cannot create this resource directly.", 403);
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid payload.", 422);

  if (resource === "certificates" && auth.user.role === "learner") {
    const courseId = String(body.courseId ?? body.course_id ?? "");
    if (!courseId) return jsonError("A course is required before requesting a certificate.", 422);
    const learnerId = String(auth.user.id ?? "");
    if (!learnerId) return jsonError("Learner identity is missing.", 401);
    const result = await issueCourseCertificate(db, learnerId, courseId);
    if ("error" in result && !result.completion) return jsonError(String(result.error ?? "Certificate request failed."), 404);
    if ("error" in result) return jsonError(String(result.error ?? "Complete the course requirements first."), 422);
    return jsonOk({ data: { ...result.certificate, completion: result.completion, existing: result.existing } }, result.existing ? 200 : 201);
  }

  const id = body.id ? String(body.id) : `${resource.slice(0, 3)}-${randomBytes(4).toString("hex")}`;
  const data = {
    ...body,
    id,
    ...(auth.user.role === "learner" ? { learnerId: auth.user.id, created_by: auth.user.id } : {}),
    created_at: body.created_at ?? new Date().toISOString(),
  };
  try {
    await db.collection(collection).doc(id).set(data);
  } catch (error) {
    console.error(`[resource POST] Failed to save ${resource}.`, error);
    const reason = error instanceof Error ? error.message : "Unknown Firestore error.";
    return jsonError(
      process.env.NODE_ENV === "development"
        ? `Could not save ${resource} record: ${reason}`
        : "Could not save record.",
      500,
    );
  }
  return jsonOk({ data: sanitize(data) }, 201);
}

function emptyMeta(page: number, perPage: number) {
  return {
    current_page: page,
    per_page: perPage,
    total: 0,
    last_page: 1,
    from: null,
    to: null,
  };
}
