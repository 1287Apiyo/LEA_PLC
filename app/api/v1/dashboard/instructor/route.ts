import { getDb } from "@/lib/firebase/admin";
import { courseInfo, jsonError, jsonOk, requireUser, rowsFrom, userName } from "@/lib/firebase/api-helpers";
import type { InstructorDashboard } from "@/types/dashboard";

export const runtime = "nodejs";

/** GET /api/v1/dashboard/instructor — the instructor's teaching overview. */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "instructor") return jsonError("Forbidden.", 403);
  const db = getDb();
  const me = auth.user.id;

  const todayKey = new Date().toISOString().slice(0, 10);
  const classSnap = await db.collection("classes").where("trainerId", "==", me).get();
  const classes = rowsFrom(classSnap);
  const today = classes.filter((c) => c.date === todayKey);
  const online = today.filter((c) => String(c.venue).toLowerCase().includes("online")).length;

  const attSnap = await db.collection("attendance").get();
  const attendance = rowsFrom(attSnap);
  const present = attendance.filter((a) => a.status === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;
  const attendanceByWeek = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
    const week = attendance.filter((a) => Number(a.week) === w);
    return { label: `W${w}`, value: week.length > 0 ? Math.round((week.filter((a) => a.status === "present").length / week.length) * 100) : 0 };
  });

  const assignSnap = await db.collection("assignments").where("instructorId", "==", me).get();
  const assignments = rowsFrom(assignSnap);
  const pendingGrading = assignments.reduce((s, a) => s + (Number(a.submissions ?? 0) - Number(a.graded ?? 0)), 0);

  const subSnap = await db.collection("submissions").get();
  const submissions = rowsFrom(subSnap);
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const s of submissions) {
    const g = Number(s.grade ?? 0);
    if (g >= 80) gradeCounts.A++;
    else if (g >= 70) gradeCounts.B++;
    else if (g >= 55) gradeCounts.C++;
    else if (g >= 40) gradeCounts.D++;
    else gradeCounts.E++;
  }
  const gradeDistribution = Object.entries(gradeCounts).map(([label, value]) => ({ label, value }));

  const recentAssignments = await Promise.all(
    assignments
      .sort((a, b) => new Date(b.due_at).getTime() - new Date(a.due_at).getTime())
      .slice(0, 3)
      .map(async (a) => ({
        id: String(a.id).toUpperCase(),
        title: String(a.title),
        course: (await courseInfo(String(a.courseId))).title,
        due_at: new Date(a.due_at).toISOString(),
        submissions: Number(a.submissions ?? 0),
        graded: Number(a.graded ?? 0),
      }))
  );

  const annSnap = await db.collection("announcements").get();
  const announcements = rowsFrom(annSnap)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((a) => ({ id: String(a.id), title: String(a.title), body: String(a.body), created_at: new Date(a.created_at).toISOString() }));

  const enrolSnap = await db.collection("enrolments").get();
  const courseIds = new Set(classes.map((c) => c.courseId));
  const activeLearners = new Set(
    enrolSnap.docs
      .map((d) => d.data())
      .filter((e) => courseIds.has(String(e.courseId)))
      .map((e) => String(e.learnerId))
  ).size;

  const classSchedule = await Promise.all(
    today.map(async (c) => ({
      id: String(c.id).toUpperCase(),
      course: (await courseInfo(String(c.courseId))).title,
      start_time: String(c.start_time),
      end_time: String(c.end_time),
      venue: String(c.venue),
      trainer: await userName(String(c.trainerId)),
      learners: Number(c.learners ?? 0),
    }))
  );

  const payload: InstructorDashboard = {
    stats: {
      todayClasses: { label: "Classes today", value: today.length, hint: `${online} online · ${today.length - online} on-site` },
      attendanceRate: { label: "Attendance rate", value: `${attendanceRate}%`, hint: "last 30 days" },
      pendingGrading: { label: "Pending grading", value: pendingGrading },
      activeLearners: { label: "Active learners", value: activeLearners, hint: "across your classes" },
    },
    classSchedule,
    attendanceByWeek,
    gradeDistribution,
    recentAssignments,
    announcements,
  };

  return jsonOk(payload);
}
