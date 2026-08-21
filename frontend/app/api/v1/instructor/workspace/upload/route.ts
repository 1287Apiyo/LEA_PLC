import { getDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk, requireUser } from "@/lib/firebase/api-helpers";
import { folderSegmentFor, saveAdminDocument } from "@/lib/storage/admin-documents";
import { getInstructorCourseIds } from "@/lib/instructor-access";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".csv", ".doc", ".docx", ".jpeg", ".jpg", ".md", ".pdf", ".png", ".ppt", ".pptx", ".txt", ".xls", ".xlsx", ".zip",
]);

type Row = Record<string, unknown>;

function value(input: unknown, fallback = "") {
  return String(input ?? fallback).trim();
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "-").replace(/[\r\n]/g, "-");
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const role = String(auth.user.role ?? "");
  if (!["instructor", "administrator", "admin"].includes(role)) return jsonError("Instructor access required.", 403);

  const form = await req.formData().catch(() => null);
  if (!form) return jsonError("Send the material as multipart form data.", 422);
  const fileValue = form.get("file");
  if (!(fileValue instanceof File)) return jsonError("Choose a file to upload.", 422);
  if (fileValue.size <= 0) return jsonError("The selected file is empty.", 422);
  if (fileValue.size > MAX_FILE_BYTES) return jsonError("Materials must be 25 MB or smaller.", 422);
  if (!ALLOWED_EXTENSIONS.has(extensionOf(fileValue.name))) return jsonError("This file type is not supported. Upload PDF, Office, text, image, CSV, Markdown, or ZIP files.", 422);

  const courseId = value(form.get("courseId"));
  if (!courseId) return jsonError("Select a course before uploading the material.", 422);
  const instructorId = String(auth.user.id ?? "");
  const isAdmin = ["administrator", "admin"].includes(role);
  if (!isAdmin && !(await getInstructorCourseIds(instructorId)).has(courseId)) return jsonError("You are not assigned to this course.", 403);

  const db = getDb();
  const courseSnapshot = await db.collection("courses").doc(courseId).get();
  if (!courseSnapshot.exists) return jsonError("The selected course could not be found.", 422);
  const course = courseSnapshot.data() as Row;
  const courseTitle = value(course.title, courseId);
  const title = value(form.get("title"), fileValue.name.replace(/\.[^.]+$/, ""));
  const category = value(form.get("category"), "Instructor material");
  const description = value(form.get("description"));
  const now = new Date().toISOString();
  const materialRef = db.collection("materials").doc();

  let storagePath = "";
  try {
    storagePath = await saveAdminDocument({
      administratorId: instructorId,
      documentId: materialRef.id,
      originalName: fileValue.name,
      bytes: new Uint8Array(await fileValue.arrayBuffer()),
      folderSegment: folderSegmentFor({ documentKind: "course", courseId }),
    });

    const record = {
      id: materialRef.id,
      title,
      url: `/api/v1/instructor/workspace/files/${materialRef.id}`,
      download_url: `/api/v1/instructor/workspace/files/${materialRef.id}`,
      originalName: safeName(fileValue.name),
      contentType: fileValue.type || "application/octet-stream",
      sizeBytes: fileValue.size,
      storagePath,
      storageBackend: "local-filesystem",
      category,
      description,
      courseId,
      course_title: courseTitle,
      instructorId,
      published: true,
      created_at: now,
      updated_at: now,
    };
    await materialRef.set(record);

    const enrolments = await db.collection("enrolments").where("courseId", "==", courseId).limit(500).get();
    await Promise.all(enrolments.docs.map((doc) => {
      const learnerId = value((doc.data() as Row).learnerId);
      return learnerId
        ? db.collection("notifications").add({ recipientId: learnerId, learnerId, type: "course_material", title: `New material: ${title}`, body: `Your instructor added ${title} to ${courseTitle}.`, href: "/learner/downloads", read: false, created_at: now })
        : Promise.resolve();
    }));

    return jsonOk({ data: record }, 201);
  } catch (error) {
    console.error("[instructor-workspace] material upload failed", error);
    return jsonError("The material could not be stored on the local server.", 500);
  }
}
