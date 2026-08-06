import { getDb } from "@/lib/firebase/admin";
import {
  createSession,
  toUserDoc,
  verifyPassword,
} from "@/lib/firebase/auth";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

/** POST /api/v1/auth/login — verifies credentials and opens a session. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return jsonError("Email and password are required.", 422, {
      email: [!email ? "Email is required." : ""],
      password: [!password ? "Password is required." : ""],
    });
  }

  const db = getDb();
  const snap = await db.collection("users").where("email", "==", email).limit(1).get();
  if (snap.empty) return jsonError("These credentials do not match our records.", 401);

  const doc = snap.docs[0];
  const data = doc.data();
  if (!verifyPassword(password, String(data.salt), String(data.password_hash))) {
    return jsonError("These credentials do not match our records.", 401);
  }

  const user = toUserDoc({ id: doc.id, ...data });
  const token = await createSession(doc.id);
  return jsonOk({ token, user });
}
