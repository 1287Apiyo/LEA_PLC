import { getDb } from "@/lib/firebase/admin";
import { courseInfo, jsonError, jsonOk, requireUser, rowsFrom, userName } from "@/lib/firebase/api-helpers";
import type { AdminDashboard } from "@/types/dashboard";

export const runtime = "nodejs";

const MONTH_LABELS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const money = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

/** GET /api/v1/dashboard/admin — platform-wide metrics from Firestore. */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Forbidden.", 403);

  const db = getDb();

  // Learners + registrations
  const learnerSnap = await db.collection("users").where("role", "==", "learner").get();
  const learners = rowsFrom(learnerSnap);
  const now = Date.now();
  const monthAgo = now - 30 * 86400000;
  const lastMonthAgo = now - 60 * 86400000;
  const recent = learners.filter((l) => new Date(l.created_at).getTime() > monthAgo).length;
  const previous = learners.filter(
    (l) => new Date(l.created_at).getTime() > lastMonthAgo && new Date(l.created_at).getTime() <= monthAgo
  ).length;
  const learnerDelta = previous > 0 ? Math.round(((recent - previous) / previous) * 1000) / 10 : null;

  // Classes today
  const todayKey = new Date().toISOString().slice(0, 10);
  const classSnap = await db.collection("classes").where("date", "==", todayKey).get();
  const todayClasses = rowsFrom(classSnap);
  const online = todayClasses.filter((c) => String(c.venue).toLowerCase().includes("online")).length;
  const onSite = todayClasses.length - online;

  // Payments
  const paySnap = await db.collection("payments").get();
  const payments = rowsFrom(paySnap);
  const paid = payments.filter((p) => p.status === "paid");
  const thisMonth = paid.filter((p) => {
    const t = new Date(p.paid_at);
    return t.getMonth() === new Date().getMonth() && t.getFullYear() === new Date().getFullYear();
  });
  const lastMonth = paid.filter((p) => {
    const d = new Date();
    const t = new Date(p.paid_at);
    const last = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    return t.getMonth() === last.getMonth() && t.getFullYear() === last.getFullYear();
  });
  const revenueThisMonth = thisMonth.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const revenueLastMonth = lastMonth.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const revenueDelta =
    revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 1000) / 10 : null;

  // Revenue trend (last 12 months)
  const revenueTrend = MONTH_LABELS.map((label, i) => {
    const monthNum = (new Date().getMonth() - (11 - i) + 12) % 12;
    const value = paid
      .filter((p) => new Date(p.paid_at).getMonth() === monthNum)
      .reduce((s, p) => s + Number(p.amount ?? 0), 0);
    return { label, value };
  });

  // Enrolment by programme
  const enrolSnap = await db.collection("enrolments").get();
  const enrolments = rowsFrom(enrolSnap);
  const progCounts: Record<string, number> = {};
  for (const e of enrolments) {
    const info = await courseInfo(String(e.courseId));
    const key = info.programme || "Other";
    progCounts[key] = (progCounts[key] ?? 0) + 1;
  }
  const enrolmentByProgramme = Object.entries(progCounts).map(([label, value]) => ({ label, value }));

  // Attendance
  const attSnap = await db.collection("attendance").get();
  const attendance = rowsFrom(attSnap);
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  const attendanceByWeek = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
    const week = attendance.filter((a) => Number(a.week) === w);
    const present = week.filter((a) => a.status === "present").length;
    return { label: `W${w}`, value: week.length > 0 ? Math.round((present / week.length) * 100) : 0 };
  });

  // Completion rate
  const completionRate =
    enrolments.length > 0
      ? Math.round(enrolments.reduce((s, e) => s + Number(e.progress ?? 0), 0) / enrolments.length)
      : 0;

  // Recent registrations
  const recentRegistrations = await Promise.all(
    [...learners]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(async (l) => {
        const theirEnrolment = enrolments.find((e) => e.learnerId === l.id);
        const info = theirEnrolment ? await courseInfo(String(theirEnrolment.courseId)) : { programme: "" };
        return {
          id: `REG-${l.id.slice(-4)}`,
          name: String(l.name),
          programme: info.programme || "Unassigned",
          enrolled_at: new Date(l.created_at).toISOString(),
          status: "active" as const,
        };
      })
  );

  // Recent payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())
    .slice(0, 5)
    .map((p) => ({
      id: String(p.id).toUpperCase().startsWith("PAY") ? String(p.id).toUpperCase() : `PAY-${String(p.id)}`,
      learner: String(p.learner),
      amount: Number(p.amount),
      currency: "KES" as const,
      method: p.method as "M-Pesa" | "Stripe" | "Bank",
      status: p.status as "paid" | "pending" | "failed",
      paid_at: new Date(p.paid_at).toISOString(),
    }));

  // Today schedule
  const todaySchedule = await Promise.all(
    todayClasses.map(async (c) => ({
      id: String(c.id).toUpperCase(),
      course: (await courseInfo(String(c.courseId))).title,
      start_time: String(c.start_time),
      end_time: String(c.end_time),
      venue: String(c.venue),
      trainer: await userName(String(c.trainerId)),
      learners: Number(c.learners ?? 0),
    }))
  );

  const payload: AdminDashboard = {
    stats: {
      activeLearners: { label: "Active learners", value: learners.length, delta: learnerDelta ?? undefined, hint: "vs last month" },
      todayClasses: { label: "Classes today", value: todayClasses.length, hint: `${onSite} venues · ${online} online` },
      revenueThisMonth: { label: "Revenue this month", value: money(revenueThisMonth), delta: revenueDelta ?? undefined, hint: "vs last month" },
      attendanceRate: { label: "Attendance rate", value: `${attendanceRate}%`, hint: "all classes" },
      completionRate: { label: "Completion rate", value: `${completionRate}%`, hint: "all programmes" },
    },
    revenueTrend,
    enrolmentByProgramme,
    attendanceByWeek,
    recentRegistrations,
    recentPayments,
    todaySchedule,
  };

  return jsonOk(payload);
}
