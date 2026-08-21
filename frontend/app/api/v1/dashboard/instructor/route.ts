import { getDb } from "@/lib/firebase/admin";
import { courseInfo, jsonError, jsonOk, requireUser, rowsFrom, userName } from "@/lib/firebase/api-helpers";
import { getInstructorScope, instructorCanAccessLearner } from "@/lib/instructor-access";
import type { InstructorDashboard } from "@/types/dashboard";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

function value(row: Row, ...keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]) !== "") return row[key];
  }
  return "";
}

function courseIdOf(row: Row) { return String(value(row, "courseId", "course_id")); }
function learnerIdOf(row: Row) { return String(value(row, "learnerId", "learner_id", "studentId", "student_id")); }
function instructorIdOf(row: Row) { return String(value(row, "instructorId", "instructor_id", "trainerId", "trainer_id", "assignedInstructorId", "assigned_instructor_id")); }
function classIdOf(row: Row) { return String(value(row, "classId", "class_id")); }
function timestamp(valueToFormat: unknown) {
  const date = new Date(String(valueToFormat ?? ""));
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function canSee(scope: Awaited<ReturnType<typeof getInstructorScope>>, instructorId: string, row: Row) {
  const directInstructor = instructorIdOf(row) === instructorId;
  if (directInstructor) return true;
  const courseId = courseIdOf(row);
  if (!courseId || !scope.courseIds.has(courseId)) return false;
  const learnerId = learnerIdOf(row);
  return scope.courseWideIds.has(courseId) || scope.classIds.has(classIdOf(row)) || Boolean(learnerId && instructorCanAccessLearner(scope, learnerId, courseId));
}

/** GET /api/v1/dashboard/instructor — the instructor's scoped teaching overview. */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const role = String(auth.user.role ?? "").toLowerCase();
  if (!["instructor", "tutor"].includes(role)) return jsonError("Forbidden.", 403);
  const db = getDb();
  const me = String(auth.user.id ?? "");
  const scope = await getInstructorScope(me);

  const todayKey = new Date().toISOString().slice(0, 10);
  const [classSnap, attSnap, assignSnap, subSnap, annSnap, enrolSnap] = await Promise.all([
    db.collection("classes").limit(3000).get(),
    db.collection("attendance").limit(5000).get(),
    db.collection("assignments").limit(3000).get(),
    db.collection("submissions").limit(5000).get(),
    db.collection("announcements").limit(3000).get(),
    db.collection("enrolments").limit(5000).get(),
  ]);

  const classes = rowsFrom(classSnap).filter((row) => canSee(scope, me, row));
  const attendance = rowsFrom(attSnap).filter((row) => canSee(scope, me, row));
  const assignments = rowsFrom(assignSnap).filter((row) => canSee(scope, me, row));
  const submissions = rowsFrom(subSnap).filter((row) => canSee(scope, me, row));
  const announcements = rowsFrom(annSnap).filter((row) => canSee(scope, me, row));
  const enrolments = enrolSnap.docs.map((doc) => doc.data() as Row).filter((row) => {
    const courseId = courseIdOf(row);
    const learnerId = learnerIdOf(row);
    return Boolean(courseId && scope.courseIds.has(courseId) && (scope.courseWideIds.has(courseId) || instructorCanAccessLearner(scope, learnerId, courseId)));
  });

  const today = classes.filter((row) => String(value(row, "date", "scheduledDate")) === todayKey);
  const online = today.filter((row) => /online|meet|zoom/i.test(String(value(row, "venue", "mode", "meetingPlatform")))).length;
  const present = attendance.filter((row) => String(row.status ?? "") === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;
  const attendanceByWeek = [1, 2, 3, 4, 5, 6, 7, 8].map((weekNumber) => {
    const week = attendance.filter((row) => Number(row.week) === weekNumber);
    return { label: `W${weekNumber}`, value: week.length > 0 ? Math.round((week.filter((row) => row.status === "present").length / week.length) * 100) : 0 };
  });

  const pendingFromSubmissions = submissions.filter((row) => {
    const status = String(row.status ?? "").toLowerCase();
    const hasGrade = row.grade !== undefined && row.grade !== null && String(row.grade) !== "";
    return !hasGrade && ["submitted", "pending", "revision_requested"].includes(status);
  }).length;
  const pendingGrading = pendingFromSubmissions || assignments.reduce((sum, row) => sum + Math.max(0, Number(row.submissions ?? 0) - Number(row.graded ?? 0)), 0);

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  submissions.forEach((row) => {
    if (row.grade === undefined || row.grade === null || String(row.grade) === "") return;
    const grade = Number(row.grade);
    if (!Number.isFinite(grade)) return;
    if (grade >= 80) gradeCounts.A++;
    else if (grade >= 70) gradeCounts.B++;
    else if (grade >= 55) gradeCounts.C++;
    else if (grade >= 40) gradeCounts.D++;
    else gradeCounts.E++;
  });
  const gradeDistribution = Object.entries(gradeCounts).map(([label, value]) => ({ label, value }));

  const recentAssignments = await Promise.all(
    assignments
      .sort((a, b) => new Date(String(b.due_at ?? "")).getTime() - new Date(String(a.due_at ?? "")).getTime())
      .slice(0, 3)
      .map(async (assignment) => ({
        id: String(assignment.id ?? "").toUpperCase(),
        title: String(assignment.title ?? "Assignment"),
        course: (await courseInfo(courseIdOf(assignment))).title,
        due_at: timestamp(assignment.due_at),
        submissions: Number(assignment.submissions ?? 0),
        graded: Number(assignment.graded ?? 0),
      })),
  );

  const recentAnnouncements = announcements
    .sort((a, b) => new Date(String(b.created_at ?? "")).getTime() - new Date(String(a.created_at ?? "")).getTime())
    .slice(0, 5)
    .map((row) => ({ id: String(row.id ?? ""), title: String(row.title ?? "Announcement"), body: String(row.body ?? row.content ?? ""), created_at: timestamp(row.created_at ?? row.updated_at) }));

  const activeLearners = new Set(enrolments.map((row) => learnerIdOf(row)).filter(Boolean)).size;
  const classSchedule = await Promise.all(today.map(async (row) => ({
    id: String(row.id ?? "").toUpperCase(),
    course: (await courseInfo(courseIdOf(row))).title,
    start_time: String(value(row, "start_time", "confirmedTime", "preferredTime")),
    end_time: String(value(row, "end_time")),
    venue: String(value(row, "venue", "meetingPlatform", "mode")),
    trainer: await userName(instructorIdOf(row) || me),
    learners: Number(row.learners ?? (learnerIdOf(row) ? 1 : 0)),
  })));

  const payload: InstructorDashboard = {
    stats: {
      todayClasses: { label: "Classes today", value: today.length, hint: `${online} online · ${today.length - online} on-site` },
      attendanceRate: { label: "Attendance rate", value: `${attendanceRate}%`, hint: "your assigned learners" },
      pendingGrading: { label: "Pending grading", value: pendingGrading },
      activeLearners: { label: "Active learners", value: activeLearners, hint: "your assigned learners" },
    },
    classSchedule,
    attendanceByWeek,
    gradeDistribution,
    recentAssignments,
    announcements: recentAnnouncements,
  };

  return jsonOk(payload);
}
