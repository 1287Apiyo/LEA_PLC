import { randomBytes } from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import { getDb, getFirebaseApp } from "@/lib/firebase/admin";
import { createSession, toUserDoc } from "@/lib/firebase/auth";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";
import type { Role } from "@/types/auth";

export const runtime = "nodejs";

function isSupportedRole(role: unknown): role is Extract<Role, "learner" | "instructor"> {
  return role === "learner" || role === "instructor";
}

/** POST /api/v1/auth/google — verifies a Firebase Google token and opens an LEA session. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { idToken?: string; role?: Role } | null;
  const idToken = body?.idToken?.trim();

  if (!idToken) return jsonError("Google sign-in token is required.", 422);

  try {
    const decoded = await getAuth(getFirebaseApp()).verifyIdToken(idToken);
    const email = decoded.email?.trim().toLowerCase();
    if (!email || decoded.email_verified === false) {
      return jsonError("Your Google account does not have a verified email address.", 422);
    }

    const db = getDb();
    const existing = await db.collection("users").where("email", "==", email).limit(1).get();
    let userId: string;
    let userData: Record<string, unknown>;

    if (existing.empty) {
      userId = `usr-${randomBytes(4).toString("hex")}`;
      const createdAt = new Date().toISOString();
      userData = {
        id: userId,
        name: decoded.name?.trim() || email.split("@")[0],
        email,
        role: isSupportedRole(body?.role) ? body.role : "learner",
        avatar_url: decoded.picture ?? null,
        email_verified_at: createdAt,
        created_at: createdAt,
        auth_provider: "google",
        google_uid: decoded.uid,
      };
      await db.collection("users").doc(userId).set(userData);
    } else {
      const doc = existing.docs[0];
      userId = doc.id;
      userData = { id: doc.id, ...doc.data() };
      const updates: Record<string, string> = { auth_provider: "google", google_uid: decoded.uid };
      if (decoded.picture && !userData.avatar_url) updates.avatar_url = decoded.picture;
      await db.collection("users").doc(userId).set(updates, { merge: true });
      userData = { ...userData, ...updates };
    }

    const user = toUserDoc(userData);
    const token = await createSession(userId);
    return jsonOk({ token, user });
  } catch (error) {
    console.error("Google sign-in failed", error);
    return jsonError("Google sign-in could not be completed. Please try again.", 401);
  }
}
