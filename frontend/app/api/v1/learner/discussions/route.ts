import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { getInstructorIdsForLearnerCourse, getInstructorScope, instructorCanAccessCourse, instructorCanAccessLearner } from "@/lib/instructor-access";

export const runtime = "nodejs";

function clean(value: unknown, max = 4000) {
  return String(value ?? "").trim().slice(0, max);
}

function isStaff(role: string) {
  return ["admin", "administrator", "instructor", "tutor"].includes(role);
}

function isAdministrator(role: string) {
  return ["admin", "administrator"].includes(role);
}

async function learnerCourseIds(db: FirebaseFirestore.Firestore, userId: string) {
  const snapshot = await db.collection("enrolments").limit(3000).get();
  return new Set(snapshot.docs
    .map((doc) => doc.data() as Record<string, unknown>)
    .filter((row) => String(row.learnerId ?? row.learner_id ?? "") === userId)
    .flatMap((row) => [row.courseId, row.course_id])
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .map((value) => String(value ?? "").trim())
    .filter(Boolean));
}

async function canAccessCourse(
  db: FirebaseFirestore.Firestore,
  userId: string,
  role: string,
  courseId: string
) {
  if (isAdministrator(role)) return true;
  if (isStaff(role)) return instructorCanAccessCourse(await getInstructorScope(userId), courseId);
  return (await learnerCourseIds(db, userId)).has(courseId);
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const courseId = new URL(req.url).searchParams.get("courseId") ?? "";
  const db = getDb();
  const role = String(auth.user.role ?? "learner");
  const isStaffUser = isStaff(role);
  const isAdminUser = isAdministrator(role);
  const instructorScope = isStaffUser && !isAdminUser ? await getInstructorScope(auth.user.id) : null;
  const allowedLearnerCourses = !isStaffUser ? await learnerCourseIds(db, auth.user.id) : null;
  if (courseId && !(await canAccessCourse(db, auth.user.id, role, courseId))) {
    return jsonError("You must be enrolled in this course to join its discussion.", 403);
  }

  const snapshot = await db.collection("course_discussions").limit(500).get();
  const courseRows = snapshot.docs
    .map((doc): Record<string, unknown> => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
    .filter((row) => {
      const rowCourseId = String(row.courseId ?? row.course_id ?? "");
      return !courseId || rowCourseId === courseId;
    });
  const accessibleThreadIds = isStaffUser && !isAdminUser && instructorScope
    ? new Set(courseRows.filter((row) => {
      const rowCourseId = String(row.courseId ?? row.course_id ?? "");
      if (instructorScope.courseWideIds.has(rowCourseId)) return true;
      if (row.parentId || row.kind === "reply") return false;
      const authorId = String(row.authorId ?? row.author_id ?? row.learnerId ?? row.learner_id ?? "");
      return Boolean(authorId && instructorCanAccessLearner(instructorScope, authorId, rowCourseId));
    }).map((row) => String(row.threadId ?? row.id ?? "")).filter(Boolean))
    : null;
  const allRows = courseRows
    .filter((row) => {
      const rowCourseId = String(row.courseId ?? row.course_id ?? "");
      if (!isStaffUser) return Boolean(allowedLearnerCourses?.has(rowCourseId));
      if (isAdminUser) return true;
      if (instructorScope?.courseWideIds.has(rowCourseId)) return true;
      return Boolean(accessibleThreadIds?.has(String(row.threadId ?? "")));
    })
    .sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));

  const roots = allRows.filter((row) => !row.parentId && row.kind !== "reply");
  const rootThreads = roots.map((root) => {
    const threadId = String(root.threadId ?? root.id ?? "");
    const replies = allRows
      .filter((row) => String(row.threadId ?? "") === threadId && String(row.parentId ?? "") !== "")
      .sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
    return { ...root, threadId, parentId: null, replies, replyCount: replies.length };
  });

  return jsonOk({ data: threadRootsDescending(rootThreads) });
}

function threadRootsDescending(rows: Record<string, unknown>[]) {
  return rows.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid discussion request.", 422);

  const courseId = clean(body.courseId, 120);
  const parentId = clean(body.parentId, 160);
  const title = clean(body.title, 160);
  const content = clean(body.content, 4000);
  const kind = body.kind === "announcement" ? "announcement" : "question";
  if (!courseId || !content || (!parentId && !title)) {
    return jsonError(parentId ? "Reply content is required." : "Course, title, and message are required.", 422);
  }
  if (content.length < 2) return jsonError("Please write a little more before posting.", 422);

  const db = getDb();
  const role = String(auth.user.role ?? "learner");
  if (!(await canAccessCourse(db, auth.user.id, role, courseId))) {
    return jsonError("You must be enrolled in this course to join its discussion.", 403);
  }

  let threadId = "";
  if (parentId) {
    const parentSnap = await db.collection("course_discussions").doc(parentId).get();
    if (!parentSnap.exists) return jsonError("The discussion thread could not be found.", 404);
    const parent = parentSnap.data() as Record<string, unknown>;
    if (String(parent.courseId ?? parent.course_id ?? "") !== courseId) {
      return jsonError("This discussion does not belong to the selected course.", 403);
    }
    if (isStaff(role) && !isAdministrator(role)) {
      const parentAuthorId = String(parent.authorId ?? parent.author_id ?? parent.learnerId ?? parent.learner_id ?? "");
      const scope = await getInstructorScope(auth.user.id);
      if (!parentAuthorId || !instructorCanAccessLearner(scope, parentAuthorId, courseId)) {
        return jsonError("This learner is outside your assigned teaching scope.", 403);
      }
    }
    threadId = String(parent.threadId ?? parent.id ?? parentId);
  } else {
    threadId = `discussion-${randomBytes(6).toString("hex")}`;
  }

  const id = `discussion-${randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();
  const row = {
    id,
    courseId,
    title: parentId ? "" : title,
    content,
    kind: parentId ? "reply" : kind,
    parentId: parentId || null,
    threadId,
    authorId: auth.user.id,
    authorName: String(auth.user.name ?? (isStaff(role) ? "LEA instructor" : "LEA learner")),
    authorRole: role,
    created_at: now,
    updated_at: now,
  };
  await db.collection("course_discussions").doc(id).set(row);
  if (parentId && isStaff(role)) {
    const parentAuthorId = String((await db.collection("course_discussions").doc(parentId).get()).data()?.authorId ?? "");
    if (parentAuthorId && parentAuthorId !== String(auth.user.id ?? "")) {
      await db.collection("notifications").add({ recipientId: parentAuthorId, learnerId: parentAuthorId, type: "discussion_reply", title: "Your course discussion has a reply", body: `${row.authorName} replied to your question.`, href: "/learner/discussions", read: false, created_at: now });
    }
  }
  if (!parentId && !isStaff(role)) {
    const instructorIds = await getInstructorIdsForLearnerCourse(courseId, auth.user.id);
    await Promise.all([...instructorIds].filter((instructorId) => instructorId !== String(auth.user.id ?? "")).map((instructorId) => db.collection("notifications").add({
      recipientId: instructorId,
      instructorId,
      type: "discussion_question",
      title: "New learner discussion question",
      body: `${row.authorName} posted “${title}” in ${courseId}.`,
      href: "/instructor/discussions",
      read: false,
      created_at: now,
    })));
  }
  if (!parentId && isStaff(role) && (kind === "announcement" || isAdministrator(role))) {
    const scope = isAdministrator(role) ? null : await getInstructorScope(String(auth.user.id ?? ""));
    const enrolments = await db.collection("enrolments").where("courseId", "==", courseId).limit(1000).get();
    const learnerIds = enrolments.docs.map((doc) => String((doc.data() as Record<string, unknown>).learnerId ?? "")).filter(Boolean);
    const recipients = scope && !scope.courseWideIds.has(courseId)
      ? learnerIds.filter((learnerId) => scope.learnerIds.has(learnerId))
      : learnerIds;
    await Promise.all([...new Set(recipients)].map((learnerId) => db.collection("notifications").add({
      recipientId: learnerId,
      learnerId,
      type: "discussion_announcement",
      title: title || "New course guidance",
      body: content,
      href: "/learner/discussions",
      read: false,
      created_at: now,
    })));
  }
  return jsonOk({ data: row }, 201);
}
