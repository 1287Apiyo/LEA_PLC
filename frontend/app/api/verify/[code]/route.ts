import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const verificationCode = decodeURIComponent(code).trim();
  if (!verificationCode) return jsonError("Verification code is required.", 422);

  const snapshot = await getDb().collection("certificates").where("verification_code", "==", verificationCode).limit(1).get();
  if (snapshot.empty) return jsonError("Certificate not found.", 404);
  const row = snapshot.docs[0].data() as Record<string, unknown>;
  return jsonOk({ data: {
    certificate_id: row.certificate_id ?? snapshot.docs[0].id,
    learner_name: row.learner_name ?? row.learnerName ?? "LEA Labs learner",
    course_title: row.course_title ?? row.courseTitle ?? row.course ?? "LEA Labs course",
    programme_title: row.programme_title ?? row.programme ?? "LEA Labs programme",
    issued_at: row.issued_at ?? row.created_at ?? null,
    status: row.status ?? "issued",
    verification_code: verificationCode,
  } });
}
