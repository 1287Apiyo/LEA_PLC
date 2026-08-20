import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import {
  deleteAdminDocument,
  folderSegmentFor,
  saveAdminDocument,
  type AdminDocumentKind,
  type AdminDocumentOrganization,
} from "@/lib/storage/admin-documents";

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

const DOCUMENT_KINDS = new Set<AdminDocumentKind>(["course", "official", "other"]);
const ORGANIZATIONS = new Set<AdminDocumentOrganization>(["lea-labs", "lea-afritech"]);

type StoredDocumentRecord = {
  title: string;
  category: string;
  documentKind: AdminDocumentKind;
  organization: AdminDocumentOrganization | null;
  courseId: string | null;
  courseTitle: string | null;
  programmeId: string | null;
  programmeTitle: string | null;
  folderSegment: string;
  description: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;
  storageBackend: "local-filesystem";
  scope: "administrator";
  createdBy: string;
  created_at: string;
  updated_at: string;
};

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function dateValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return "";
}

function parseDocumentKind(value: unknown): AdminDocumentKind {
  const normalized = stringValue(value).toLowerCase();
  return DOCUMENT_KINDS.has(normalized as AdminDocumentKind) ? (normalized as AdminDocumentKind) : "other";
}

function parseOrganization(value: unknown): AdminDocumentOrganization | null {
  const normalized = stringValue(value).toLowerCase();
  return ORGANIZATIONS.has(normalized as AdminDocumentOrganization)
    ? (normalized as AdminDocumentOrganization)
    : null;
}

function serializeDocument(id: string, data: Record<string, unknown>) {
  const legacyCourseId = stringValue(data.courseId || data.course_id);
  const documentKind = parseDocumentKind(data.documentKind || (legacyCourseId ? "course" : "other"));
  const organization = parseOrganization(data.organization);
  const courseId = legacyCourseId || null;
  const createdAt = dateValue(data.created_at || data.createdAt);
  const folderSegment = stringValue(data.folderSegment) || folderSegmentFor({
    documentKind,
    courseId: courseId || undefined,
    organization: organization || undefined,
  });

  return {
    id,
    title: stringValue(data.title) || stringValue(data.originalName || data.fileName) || "Untitled document",
    category: stringValue(data.category) || (documentKind === "course" ? "Course material" : documentKind === "official" ? "Official document" : "Other"),
    documentKind,
    organization,
    courseId,
    courseTitle: stringValue(data.courseTitle) || null,
    programmeId: stringValue(data.programmeId || data.programme_id) || null,
    programmeTitle: stringValue(data.programmeTitle) || null,
    folderSegment,
    description: stringValue(data.description),
    originalName: stringValue(data.originalName || data.fileName) || "document",
    contentType: stringValue(data.contentType || data.mimeType) || "application/octet-stream",
    sizeBytes: Number(data.sizeBytes ?? data.fileSize ?? 0),
    storagePath: stringValue(data.storagePath),
    storageBackend: "local-filesystem" as const,
    scope: "administrator" as const,
    createdBy: stringValue(data.createdBy || data.uploadedBy),
    created_at: createdAt,
    download_url: `/api/v1/admin/documents/${id}/download`,
  };
}

async function requireAdministrator(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Administrator access required.", 403);
  return null;
}

export async function GET(req: Request) {
  const denied = await requireAdministrator(req);
  if (denied) return denied;

  try {
    const snapshot = await getDb().collection("documents").limit(200).get();
    const data = snapshot.docs
      .map((document) => serializeDocument(document.id, document.data() as Record<string, unknown>))
      .sort((left, right) => right.created_at.localeCompare(left.created_at));

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
  if (!ALLOWED_EXTENSIONS.has(extensionOf(fileValue.name))) {
    return jsonError("This file type is not supported. Upload PDF, Office, text, image, CSV, Markdown, or ZIP files.", 422);
  }

  const documentKind = parseDocumentKind(form.get("documentKind"));
  const organization = parseOrganization(form.get("organization"));
  const courseId = stringValue(form.get("courseId"));
  let courseTitle = stringValue(form.get("courseTitle"));
  let programmeId = stringValue(form.get("programmeId"));
  let programmeTitle = stringValue(form.get("programmeTitle"));

  if (documentKind === "course") {
    if (!courseId) return jsonError("Select a course before uploading the document.", 422);

    const courseSnapshot = await getDb().collection("courses").doc(courseId).get();
    if (!courseSnapshot.exists) return jsonError("The selected course could not be found.", 422);

    const course = courseSnapshot.data() as Record<string, unknown>;
    courseTitle = stringValue(course.title) || courseTitle || courseId;
    programmeId = stringValue(course.programme || course.programme_id) || programmeId;

    if (programmeId) {
      const programmeSnapshot = await getDb().collection("programmes").doc(programmeId).get();
      if (programmeSnapshot.exists) {
        const programme = programmeSnapshot.data() as Record<string, unknown>;
        programmeTitle = stringValue(programme.title || programme.name) || programmeTitle || programmeId;
      }
    }
  }

  if (documentKind === "official" && !organization) {
    return jsonError("Choose whether this is a LEA Labs or LEA Afritech official document.", 422);
  }

  const title = stringValue(form.get("title")) || fileValue.name.replace(/\.[^.]+$/, "");
  const category = stringValue(form.get("category")) || (documentKind === "course" ? "Course material" : documentKind === "official" ? "Official document" : "Other");
  const description = stringValue(form.get("description"));
  const createdAt = new Date().toISOString();
  const documentRef = getDb().collection("documents").doc();
  const folderSegment = folderSegmentFor({
    documentKind,
    courseId: documentKind === "course" ? courseId : undefined,
    organization: organization || undefined,
  });

  let storagePath = "";
  try {
    storagePath = await saveAdminDocument({
      administratorId: auth.user.id,
      documentId: documentRef.id,
      originalName: fileValue.name,
      bytes: new Uint8Array(await fileValue.arrayBuffer()),
      folderSegment,
    });

    const record: StoredDocumentRecord = {
      title,
      category,
      documentKind,
      organization,
      courseId: documentKind === "course" ? courseId : null,
      courseTitle: documentKind === "course" ? courseTitle : null,
      programmeId: documentKind === "course" ? programmeId || null : null,
      programmeTitle: documentKind === "course" ? programmeTitle || null : null,
      folderSegment,
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
    return jsonOk({ data: serializeDocument(documentRef.id, record) }, 201);
  } catch (error) {
    if (storagePath) await deleteAdminDocument(storagePath).catch(() => undefined);
    console.error("[admin-documents] upload failed", error);
    return jsonError("The document could not be stored on the local server. Check the server folder permissions and try again.", 500);
  }
}
