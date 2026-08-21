import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { getInstructorScope, instructorCanAccessLearner } from "@/lib/instructor-access";

export const runtime = "nodejs";

type Row = Record<string, unknown>;
const COLLECTIONS: Record<string, string> = {
  courses: "courses",
  classes: "classes",
  attendance: "attendance",
  assignments: "assignments",
  materials: "materials",
  announcements: "announcements",
  tutor_requests: "tutor_requests",
  discussions: "course_discussions",
  learners: "users",
};

function clean(value: unknown, max = 4000) { return String(value ?? "").trim().slice(0, max); }
function courseIdOf(row: Row) { return String(row.courseId ?? row.course_id ?? ""); }
function instructorIdOf(row: Row) { return String(row.instructorId ?? row.instructor_id ?? row.trainerId ?? row.trainer_id ?? row.assignedInstructorId ?? row.assigned_instructor_id ?? ""); }

async function scopedRows(resource: string, instructorId: string, isAdmin: boolean): Promise<{ rows: Row[]; courseIds: Set<string> }> {
  const db = getDb();
  const collection = COLLECTIONS[resource];
  if (!collection) return { rows: [], courseIds: new Set<string>() };
  const scope = isAdmin ? null : await getInstructorScope(instructorId);
  const courseIds = scope?.courseIds ?? new Set<string>();
  const snapshot = await db.collection(collection).limit(2000).get();
  let rows: Row[] = snapshot.docs.map((doc): Row => ({ id: doc.id, ...(doc.data() as Row) }));
  if (!isAdmin && scope) {
    if (resource === "courses") {
      rows = rows.filter((row) => scope.courseIds.has(String(row.id ?? "")));
    } else if (resource === "learners") {
      const enrolments = await db.collection("enrolments").limit(3000).get();
      const courseWideLearners = new Set(enrolments.docs
        .map((doc) => doc.data() as Row)
        .filter((row) => scope.courseWideIds.has(courseIdOf(row)))
        .map((row) => String(row.learnerId ?? row.learner_id ?? ""))
        .filter(Boolean));
      rows = rows.filter((row) => String(row.role ?? "learner") === "learner" && (scope.learnerIds.has(String(row.id ?? "")) || courseWideLearners.has(String(row.id ?? ""))));
    } else {
      rows = rows.filter((row) => {
        const courseId = courseIdOf(row);
        const learnerId = String(row.learnerId ?? row.learner_id ?? row.studentId ?? row.student_id ?? (resource === "discussions" ? row.authorId ?? row.author_id : "") ?? "");
        const classId = String(row.classId ?? row.class_id ?? "");
        const directInstructor = instructorIdOf(row) === instructorId;
        const directLearner = Boolean(learnerId && instructorCanAccessLearner(scope, learnerId, courseId));
        const groupCourse = Boolean(courseId && scope.courseWideIds.has(courseId));
        const assignedClass = scope.classIds.has(classId);
        // A course-wide assignment is a valid teaching scope; a learner-targeted assignment
        // narrows access to that learner's evidence and discussion activity.
        if (resource === "discussions") return directInstructor || groupCourse || directLearner;
        return directInstructor || assignedClass || groupCourse || directLearner;
      });
    }
  } else if (resource === "learners") {
    rows = rows.filter((row) => String(row.role ?? "") === "learner");
  }
  return { rows, courseIds };
}

async function enrich(rows: Row[]): Promise<Row[]> {
  const db = getDb();
  const [courseSnap, userSnap] = await Promise.all([db.collection("courses").limit(500).get(), db.collection("users").limit(1000).get()]);
  const courses = new Map(courseSnap.docs.map((doc) => [doc.id, String(doc.data().title ?? doc.id)]));
  const users = new Map(userSnap.docs.map((doc) => [doc.id, String(doc.data().name ?? doc.data().email ?? doc.id)]));
  return rows.map((row) => ({
    ...row,
    course_title: String(row.course_title ?? courses.get(courseIdOf(row)) ?? courseIdOf(row)),
    learner_name: String(row.learner_name ?? users.get(String(row.learnerId ?? row.learner_id ?? "")) ?? row.learnerId ?? ""),
  }));
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (!["instructor", "administrator", "admin"].includes(String(auth.user.role))) return jsonError("Instructor access required.", 403);
  const url = new URL(req.url);
  const resource = String(url.searchParams.get("resource") ?? "");
  const status = String(url.searchParams.get("status") ?? "");
  const search = String(url.searchParams.get("search") ?? "").toLowerCase();
  if (!COLLECTIONS[resource]) return jsonError("Unknown instructor workspace resource.", 404);
  const { rows, courseIds } = await scopedRows(resource, String(auth.user.id ?? ""), ["administrator", "admin"].includes(String(auth.user.role)));
  let data = await enrich(rows);
  if (status && status !== "all") data = data.filter((row) => String(row.status ?? "") === status);
  if (search) data = data.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(search)));
  data.sort((a, b) => String(b.updated_at ?? b.created_at ?? "").localeCompare(String(a.updated_at ?? a.created_at ?? "")));
  const counts = data.reduce<Record<string, number>>((acc, row) => { const key = String(row.status ?? "unclassified"); acc[key] = (acc[key] ?? 0) + 1; return acc; }, {});
  return jsonOk({ data, meta: { total: data.length, statuses: counts, assigned_course_ids: [...courseIds] } });
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (!["instructor", "administrator", "admin"].includes(String(auth.user.role))) return jsonError("Instructor access required.", 403);
  const body = (await req.json().catch(() => null)) as Row | null;
  if (!body) return jsonError("Invalid workspace payload.", 422);
  const resource = clean(body.resource, 60);
  const courseId = clean(body.courseId ?? body.course_id, 160);
  const instructorId = String(auth.user.id ?? "");
  const isAdmin = ["administrator", "admin"].includes(String(auth.user.role));
  const scope = isAdmin ? null : await getInstructorScope(instructorId);
  if (!["attendance", "announcements", "materials"].includes(resource)) return jsonError("This workspace action is not available.", 422);
  if (!courseId) return jsonError("Select a course first.", 422);
  if (!isAdmin && scope && !scope.courseIds.has(courseId)) return jsonError("You are not assigned to this course.", 403);
  const now = new Date().toISOString();
  const db = getDb();
  let data: Row;
  if (resource === "attendance") {
    const learnerId = clean(body.learnerId ?? body.learner_id, 160);
    const attendanceStatus = clean(body.status, 40) || "present";
    if (!learnerId) return jsonError("Select a learner.", 422);
    if (!isAdmin && scope && !instructorCanAccessLearner(scope, learnerId, courseId)) return jsonError("This learner is not assigned to you for the selected course.", 403);
    if (!["present", "absent", "late", "excused"].includes(attendanceStatus)) return jsonError("Choose a valid attendance status.", 422);
    data = { learnerId, courseId, classId: clean(body.classId ?? body.class_id, 160), date: clean(body.date, 40) || now.slice(0, 10), status: attendanceStatus, notes: clean(body.notes, 1000), instructorId, created_at: now, updated_at: now };
  } else if (resource === "announcements") {
    const title = clean(body.title, 180);
    const content = clean(body.body ?? body.content, 5000);
    if (!title || !content) return jsonError("Announcement title and message are required.", 422);
    data = { title, body: content, content, courseId, instructorId, published: body.published !== false, created_at: now, updated_at: now };
    const enrolments = await db.collection("enrolments").where("courseId", "==", courseId).limit(500).get();
    await Promise.all(enrolments.docs.map((doc) => {
      const learnerId = String((doc.data() as Row).learnerId ?? "");
      return learnerId ? db.collection("notifications").add({ recipientId: learnerId, learnerId, type: "course_announcement", title, body: content, href: "/learner/discussions", read: false, created_at: now }) : Promise.resolve();
    }));
  } else {
    const title = clean(body.title, 180);
    const url = clean(body.url, 1000);
    if (!title || !url) return jsonError("Material title and URL are required.", 422);
    data = { title, url, description: clean(body.description, 2000), category: clean(body.category, 80) || "lesson material", courseId, instructorId, published: body.published !== false, created_at: now, updated_at: now };
    const enrolments = await db.collection("enrolments").where("courseId", "==", courseId).limit(500).get();
    await Promise.all(enrolments.docs.map((doc) => {
      const learnerId = String((doc.data() as Row).learnerId ?? "");
      return learnerId ? db.collection("notifications").add({ recipientId: learnerId, learnerId, type: "course_material", title: `New material: ${title}`, body: String(body.description ?? "Your instructor added a new course resource."), href: "/learner/courses", read: false, created_at: now }) : Promise.resolve();
    }));
  }
  if (resource === "attendance") {
    const learnerId = String(data.learnerId ?? "");
    if (learnerId) {
      await db.collection("notifications").add({ recipientId: learnerId, learnerId, type: "attendance_update", title: "Attendance updated", body: `Your attendance was recorded as ${String(data.status)} for ${String(data.date)}.`, href: "/learner/attendance", read: false, created_at: now });
    }
  }
  const ref = await db.collection(COLLECTIONS[resource]).add(data);
  return jsonOk({ data: { id: ref.id, ...data } }, 201);
}
