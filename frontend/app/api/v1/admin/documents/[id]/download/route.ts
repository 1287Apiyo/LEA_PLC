import { getDb } from "@/lib/firebase/admin";
import { jsonError, requireUser } from "@/lib/firebase/api-helpers";
import { readAdminDocument } from "@/lib/storage/admin-documents";

export const runtime = "nodejs";

function downloadName(value: unknown): string {
  return String(value ?? "document").replace(/[^a-zA-Z0-9._ -]/g, "-").replace(/[\r\n]/g, "-");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Administrator access required.", 403);

  const { id } = await params;
  const snapshot = await getDb().collection("documents").doc(id).get();
  if (!snapshot.exists) return jsonError("Document not found.", 404);

  const data = snapshot.data() as Record<string, unknown>;
  if (data.scope !== "administrator") return jsonError("Document not found.", 404);
  const storagePath = String(data.storagePath ?? "");
  if (!storagePath) return jsonError("Document storage reference is missing.", 500);

  try {
    const bytes = await readAdminDocument(storagePath);
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": String(data.contentType ?? "application/octet-stream"),
        "Content-Disposition": `attachment; filename="${downloadName(data.originalName)}"`,
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[admin-documents] local download failed", error);
    return jsonError("The document file is missing from the local server.", 404);
  }
}
