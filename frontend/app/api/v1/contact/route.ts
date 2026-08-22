import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const organisation = String(body?.organisation ?? "").trim();
  const message = String(body?.message ?? "").trim();
  const teamSize = String(body?.teamSize ?? "").trim();

  if (!name || !email || !organisation || !message) return jsonError("Please complete all required fields.", 422);
  if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("Please provide a valid work email.", 422);

  await getDb().collection("contact_inquiries").add({ name, email, organisation, teamSize, message, type: "corporate-training", status: "new", createdAt: new Date().toISOString() });
  return jsonOk({ received: true });
}
