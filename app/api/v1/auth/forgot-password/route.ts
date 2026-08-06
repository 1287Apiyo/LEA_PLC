import { jsonError } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

/** POST /api/v1/auth/forgot-password — placeholder until Firebase Auth is wired. */
export async function POST() {
  return jsonError("Password reset will be available with the Firebase Auth integration.", 501);
}
