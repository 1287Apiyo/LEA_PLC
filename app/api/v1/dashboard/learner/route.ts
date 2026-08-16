import { getDb } from "@/lib/firebase/admin";
import { courseInfo, jsonError, jsonOk, requireUser, rowsFrom, userName } from "@/lib/firebase/api-helpers";
import type { LearnerDashboard } from "@/types/dashboard";

export const runtime = "nodejs";

/** GET /api/v1/dashboard/learner — the learner's personal dashboard. */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Forbidden.", 403);
  const db = getDb();
  const me = auth.user.id;

  // Enrolments → my courses
  const enrolSnap = await db.collection("enrolments").where("learnerId", "==", me).get();
  const enrolments = rowsFrom(enrolSnap);
  const myCourses = await Promise.all(
    enrolments.map(async (e) => {
      const info = await courseInfo(String(e.courseId));
      return {
        id: String(e.courseId),
        title: info.title,
        programme: info.programme,
        progress: Number(e.progress ?? 0),
        next_lesson: String(e.next_lesson ?? ""),
        deadline: e.deadline ? new Date(e.deadline).toISOString() : null,
      };
    })
  );

  // Submissions → assignments
  const subSnap = await db.collection("submissions").where("learnerId", "==", me).get();
  const submissions = rowsFrom(subSnap);
  const assignments = await Promise.all(
    submissions.map(async (s) => {
      const aSnap = await db.collection("assignments").doc(String(s.assignmentId)).get();
      const a = aSnap.exists ? aSnap.data()! : { title: "Assignment", courseId: "", due_at: new Date().toISOString() };
      const info = a.courseId ? await courseInfo(String(a.courseId)) : { title: "" };
      return {
        id: String(s.assignmentId).toUpperCase(),
        title: String(a.title),
        course: info.title || "Unassigned",
        due_at: new Date(a.due_at).toISOString(),
        status: (s.status ?? "open") as "open" | "submitted" | "graded" | "overdue",
        grade: s.grade !== null && s.grade !== undefined ? Number(s.grade) : null,
      };
    })
  );

  // Attendance
  const attSnap = await db.collection("attendance").where("learnerId", "==", me).get();
  const attendance = rowsFrom(attSnap);
  const present = attendance.filter((a) => a.status === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;

  // Certificates
  const certSnap = await db.collection("certificates").where("learnerId", "==", me).get();
  const certificates = certSnap.docs.map((d) => ({
    id: String(d.id).toUpperCase(),
    title: String(d.data().title),
    issued_at: new Date(d.data().issued_at).toISOString(),
    verified: Boolean(d.data().verified),
  }));

  // Achievements
  const achSnap = await db.collection("achievements").where("learnerId", "==", me).get();
  const achievements = achSnap.docs.map((d) => String(d.data().title));

  // Next class today
  const todayKey = new Date().toISOString().slice(0, 10);
  const courseIds = new Set(enrolments.map((e) => e.courseId));
  const classSnap = await db.collection("classes").where("date", "==", todayKey).get();
  const todays = rowsFrom(classSnap)
    .filter((c) => courseIds.has(c.courseId))
    .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));
  const nextClass = todays[0]
    ? {
        id: String(todays[0].id).toUpperCase(),
        course: (await courseInfo(String(todays[0].courseId))).title,
        start_time: String(todays[0].start_time),
        end_time: String(todays[0].end_time),
        venue: String(todays[0].venue),
        trainer: await userName(String(todays[0].trainerId)),
        learners: Number(todays[0].learners ?? 0),
      }
    : null;

  // Weekly progress from the most advanced enrolment
  const historyEnrolment = [...enrolments].sort((a, b) => Number(b.progress) - Number(a.progress))[0];
  const history = (historyEnrolment?.progress_history as number[]) ?? [];
  const progressByWeek = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => ({
    label: `W${w}`,
    value: history[w - 1] ?? 0,
  }));

  const assignmentsDue = assignments.filter((a) => {
    if (a.status === "graded") return false;
    const due = new Date(a.due_at).getTime();
    return due >= Date.now() - 86400000 && due <= Date.now() + 7 * 86400000;
  }).length;

  const payload: LearnerDashboard = {
    stats: {
      coursesInProgress: { label: "Courses in progress", value: myCourses.length },
      assignmentsDue: { label: "Assignments due", value: assignmentsDue, hint: "next 7 days" },
      attendanceRate: { label: "Attendance rate", value: `${attendanceRate}%` },
      certificates: { label: "Certificates earned", value: certificates.length },
    },
    myCourses,
    nextClass,
    assignments,
    certificates,
    achievements,
    progressByWeek,
  };

  return jsonOk(payload);
}
