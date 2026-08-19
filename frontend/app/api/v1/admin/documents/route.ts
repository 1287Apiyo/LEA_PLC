import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { deleteAdminDocument, saveAdminDocument } from "@/lib/storage/admin-documents";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".csv",
  ".doc",
  ".docx",
  ".jpeg",
  ".jpg",
  ".md",
  ".pdf",
  ".png",
  ".ppt",
  ".pptx",
  ".txt",
  ".xls",
  ".xlsx",
  ".zip",
]);

type StoredDocument = {
  id: string;
  title: string;
  category: string;
  description: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  storageBackend: "local-filesystem";
  scope: "administrator";
  createdBy: string;
  created_at: string;
  download_url: string;
};

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function serializedDocument(id: string, data: Record<string, unknown>): StoredDocument {
  return {
    id,
    title: String(data.title ?? data.originalName ?? "Untitled document"),
    category: String(data.category ?? "Official document"),
    description: String(data.description ?? ""),
    originalName: String(data.originalName ?? "document"),
    contentType: String(data.contentType ?? "application/octet-stream"),
    sizeBytes: Number(data.sizeBytes ?? 0),
    storagePath: String(data.storagePath ?? ""),
    storageBackend: "local-filesystem",
    scope: "administrator",
    createdBy: String(data.createdBy ?? ""),
    created_at: String(data.created_at ?? ""),
    download_url: `/api/v1/admin/documents/${id}/download`,
  };
}

async function administrator(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Administrator access required.", 403);
  return null;
}

export async function GET(req: Request) {
  const denied = await administrator(req);
  if (denied) return denied;

  try {
    const snap = await getDb().collection("documents").limit(200).get();
    const data = snap.docs
      .map((doc) => serializedDocument(doc.id, doc.data() as Record<string, unknown>))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return jsonOk({ data, meta: { total: data.length, storage_backend: "local-filesystem" } });
  } catch (error) {
    console.error("[admin-documents] list failed", error);
    return jsonError("Unable to load the document library.", 500);
  }
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Administrator access required.", 403);

  const form = await req.formData().catch(() => null);
  if (!form) return jsonError("Send the document as multipart form data.", 422);
  const fileValue = form.get("file");
  if (!(fileValue instanceof File)) return jsonError("Choose a document to upload.", 422);
  if (fileValue.size <= 0) return jsonError("The selected document is empty.", 422);
  if (fileValue.size > MAX_FILE_BYTES) return jsonError("Documents must be 25 MB or smaller.", 422);

  const extension = extensionOf(fileValue.name);
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return jsonError("This file type is not supported. Upload PDF, Office, text, image, CSV, Markdown, or ZIP files.", 422);
  }

  const title = String(form.get("title") ?? "").trim() || fileValue.name.replace(/\.[^.]+$/, "");
  const category = String(form.get("category") ?? "Official document").trim() || "Official document";
  const description = String(form.get("description") ?? "").trim();
  const createdAt = new Date().toISOString();
  const documentRef = getDb().collection("documents").doc();
  let storagePath = "";

  try {
    storagePath = await saveAdminDocument({
      administratorId: auth.user.id,
      documentId: documentRef.id,
      originalName: fileValue.name,
      bytes: new Uint8Array(await fileValue.arrayBuffer()),
    });

    const record = {
      title,
      category,
      description,
      originalName: fileValue.name,
      contentType: fileValue.type || "application/octet-stream",
      sizeBytes: fileValue.size,
      storagePath,
      storageBackend: "local-filesystem",
      scope: "administrator",
      createdBy: auth.user.id,
      created_at: createdAt,
      updated_at: createdAt,
    };
    await documentRef.set(record);
    return jsonOk({ data: serializedDocument(documentRef.id, record) }, 201);
  } catch (error) {
    if (storagePath) {
      await deleteAdminDocument(storagePath).catch(() => undefined);
    }
    console.error("[admin-documents] upload failed", error);
    return jsonError("The document could not be stored on the local server. Check the server folder permissions and try again.", 500);
  }
}
