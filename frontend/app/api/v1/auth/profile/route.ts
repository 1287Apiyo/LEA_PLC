import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { toUserDoc } from "@/lib/firebase/auth";

export const runtime = "nodejs";

/** PUT /api/v1/auth/profile — updates the current user's profile fields. */
export async function PUT(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const body = (await req.json().catch(() => null)) as { name?: string; email?: string; avatar_url?: string | null } | null;
  if (!body) return jsonError("Invalid payload.", 422);

  const db = getDb();
  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.avatar_url === "string" || body.avatar_url === null) updates.avatar_url = body.avatar_url;

  if (Object.keys(updates).length > 0) {
    await db.collection("users").doc(auth.user.id).update(updates);
  }

  const snap = await db.collection("users").doc(auth.user.id).get();
  return jsonOk(toUserDoc({ id: snap.id, ...snap.data() }));
}
