import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

function clean(value: unknown, max = 4000) {
  return String(value ?? "").trim().slice(0, max);
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const courseId = new URL(req.url).searchParams.get("courseId") ?? "";
  const db = getDb();
  const snapshot = await db.collection("course_discussions").limit(300).get();
  const rows: Record<string, unknown>[] = snapshot.docs
    .map((doc): Record<string, unknown> => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
    .filter((row) => !courseId || String(row.courseId ?? row.course_id ?? "") === courseId)
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));

  return jsonOk({ data: rows });
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid discussion request.", 422);

  const courseId = clean(body.courseId, 120);
  const title = clean(body.title, 160);
  const content = clean(body.content, 4000);
  const kind = body.kind === "announcement" ? "announcement" : "question";
  if (!courseId || !title || !content) return jsonError("Course, title, and message are required.", 422);

  const db = getDb();
  const role = String(auth.user.role ?? "learner");
  if (!["admin", "instructor", "tutor"].includes(role)) {
    const enrolment = await db.collection("enrolments").where("learnerId", "==", auth.user.id).where("courseId", "==", courseId).limit(1).get();
    if (enrolment.empty) return jsonError("You must be enrolled in this course to join its discussion.", 403);
  }

  const id = `discussion-${randomBytes(6).toString("hex")}`;
  const row = {
    id,
    courseId,
    title,
    content,
    kind,
    authorId: auth.user.id,
    authorName: String(auth.user.name ?? "LEA learner"),
    authorRole: role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await db.collection("course_discussions").doc(id).set(row);
  return jsonOk({ data: row }, 201);
}
