import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ROOT = path.join(process.cwd(), "var", "admin-documents");

function rootDirectory(): string {
  return process.env.LEA_DOCUMENTS_DIR?.trim() || DEFAULT_ROOT;
}

function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+|-+$/g, "") || "document";
}

function resolveStoredPath(storagePath: string): string {
  const normalized = storagePath.replace(/\\/g, "/");
  if (!normalized.startsWith("admin-documents/") || normalized.includes("..")) {
    throw new Error("Invalid administrator document path.");
  }
  const root = path.resolve(rootDirectory());
  const candidate = path.resolve(root, normalized.slice("admin-documents/".length));
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid administrator document path.");
  }
  return candidate;
}

export async function saveAdminDocument(input: {
  administratorId: string;
  documentId: string;
  originalName: string;
  bytes: Uint8Array;
}): Promise<string> {
  const safeAdministrator = safeSegment(input.administratorId);
  const safeFilename = safeSegment(input.originalName);
  const storagePath = `admin-documents/${safeAdministrator}/${safeSegment(input.documentId)}-${safeFilename}`;
  const absolutePath = resolveStoredPath(storagePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, input.bytes);
  return storagePath;
}

export async function readAdminDocument(storagePath: string): Promise<Buffer> {
  return readFile(resolveStoredPath(storagePath));
}

export async function deleteAdminDocument(storagePath: string): Promise<void> {
  await rm(resolveStoredPath(storagePath), { force: true });
}
