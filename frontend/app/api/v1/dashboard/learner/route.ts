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

  // Submissions → assignments. Supports both legacy assignment records and lesson submissions.
  const subSnap = await db.collection("submissions").where("learnerId", "==", me).get();
  const submissions = rowsFrom(subSnap);
  const assignments = await Promise.all(
    submissions.map(async (s) => {
      const legacyAssignmentId = String(s.assignmentId ?? "");
      const courseId = String(s.courseId ?? s.course_id ?? "");
      const lessonId = String(s.lessonId ?? s.lesson_id ?? "");
      let title = "Assignment";
      let dueAt = String(s.submitted_at ?? s.created_at ?? new Date().toISOString());
      let resolvedCourseId = courseId;

      if (legacyAssignmentId) {
        const aSnap = await db.collection("assignments").doc(legacyAssignmentId).get();
        if (aSnap.exists) {
          const assignment = aSnap.data()!;
          title = String(assignment.title ?? title);
          dueAt = String(assignment.due_at ?? dueAt);
          resolvedCourseId = String(assignment.courseId ?? resolvedCourseId);
        }
      } else if (courseId && lessonId) {
        const courseSnap = await db.collection("courses").doc(courseId).get();
        const course = courseSnap.exists ? courseSnap.data()! : {};
        const lesson = Array.isArray(course.lessons)
          ? (course.lessons as Record<string, unknown>[]).find((item) => String(item.id ?? "") === lessonId)
          : null;
        title = String(lesson?.title ?? title);
      }

      const info = resolvedCourseId ? await courseInfo(resolvedCourseId) : { title: "" };
      return {
        id: (legacyAssignmentId || `${courseId}-${lessonId}`).toUpperCase(),
        title,
        course: info.title || "Unassigned",
        due_at: new Date(dueAt).toISOString(),
        status: (s.status ?? "submitted") as "open" | "submitted" | "graded" | "overdue",
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

  // Achievements and motivating progress signals.
  const achSnap = await db.collection("achievements").where("learnerId", "==", me).get();
  const achievements = achSnap.docs.map((d) => String(d.data().title));
  const lessonsCompleted = enrolments.reduce(
    (total, enrolment) => total + (Array.isArray(enrolment.completed_lessons) ? enrolment.completed_lessons.length : 0),
    0
  );
  const assignmentsSubmitted = submissions.filter((submission) => ["submitted", "graded"].includes(String(submission.status ?? "submitted"))).length;
  const badgeDefinitions = [
    { id: "first-step", title: "First step", description: "Complete your first lesson.", icon: "sparkles", target: 1, progress: lessonsCompleted },
    { id: "consistent-builder", title: "Consistent builder", description: "Complete five lessons across your learning path.", icon: "layers", target: 5, progress: lessonsCompleted },
    { id: "evidence-maker", title: "Evidence maker", description: "Submit three pieces of assignment work.", icon: "file-check", target: 3, progress: assignmentsSubmitted },
    { id: "pathfinder", title: "Pathfinder", description: "Make progress in two courses.", icon: "route", target: 2, progress: myCourses.filter((course) => course.progress > 0).length },
  ];
  const badges = badgeDefinitions.map((badge) => ({
    ...badge,
    earned: badge.progress >= badge.target,
    earned_at: null,
    progress: Math.min(badge.progress, badge.target),
  }));

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
      lessonsCompleted: { label: "Lessons completed", value: lessonsCompleted },
      assignmentsSubmitted: { label: "Assignments submitted", value: assignmentsSubmitted },
    },
    myCourses,
    nextClass,
    assignments,
    certificates,
    achievements,
    badges,
    currentStreak: history.filter((value) => value > 0).slice(-3).length,
    progressByWeek,
  };

  return jsonOk(payload);
}
