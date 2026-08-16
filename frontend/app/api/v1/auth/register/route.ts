import { randomBytes } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import { createSession, hashPassword, toUserDoc } from "@/lib/firebase/auth";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

function roleFromEmail(email: string): "administrator" | "instructor" | "learner" {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (local.startsWith("admin")) return "administrator";
  if (local.startsWith("teacher") || local.startsWith("instructor")) return "instructor";
  return "learner";
}

/** POST /api/v1/auth/register — creates a user with the chosen role. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
    role?: "administrator" | "instructor" | "learner";
  } | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!name || !email || !password) {
    return jsonError("Name, email and password are required.", 422);
  }
  if (password.length < 8) {
    return jsonError("Password must be at least 8 characters.", 422, {
      password: ["The password must be at least 8 characters."],
    });
  }

  const role =
    body?.role === "administrator" || body?.role === "instructor" || body?.role === "learner"
      ? body.role
      : roleFromEmail(email);

  const db = getDb();
  const existing = await db.collection("users").where("email", "==", email).limit(1).get();
  if (!existing.empty) {
    return jsonError("An account with this email already exists.", 422, {
      email: ["The email has already been taken."],
    });
  }

  const id = `usr-${randomBytes(4).toString("hex")}`;
  const salt = randomBytes(16).toString("hex");
  const created_at = new Date().toISOString();
  const user = {
    id,
    name,
    email,
    role,
    avatar_url: null,
    email_verified_at: created_at,
    created_at,
    salt,
    password_hash: hashPassword(password, salt),
  };

  await db.collection("users").doc(id).set(user);
  const token = await createSession(id);
  return jsonOk({ token, user: toUserDoc(user) }, 201);
}
