import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase/admin";
import { bearerToken, getUserFromToken } from "@/lib/firebase/auth";
import type { User } from "@/types/auth";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400, errors?: Record<string, string[]>) {
  return NextResponse.json({ message, errors }, { status });
}

/** Authenticates the request from the Authorization header. Returns [user, response]. */
export async function requireUser(
  req: Request
): Promise<{ user: User } | { response: NextResponse }> {
  const token = bearerToken(req.headers.get("authorization"));
  const user = await getUserFromToken(token);
  if (!user) {
    return { response: jsonError("Unauthenticated.", 401) };
  }
  return { user };
}

/** Maps a Firestore query snapshot to rows ({ id } + document data). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowsFrom<T = Record<string, any>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snap: { docs: { id: string; data(): Record<string, any> }[] }
): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

/** Resolves a user id to a display name. */
export async function userName(userId: string): Promise<string> {
  const db = getDb();
  const snap = await db.collection("users").doc(userId).get();
  return snap.exists ? String(snap.data()?.name ?? "—") : "—";
}

/** Resolves a course id to a course doc (title + programme). */
export async function courseInfo(courseId: string) {
  const db = getDb();
  const snap = await db.collection("courses").doc(courseId).get();
  if (!snap.exists) return { title: courseId, programme: "" };
  const data = snap.data()!;
  let programme = String(data.programme ?? "");
  if (programme) {
    const prg = await db.collection("programmes").doc(programme).get();
    if (prg.exists) programme = String(prg.data()?.title ?? programme);
  }
  return { title: String(data.title ?? courseId), programme };
}
