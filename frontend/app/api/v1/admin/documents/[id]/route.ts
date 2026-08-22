import { getDb } from "@/lib/firebase/admin";
import { jsonError, requireUser } from "@/lib/firebase/api-helpers";
import { deleteAdminDocument } from "@/lib/storage/admin-documents";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Administrator access required.", 403);

  const { id } = await params;
  const documentRef = getDb().collection("documents").doc(id);
  const snapshot = await documentRef.get();
  if (!snapshot.exists) return jsonError("Document not found.", 404);

  const data = snapshot.data() as Record<string, unknown>;
  if (data.scope !== "administrator") return jsonError("Document not found.", 404);

  try {
    const storagePath = String(data.storagePath ?? "");
    if (storagePath) await deleteAdminDocument(storagePath);
    await documentRef.delete();
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[admin-documents] delete failed", error);
    return jsonError("The document could not be deleted from Firebase Storage.", 500);
  }
}
