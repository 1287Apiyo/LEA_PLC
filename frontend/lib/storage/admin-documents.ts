import { getBucket } from "@/lib/firebase/admin";

export type AdminDocumentKind = "course" | "official" | "other";
export type AdminDocumentOrganization = "lea-labs" | "lea-afritech";

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+|-+$/g, "") || "document";
}

export function folderSegmentFor(input: {
  documentKind: AdminDocumentKind;
  courseId?: string;
  organization?: AdminDocumentOrganization;
}): string {
  if (input.documentKind === "course" && input.courseId) return `course-${safeSegment(input.courseId)}`;
  if (input.documentKind === "official" && input.organization) return `${safeSegment(input.organization)}-official`;
  return "other";
}

function validateStoragePath(storagePath: string): string {
  const normalized = storagePath.replace(/\\/g, "/");
  if (!normalized.startsWith("admin-documents/") || normalized.includes("..")) {
    throw new Error("Invalid administrator document path.");
  }
  return normalized;
}

export async function saveAdminDocument(input: {
  administratorId: string;
  documentId: string;
  originalName: string;
  bytes: Uint8Array;
  contentType?: string;
  folderSegment?: string;
}): Promise<string> {
  const storagePath = `admin-documents/${safeSegment(input.administratorId)}/${safeSegment(input.folderSegment || "other")}/${safeSegment(input.documentId)}-${safeSegment(input.originalName)}`;
  const file = getBucket().file(storagePath);
  await file.save(Buffer.from(input.bytes), {
    resumable: false,
    metadata: { contentType: input.contentType || "application/octet-stream" },
  });
  return storagePath;
}

export async function readAdminDocument(storagePath: string): Promise<Buffer> {
  const [bytes] = await getBucket().file(validateStoragePath(storagePath)).download();
  return bytes;
}

export async function deleteAdminDocument(storagePath: string): Promise<void> {
  await getBucket().file(validateStoragePath(storagePath)).delete({ ignoreNotFound: true });
}
