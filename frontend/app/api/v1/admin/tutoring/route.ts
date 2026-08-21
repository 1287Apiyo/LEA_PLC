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

  const learnerIds = Array.from(new Set(requests.map((row) => String(row.learnerId ?? row.learner_id ?? "")).filter(Boolean)));
  const courseIds = Array.from(new Set(requests.map((row) => String(row.courseId ?? row.course_id ?? "")).filter(Boolean)));
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
      const learner = learnerMap.get(String(row.learnerId ?? row.learner_id ?? ""));
      const course = courseMap.get(String(row.courseId ?? row.course_id ?? ""));
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
  const db = getDb();
  const requestRef = db.collection("tutor_requests").doc(requestId);
  const requestSnap = await requestRef.get();
  if (!requestSnap.exists) return jsonError("Tutor request not found.", 404);
  const request = requestSnap.data() as Record<string, unknown>;
  const learnerId = String(request.learnerId ?? request.learner_id ?? "");
  const courseId = String(request.courseId ?? request.course_id ?? "");
  const requestMode = String(request.mode ?? "");
  if (status === "confirmed" && (!confirmedDate || !confirmedTime || (requestMode === "in_person" && !venue) || (requestMode === "online" && !meetingLink))) {
    return jsonError("Confirmed requests require a date, time, and the appropriate venue or meeting link.", 422);
  }
  const now = new Date().toISOString();
  let classId = String(request.classId ?? "");

  if (status === "confirmed") {
    classId = classId || `class-${randomBytes(5).toString("hex")}`;
    const classData = {
      id: classId,
      learnerId,
      learner_id: learnerId,
      courseId,
      course_id: courseId,
      course: String(request.course_title ?? request.courseId ?? "Tutor session"),
      course_title: String(request.course_title ?? request.courseId ?? "Tutor session"),
      date: confirmedDate,
      confirmedDate,
      start_time: confirmedTime,
      confirmedTime,
      venue,
      mode: String(request.mode ?? "in_person"),
      meetingLink,
      meeting_link: meetingLink,
      meetingPlatform,
      meeting_platform: meetingPlatform,
      instructorId,
      trainerId: instructorId,
      instructorName,
      instructorEmail,
      status: "scheduled",
      tutor_request_id: requestId,
      tutorRequestId: requestId,
      updated_at: now,
      created_at: request.created_at ?? now,
    };
    await db.collection("classes").doc(classId).set(classData, { merge: true });
  }

  const update = {
    status,
    admin_response: responseMessage,
    response_message: responseMessage,
    responded_by: auth.user.id,
    responded_at: now,
    ...(confirmedDate ? { confirmedDate, confirmed_date: confirmedDate } : {}),
    ...(confirmedTime ? { confirmedTime, confirmed_time: confirmedTime } : {}),
    ...(venue ? { venue, location: venue } : {}),
    ...(meetingLink ? { meetingLink, meeting_link: meetingLink } : {}),
    ...(meetingPlatform ? { meetingPlatform, meeting_platform: meetingPlatform } : {}),
    ...(instructorId ? { instructorId, instructor_id: instructorId, trainerId: instructorId, trainer_id: instructorId } : {}),
    ...(instructorName ? { instructorName, instructor_name: instructorName } : {}),
    ...(instructorEmail ? { instructorEmail, instructor_email: instructorEmail } : {}),
    ...(classId ? { classId, class_id: classId } : {}),
    updated_at: now,
  };
  await requestRef.set(update, { merge: true });

  const courseTitle = String(request.course_title ?? courseId ?? "your course");
  if (learnerId) {
    const learnerMessage = responseMessage || (status === "confirmed" ? "Your tutor session has been confirmed." : `Your tutor request is now ${status.replaceAll("_", " ")}.`);
    await db.collection("notifications").add({
      recipientId: learnerId,
      learnerId,
      type: "tutor_update",
      title: status === "confirmed" ? "Tutor session confirmed" : "Tutor request updated",
      body: `${courseTitle}: ${learnerMessage}`,
      href: "/learner/tutor-sessions",
      read: false,
      created_at: now,
      tutorRequestId: requestId,
      status,
    });
  }
  if (instructorId && instructorId !== String(auth.user.id ?? "")) {
    await db.collection("notifications").add({
      recipientId: instructorId,
      instructorId,
      type: "tutor_assignment",
      title: status === "confirmed" ? "Tutor session assigned" : "Tutor request updated",
      body: `${courseTitle} has a tutor request marked ${status.replaceAll("_", " ")}.`,
      href: "/instructor/tutor-sessions",
      read: false,
      created_at: now,
      tutorRequestId: requestId,
      learnerId,
      status,
    });
  }

  return jsonOk({ data: { id: requestId, ...request, ...update } });
}
