import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

type NotificationRow = {
  id: string;
  title: string;
  description: string;
  kind: "reminder" | "feedback" | "tutor" | "message";
  href: string;
  created_at: string;
  read: boolean;
};

function asDate(value: unknown) {
  const date = new Date(String(value ?? ""));
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const db = getDb();
  const [assignmentsSnap, submissionsSnap, tutorSnap, messagesSnap, readsSnap] = await Promise.all([
    db.collection("assignments").where("learnerId", "==", auth.user.id).limit(100).get(),
    db.collection("submissions").where("learnerId", "==", auth.user.id).limit(100).get(),
    db.collection("tutor_requests").where("learnerId", "==", auth.user.id).limit(100).get(),
    db.collection("messages").where("learnerId", "==", auth.user.id).limit(100).get(),
    db.collection("notification_reads").where("learnerId", "==", auth.user.id).limit(300).get(),
  ]);

  const readIds = new Set(readsSnap.docs.map((doc) => String(doc.data().notificationId ?? doc.id)));
  const rows: NotificationRow[] = [];
  assignmentsSnap.docs.forEach((doc) => {
    const row = doc.data() as Record<string, unknown>;
    if (!["open", "overdue"].includes(String(row.status ?? ""))) return;
    const id = `assignment-${doc.id}`;
    rows.push({ id, title: String(row.status === "overdue" ? "Assignment overdue" : "Assignment waiting for you"), description: String(row.title ?? row.assignment_title ?? "Complete your next assignment"), kind: "reminder", href: "/learner/assignments", created_at: String(row.due_at ?? row.updated_at ?? row.created_at ?? new Date().toISOString()), read: readIds.has(id) });
  });
  submissionsSnap.docs.forEach((doc) => {
    const row = doc.data() as Record<string, unknown>;
    if (!row.feedback && !row.comments && row.grade === undefined && row.resubmission_requested !== true) return;
    const id = `submission-${doc.id}`;
    rows.push({ id, title: row.resubmission_requested === true ? "Resubmission requested" : "Assignment feedback is ready", description: String(row.feedback ?? row.comments ?? `Review the result for ${row.assignment_title ?? "your submission"}`), kind: "feedback", href: "/learner/assignments", created_at: String(row.updated_at ?? row.graded_at ?? row.created_at ?? new Date().toISOString()), read: readIds.has(id) });
  });
  tutorSnap.docs.forEach((doc) => {
    const row = doc.data() as Record<string, unknown>;
    if (!["responded", "quoted", "confirmed", "scheduled"].includes(String(row.status ?? ""))) return;
    const id = `tutor-${doc.id}`;
    rows.push({ id, title: String(row.status === "confirmed" || row.status === "scheduled" ? "Tutor session confirmed" : "Tutor request updated"), description: String(row.response_message ?? row.instructorName ?? row.course_title ?? "Your tutor request has an update"), kind: "tutor", href: "/learner/tutor-sessions", created_at: String(row.updated_at ?? row.confirmed_at ?? row.created_at ?? new Date().toISOString()), read: readIds.has(id) });
  });
  messagesSnap.docs.forEach((doc) => {
    const row = doc.data() as Record<string, unknown>;
    if (["read", "closed"].includes(String(row.status ?? ""))) return;
    const id = `message-${doc.id}`;
    rows.push({ id, title: String(row.subject ?? "New learner message"), description: String(row.preview ?? row.body ?? "You have a new support update."), kind: "message", href: "/learner/messages", created_at: String(row.created_at ?? new Date().toISOString()), read: readIds.has(id) });
  });

  rows.sort((a, b) => asDate(b.created_at).getTime() - asDate(a.created_at).getTime());
  return jsonOk({ data: rows, unread: rows.filter((row) => !row.read).length });
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const notificationId = String(body?.notificationId ?? "").trim();
  if (!notificationId) return jsonError("Notification ID is required.", 422);
  const db = getDb();
  const id = `${auth.user.id}_${notificationId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
  const row = { id, learnerId: auth.user.id, notificationId, read_at: new Date().toISOString() };
  await db.collection("notification_reads").doc(id).set(row, { merge: true });
  return jsonOk({ data: row });
}
