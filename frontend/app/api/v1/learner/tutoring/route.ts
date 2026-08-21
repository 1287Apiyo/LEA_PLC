import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

const COURSE_PRICES_KES: Record<string, number> = {
  "web-development": 45000,
  "api-integration": 45000,
  "app-development": 45000,
  "ai-assisted-engineering": 45000,
  "software-product-studio": 45000,
  "ai-foundations": 35000,
  "ai-workflows": 35000,
  "basic-computer-skills": 18000,
  "scratch-programming": 18000,
};

const SESSION_PRICES_KES = {
  in_person: { single: 2500, bundle: 9000, label: "Face-to-face tutor session" },
  online: { single: 1800, bundle: 6500, label: "Online tutor session" },
} as const;

function coursePrice(course: Record<string, unknown>) {
  const id = String(course.id ?? "");
  const slug = String(course.slug ?? "");
  return Number(course.price_kes ?? course.price ?? COURSE_PRICES_KES[id] ?? COURSE_PRICES_KES[slug] ?? 0);
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();

  const [requestsSnap, classesSnap, enrolmentsSnap, coursesSnap] = await Promise.all([
    db.collection("tutor_requests").limit(500).get(),
    db.collection("classes").limit(500).get(),
    db.collection("enrolments").limit(500).get(),
    db.collection("courses").limit(200).get(),
  ]);
  const courses = coursesSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }));
  const courseMap = new Map<string, Record<string, unknown>>(courses.map((course) => [String(course.id), course]));
  const learnerId = String(auth.user.id ?? "");
  const requests = requestsSnap.docs
    .map((doc): Record<string, unknown> & { id: string } => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
    .filter((row) => String(row.learnerId ?? row.learner_id ?? "") === learnerId)
    .map((row) => ({
      ...row,
      learnerId: String(row.learnerId ?? row.learner_id ?? learnerId),
      courseId: String(row.courseId ?? row.course_id ?? ""),
      status: String(row.status ?? "requested"),
      admin_response: String(row.admin_response ?? row.response_message ?? row.responseMessage ?? ""),
      confirmedDate: String(row.confirmedDate ?? row.confirmed_date ?? ""),
      confirmedTime: String(row.confirmedTime ?? row.confirmed_time ?? ""),
      venue: String(row.venue ?? row.location ?? ""),
      meetingLink: String(row.meetingLink ?? row.meeting_link ?? ""),
      meetingPlatform: String(row.meetingPlatform ?? row.meeting_platform ?? (row.mode === "online" ? "Online meeting" : "")),
      instructorId: String(row.instructorId ?? row.instructor_id ?? row.trainerId ?? row.trainer_id ?? ""),
      instructorName: String(row.instructorName ?? row.instructor_name ?? ""),
      instructorEmail: String(row.instructorEmail ?? row.instructor_email ?? ""),
    }));
  const classes = classesSnap.docs
    .map((doc): Record<string, unknown> & { id: string } => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
    .filter((row) => String(row.learnerId ?? row.learner_id ?? "") === learnerId)
    .map((row) => ({
      ...row,
      learnerId: String(row.learnerId ?? row.learner_id ?? learnerId),
      courseId: String(row.courseId ?? row.course_id ?? ""),
      confirmedDate: String(row.confirmedDate ?? row.confirmed_date ?? row.date ?? ""),
      confirmedTime: String(row.confirmedTime ?? row.confirmed_time ?? row.start_time ?? ""),
      meetingLink: String(row.meetingLink ?? row.meeting_link ?? ""),
      meetingPlatform: String(row.meetingPlatform ?? row.meeting_platform ?? ""),
      instructorId: String(row.instructorId ?? row.instructor_id ?? row.trainerId ?? row.trainer_id ?? ""),
      instructorName: String(row.instructorName ?? row.instructor_name ?? ""),
    }));
  const enrolledCourses = enrolmentsSnap.docs.map((doc) => doc.data() as Record<string, unknown>).filter((row) => String(row.learnerId ?? row.learner_id ?? "") === learnerId).map((row, index) => {
    const courseId = String(row.courseId ?? row.course_id ?? "");
    const course = courseMap.get(courseId);
    return {
      id: String(course?.id ?? courseId ?? `enrolment-${index}`),
      title: String(course?.title ?? courseId ?? "Enrolled course"),
      programme_id: String(course?.programme_id ?? ""),
      price_kes: coursePrice({ id: String(course?.id ?? courseId ?? ""), ...course }),
    };
  });

  return jsonOk({
    data: {
      requests,
      classes,
      enrolledCourses,
      pricing: SESSION_PRICES_KES,
    },
  });
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid request.", 422);

  const mode = body.mode === "online" ? "online" : body.mode === "in_person" ? "in_person" : "";
  const courseId = String(body.courseId ?? "");
  const preferredDate = String(body.preferredDate ?? "");
  const preferredTime = String(body.preferredTime ?? "");
  const durationMinutes = Number(body.durationMinutes ?? 60);
  if (!mode || !courseId || !preferredDate || !preferredTime) {
    return jsonError("Choose a course, session mode, preferred date, and preferred time.", 422);
  }
  if (![60, 240].includes(durationMinutes)) return jsonError("Choose either a single 60-minute session or a four-session package.", 422);

  const db = getDb();
  const enrolment = await db.collection("enrolments").where("learnerId", "==", auth.user.id).where("courseId", "==", courseId).limit(1).get();
  if (enrolment.empty) return jsonError("You must be enrolled in the course before requesting tutor support.", 403);

  const courseSnap = await db.collection("courses").doc(courseId).get();
  if (!courseSnap.exists) return jsonError("Course not found.", 404);
  const course: Record<string, unknown> = { id: courseSnap.id, ...(courseSnap.data() as Record<string, unknown>) };
  const price = mode === "in_person" ? (durationMinutes === 240 ? 9000 : 2500) : (durationMinutes === 240 ? 6500 : 1800);
  const requestId = `tut-${randomBytes(5).toString("hex")}`;
  const request = {
    id: requestId,
    learnerId: auth.user.id,
    courseId,
    course_title: String(course.title ?? courseId),
    mode,
    durationMinutes,
    preferredDate,
    preferredTime,
    notes: String(body.notes ?? ""),
    quoted_price_kes: price,
    course_price_kes: coursePrice(course),
    status: "requested",
    created_at: new Date().toISOString(),
  };
  await db.collection("tutor_requests").doc(requestId).set(request);
  return jsonOk({ data: request }, 201);
}
