import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/firebase/admin";
import type { Role, User } from "@/types/auth";

/**
 * Demo-grade password hashing (scrypt) + Firestore-backed sessions.
 * Passwords are salted and hashed with scrypt — never stored in plaintext.
 * (Production recommendation: Firebase Auth or a managed identity provider.)
 */

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, salt: string, expected: string): boolean {
  const candidate = scryptSync(password, salt, 64);
  const stored = Buffer.from(expected, "hex");
  return stored.length === candidate.length && timingSafeEqual(candidate, stored);
}

export function toUserDoc(data: Record<string, unknown>): User {
  return {
    id: String(data.id),
    name: String(data.name),
    email: String(data.email),
    role: data.role as Role,
    avatar_url: (data.avatar_url as string | null) ?? null,
    email_verified_at: (data.email_verified_at as string | null) ?? null,
    created_at: String(data.created_at),
  };
}

export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.collection("sessions").doc(token).set({
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  const db = getDb();
  await db.collection("sessions").doc(token).delete();
}

/** Resolves a bearer token to a user, or null when invalid/expired. */
export async function getUserFromToken(token: string | null | undefined): Promise<User | null> {
  if (!token) return null;
  const db = getDb();
  const sessionSnap = await db.collection("sessions").doc(token).get();
  if (!sessionSnap.exists) return null;
  const session = sessionSnap.data();
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
  const userSnap = await db.collection("users").doc(session.userId).get();
  if (!userSnap.exists) return null;
  return toUserDoc({ id: userSnap.id, ...userSnap.data() });
}

/** Extracts the bearer token from a request Authorization header. */
export function bearerToken(authorization: string | null): string | null {
  if (!authorization) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authorization);
  return match?.[1] ?? null;
}
