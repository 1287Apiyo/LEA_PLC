import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshot = await getDb().collection("projects").doc(decodeURIComponent(id)).get();
  if (!snapshot.exists) return jsonError("Portfolio project not found.", 404);
  const row = snapshot.data() as Record<string, unknown>;
  if (row.status !== "published" && row.visibility !== "public") return jsonError("This portfolio project is not public.", 404);
  return jsonOk({ data: { id: snapshot.id, title: row.title ?? "LEA Labs project", description: row.description ?? "", link: row.link ?? "", tags: row.tags ?? [], reflection: row.reflection ?? "", published_at: row.published_at ?? row.updated_at ?? row.created_at ?? null } });
}
