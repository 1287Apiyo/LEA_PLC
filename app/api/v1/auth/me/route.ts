import { bearerToken, deleteSession, getUserFromToken } from "@/lib/firebase/auth";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

/** POST /api/v1/auth/logout — invalidates the current session. */
export async function POST(req: Request) {
  const token = bearerToken(req.headers.get("authorization"));
  if (token) await deleteSession(token);
  return jsonOk({ message: "Logged out." });
}

/** GET /api/v1/auth/me — returns the authenticated user (or 401 when missing). */
export async function GET(req: Request) {
  const user = await getUserFromToken(bearerToken(req.headers.get("authorization")));
  if (!user) return jsonError("Unauthenticated.", 401);
  return jsonOk(user);
}
