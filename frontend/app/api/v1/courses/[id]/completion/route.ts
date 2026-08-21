import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { evaluateCourseCompletion, issueCourseCertificate } from "@/lib/course-completion";

export const runtime = "nodejs";

/** GET /api/v1/courses/[id]/completion — show evidence checklist and eligibility. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can view personal completion evidence.", 403);
  const { id } = await ctx.params;
  const learnerId = String(auth.user.id ?? "");
  if (!learnerId) return jsonError("Learner identity is missing.", 401);
  const completion = await evaluateCourseCompletion(getDb(), learnerId, id);
  if (!completion) return jsonError("Course or enrolment not found.", 404);
  return jsonOk({ data: completion });
}

/** POST /api/v1/courses/[id]/completion — issue a certificate only after all rules pass. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "learner") return jsonError("Only learners can request a personal certificate.", 403);
  const { id } = await ctx.params;
  const learnerId = String(auth.user.id ?? "");
  if (!learnerId) return jsonError("Learner identity is missing.", 401);
  const result = await issueCourseCertificate(getDb(), learnerId, id);
  if ("error" in result && !result.completion) return jsonError(String(result.error ?? "Certificate request failed."), 404);
  if ("error" in result) return jsonError(String(result.error ?? "Complete the course requirements first."), 422);
  return jsonOk({ data: { ...result.certificate, completion: result.completion, existing: result.existing } }, result.existing ? 200 : 201);
}
