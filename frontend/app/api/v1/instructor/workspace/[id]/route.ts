import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { getInstructorScope, instructorCanAccessLearner } from "@/lib/instructor-access";
import { deleteAdminDocument } from "@/lib/storage/admin-documents";

export const runtime = "nodejs";

type Row = Record<string, unknown>;
function clean(value: unknown, max = 5000) { return String(value ?? "").trim().slice(0, max); }
function courseIdOf(row: Row) { return String(row.courseId ?? row.course_id ?? ""); }
function assignedInstructor(row: Row) { return String(row.instructorId ?? row.instructor_id ?? row.trainerId ?? row.trainer_id ?? row.assignedInstructorId ?? row.assigned_instructor_id ?? ""); }

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (!["instructor", "administrator", "admin"].includes(String(auth.user.role))) return jsonError("Instructor access required.", 403);
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as Row | null;
  if (!body) return jsonError("Invalid workspace update.", 422);
  const resource = clean(body.resource, 60);
  const collection = resource === "tutor_requests" ? "tutor_requests" : resource === "announcements" ? "announcements" : resource === "materials" ? "materials" : "";
  if (!collection) return jsonError("This workspace update is not available.", 422);
  const db = getDb();
  const ref = db.collection(collection).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return jsonError("Record not found.", 404);
  const existing = snap.data() as Row;
  const isAdmin = ["administrator", "admin"].includes(String(auth.user.role));
  const instructorId = String(auth.user.id ?? "");
  const courseId = courseIdOf(existing);
  const scope = !isAdmin ? await getInstructorScope(instructorId) : null;
  const learnerId = String(existing.learnerId ?? existing.learner_id ?? existing.studentId ?? existing.student_id ?? "");
  if (!isAdmin && collection === "tutor_requests") {
    const directlyAssigned = assignedInstructor(existing);
    if (directlyAssigned && directlyAssigned !== instructorId) return jsonError("This tutor request is not assigned to you.", 403);
    if (!directlyAssigned && (!scope || !instructorCanAccessLearner(scope, learnerId, courseId))) return jsonError("This learner is outside your assigned teaching scope.", 403);
  }
  if (!isAdmin && collection !== "tutor_requests" && (!scope || !scope.courseWideIds.has(courseId))) return jsonError("Only instructors assigned to the whole course can update this record.", 403);
  const now = new Date().toISOString();
  const updates: Row = { updated_at: now };

  if (collection === "tutor_requests") {
    const status = clean(body.status, 40);
    if (status && !["responded", "quoted", "confirmed", "scheduled", "declined", "completed"].includes(status)) return jsonError("Choose a valid tutor request status.", 422);
    if (status) updates.status = status;
    if ((status === "confirmed" || status === "scheduled") && (!String(body.confirmedDate ?? existing.confirmedDate ?? existing.confirmed_date ?? "").trim() || !String(body.confirmedTime ?? existing.confirmedTime ?? existing.confirmed_time ?? "").trim())) return jsonError("Confirmed tutor sessions require a date and time.", 422);
    if ((status === "confirmed" || status === "scheduled") && String(existing.mode ?? body.mode ?? "") === "online" && !String(body.meetingLink ?? body.meeting_link ?? existing.meetingLink ?? existing.meeting_link ?? "").trim()) return jsonError("Confirmed online sessions require a meeting link.", 422);
    if (body.response_message !== undefined || body.responseMessage !== undefined) {
      const responseMessage = clean(body.response_message ?? body.responseMessage, 2500);
      updates.response_message = responseMessage;
      updates.admin_response = responseMessage;
    }
    if (body.meetingLink !== undefined || body.meeting_link !== undefined) {
      const meetingLink = clean(body.meetingLink ?? body.meeting_link, 1000);
      updates.meetingLink = meetingLink;
      updates.meeting_link = meetingLink;
    }
    if (body.meetingPlatform !== undefined || body.meeting_platform !== undefined) {
      const meetingPlatform = clean(body.meetingPlatform ?? body.meeting_platform, 80);
      updates.meetingPlatform = meetingPlatform;
      updates.meeting_platform = meetingPlatform;
    }
    if (body.confirmedDate !== undefined) updates.confirmedDate = clean(body.confirmedDate, 40);
    if (body.confirmedTime !== undefined) updates.confirmedTime = clean(body.confirmedTime, 40);
    if (body.venue !== undefined) updates.venue = clean(body.venue, 250);
    if (body.confirmedStart !== undefined || body.confirmed_start !== undefined) {
      const confirmedStart = clean(body.confirmedStart ?? body.confirmed_start, 100);
      updates.confirmedStart = confirmedStart;
      if (!updates.confirmedDate && !existing.confirmedDate) updates.confirmedDate = confirmedStart.slice(0, 10);
      if (!updates.confirmedTime && !existing.confirmedTime) updates.confirmedTime = confirmedStart.length > 10 ? confirmedStart.slice(11) : confirmedStart;
    }
    updates.instructorId = instructorId;
    updates.trainerId = instructorId;
    if (status === "confirmed" || status === "scheduled") {
      const classId = String(existing.classId ?? `tutor-class-${id}`);
      updates.classId = classId;
      const confirmedDate = String(updates.confirmedDate ?? existing.confirmedDate ?? existing.confirmed_date ?? "");
      const confirmedTime = String(updates.confirmedTime ?? existing.confirmedTime ?? existing.confirmed_time ?? "");
      const venue = String(updates.venue ?? existing.venue ?? "");
      const meetingLink = String(updates.meetingLink ?? existing.meetingLink ?? existing.meeting_link ?? "");
      const meetingPlatform = String(updates.meetingPlatform ?? existing.meetingPlatform ?? existing.meeting_platform ?? "Google Meet");
      await db.collection("classes").doc(classId).set({
        id: classId,
        learnerId,
        learner_id: learnerId,
        courseId,
        course_id: courseId,
        title: existing.course_title ?? "Tutor session",
        course_title: existing.course_title ?? courseId,
        date: confirmedDate,
        confirmedDate,
        start_time: confirmedTime,
        confirmedTime,
        venue,
        mode: existing.mode ?? "online",
        meetingLink,
        meeting_link: meetingLink,
        meetingPlatform,
        meeting_platform: meetingPlatform,
        trainerId: instructorId,
        instructorId,
        instructorName: existing.instructorName ?? auth.user.name ?? auth.user.email ?? "Instructor",
        instructorEmail: existing.instructorEmail ?? auth.user.email ?? "",
        tutorRequestId: id,
        tutor_request_id: id,
        status: "scheduled",
        updated_at: now,
      }, { merge: true });
    }
    if (learnerId) await db.collection("notifications").add({ recipientId: learnerId, learnerId, type: "tutor_update", title: status === "confirmed" || status === "scheduled" ? "Tutor session confirmed" : "Tutor session updated", body: String(updates.admin_response ?? existing.admin_response ?? updates.response_message ?? existing.response_message ?? "Your instructor updated your tutor request."), href: "/learner/tutor-sessions", read: false, created_at: now, tutorRequestId: id, status: status || existing.status || "updated" });
  } else if (collection === "announcements") {
    if (body.title !== undefined) updates.title = clean(body.title, 180);
    if (body.body !== undefined || body.content !== undefined) updates.body = clean(body.body ?? body.content, 5000);
    if (body.published !== undefined) updates.published = Boolean(body.published);
    updates.instructorId = instructorId;
  } else {
    if (body.title !== undefined) updates.title = clean(body.title, 180);
    if (body.url !== undefined) updates.url = clean(body.url, 1000);
    if (body.description !== undefined) updates.description = clean(body.description, 2000);
    if (body.published !== undefined) updates.published = Boolean(body.published);
    updates.instructorId = instructorId;
  }
  await ref.update(updates);
  if ((collection === "announcements" || collection === "materials") && updates.published !== false) {
    const enrolments = await db.collection("enrolments").limit(3000).get();
    const recipients = enrolments.docs
      .map((doc) => doc.data() as Row)
      .filter((row) => String(row.courseId ?? row.course_id ?? "") === courseId)
      .map((row) => String(row.learnerId ?? row.learner_id ?? ""))
      .filter(Boolean);
    const title = String(updates.title ?? existing.title ?? (collection === "materials" ? "Course material updated" : "Course announcement updated"));
    const body = String(updates.body ?? updates.description ?? existing.body ?? existing.description ?? "Your instructor published an update.");
    await Promise.all([...new Set(recipients)].map((recipientId) => db.collection("notifications").add({ recipientId, learnerId: recipientId, type: collection === "materials" ? "course_material" : "course_announcement", title, body, href: collection === "materials" ? "/learner/courses" : "/learner/discussions", read: false, created_at: now, courseId, instructorId })));
  }
  return jsonOk({ data: { id, ...existing, ...updates } });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (!["instructor", "administrator", "admin"].includes(String(auth.user.role))) return jsonError("Instructor access required.", 403);
  const { id } = await ctx.params;
  const resource = new URL(req.url).searchParams.get("resource") ?? "";
  if (resource !== "materials") return jsonError("Only instructor materials can be removed here.", 422);

  const db = getDb();
  const ref = db.collection("materials").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return jsonError("Material not found.", 404);
  const existing = snap.data() as Row;
  const isAdmin = ["administrator", "admin"].includes(String(auth.user.role));
  const instructorId = String(auth.user.id ?? "");
  const courseId = courseIdOf(existing);
  const scope = !isAdmin ? await getInstructorScope(instructorId) : null;
  if (!isAdmin && (!scope || !scope.courseWideIds.has(courseId))) return jsonError("Only instructors assigned to the whole course can remove materials.", 403);

  const storagePath = String(existing.storagePath ?? "");
  if (storagePath) {
    try { await deleteAdminDocument(storagePath); } catch (error) { console.error("[instructor-workspace] material file cleanup failed", error); }
  }
  await ref.delete();
  return jsonOk({ data: { id, deleted: true } });
}
