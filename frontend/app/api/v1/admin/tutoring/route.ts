import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

function isAdministrator(role: string) {
  return role === "administrator" || role === "admin";
}

type TutorRequestRow = Record<string, unknown> & { id: string };

type UserRow = Record<string, unknown>;

type CourseRow = Record<string, unknown>;

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (!isAdministrator(auth.user.role)) return jsonError("Administrator access required.", 403);

  const db = getDb();
  const snapshot = await db.collection("tutor_requests").limit(200).get();
  const requests: TutorRequestRow[] = snapshot.docs
    .map((doc): TutorRequestRow => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));

  const learnerIds = Array.from(new Set(requests.map((row) => String(row.learnerId ?? "")).filter(Boolean)));
  const courseIds = Array.from(new Set(requests.map((row) => String(row.courseId ?? "")).filter(Boolean)));
  const [learners, courses, instructors] = await Promise.all([
    Promise.all(learnerIds.map((id) => db.collection("users").doc(id).get())),
    Promise.all(courseIds.map((id) => db.collection("courses").doc(id).get())),
    db.collection("users").where("role", "==", "instructor").limit(100).get(),
  ]);
  const learnerMap = new Map<string, UserRow>(learners.filter((doc) => doc.exists).map((doc) => [doc.id, doc.data() as UserRow]));
  const courseMap = new Map<string, CourseRow>(courses.filter((doc) => doc.exists).map((doc) => [doc.id, doc.data() as CourseRow]));
  const instructorOptions = instructors.docs.map((doc) => {
    const instructor = doc.data() as UserRow;
    return {
      id: doc.id,
      name: String(instructor.name ?? instructor.fullName ?? instructor.email ?? doc.id),
      email: String(instructor.email ?? ""),
    };
  });

  return jsonOk({
    data: requests.map((row) => {
      const learner = learnerMap.get(String(row.learnerId ?? ""));
      const course = courseMap.get(String(row.courseId ?? ""));
      return {
        ...row,
        learner_name: String(learner?.name ?? learner?.fullName ?? row.learnerId ?? "Learner"),
        learner_email: String(learner?.email ?? ""),
        course_title: String(row.course_title ?? course?.title ?? row.courseId ?? "Course"),
      };
    }),
    instructors: instructorOptions,
  });
}

export async function PATCH(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (!isAdministrator(auth.user.role)) return jsonError("Administrator access required.", 403);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid request.", 422);

  const requestId = String(body.requestId ?? "");
  const status = String(body.status ?? "");
  const responseMessage = String(body.responseMessage ?? "").trim();
  const confirmedDate = String(body.confirmedDate ?? "").trim();
  const confirmedTime = String(body.confirmedTime ?? "").trim();
  const venue = String(body.venue ?? "").trim();
  const meetingLink = String(body.meetingLink ?? "").trim();
  const meetingPlatform = String(body.meetingPlatform ?? "").trim();
  const instructorId = String(body.instructorId ?? "").trim();
  const instructorName = String(body.instructorName ?? "").trim();
  const instructorEmail = String(body.instructorEmail ?? "").trim();
  const allowedStatuses = new Set(["requested", "under_review", "quoted", "confirmed", "declined", "cancelled"]);
  if (!requestId || !allowedStatuses.has(status)) return jsonError("Choose a valid request and response status.", 422);
  if (status === "confirmed" && (!confirmedDate || !confirmedTime || !venue)) {
    return jsonError("Confirmed requests require a date, time, and venue or meeting link.", 422);
  }
  const db = getDb();
  const requestRef = db.collection("tutor_requests").doc(requestId);
  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) return jsonError("Tutor request not found.", 404);
  const request = requestSnap.data() as Record<string, unknown>;
  if (status === "confirmed" && String(request.mode ?? "") === "online" && !meetingLink) {
    return jsonError("Confirmed online requests require an online meeting link.", 422);
  }
  const now = new Date().toISOString();
  let classId = String(request.classId ?? "");

  if (status === "confirmed") {
    classId = classId || `class-${randomBytes(5).toString("hex")}`;
    const classData = {
      id: classId,
      learnerId: String(request.learnerId ?? ""),
      courseId: String(request.courseId ?? ""),
      course: String(request.course_title ?? request.courseId ?? "Tutor session"),
      date: confirmedDate,
      start_time: confirmedTime,
      venue,
      mode: String(request.mode ?? "in_person"),
      meetingLink,
      meetingPlatform,
      instructorId,
      instructorName,
      instructorEmail,
      status: "scheduled",
      tutor_request_id: requestId,
      updated_at: now,
      created_at: request.created_at ?? now,
    };
    await db.collection("classes").doc(classId).set(classData, { merge: true });
  }

  const update = {
    status,
    admin_response: responseMessage,
    responded_by: auth.user.id,
    responded_at: now,
    ...(confirmedDate ? { confirmedDate } : {}),
    ...(confirmedTime ? { confirmedTime } : {}),
    ...(venue ? { venue } : {}),
    ...(meetingLink ? { meetingLink } : {}),
    ...(meetingPlatform ? { meetingPlatform } : {}),
    ...(instructorId ? { instructorId } : {}),
    ...(instructorName ? { instructorName } : {}),
    ...(instructorEmail ? { instructorEmail } : {}),
    ...(classId ? { classId } : {}),
    updated_at: now,
  };
  await requestRef.set(update, { merge: true });

  return jsonOk({ data: { id: requestId, ...request, ...update } });
}
