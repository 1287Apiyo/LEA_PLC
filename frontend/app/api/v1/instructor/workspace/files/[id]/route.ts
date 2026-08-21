import { getDb } from "@/lib/firebase/admin";
import { jsonError, requireUser } from "@/lib/firebase/api-helpers";
import { readAdminDocument } from "@/lib/storage/admin-documents";
import { getInstructorCourseIds } from "@/lib/instructor-access";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

function downloadName(value: unknown) {
  return String(value ?? "material").replace(/[^a-zA-Z0-9._ -]/g, "-").replace(/[\r\n]/g, "-");
}

async function canAccessMaterial(userId: string, role: string, courseId: string) {
  if (["admin", "administrator", "instructor", "tutor"].includes(role)) {
    if (["admin", "administrator"].includes(role)) return true;
    return (await getInstructorCourseIds(userId)).has(courseId);
  }
  const enrollment = await getDb().collection("enrolments").where("learnerId", "==", userId).where("courseId", "==", courseId).limit(1).get();
  return !enrollment.empty;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  const { id } = await params;
  const snapshot = await getDb().collection("materials").doc(id).get();
  if (!snapshot.exists) return jsonError("Material not found.", 404);
  const data = snapshot.data() as Row;
  const courseId = String(data.courseId ?? data.course_id ?? "");
  if (!courseId || !(await canAccessMaterial(String(auth.user.id ?? ""), String(auth.user.role ?? "learner"), courseId))) {
    return jsonError("You do not have access to this course material.", 403);
  }
  const storagePath = String(data.storagePath ?? "");
  if (!storagePath) return jsonError("Material storage reference is missing.", 500);

  try {
    const bytes = await readAdminDocument(storagePath);
    if (String(data.instructorId ?? "") !== String(auth.user.id ?? "") && String(auth.user.role ?? "") === "learner") {
      await getDb().collection("downloads").add({ learnerId: auth.user.id, courseId, materialId: id, title: String(data.title ?? data.originalName ?? "Course material"), fileUrl: `/api/v1/instructor/workspace/files/${id}`, downloaded_at: new Date().toISOString() });
    }
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": String(data.contentType ?? "application/octet-stream"),
        "Content-Disposition": `attachment; filename="${downloadName(data.originalName ?? data.title)}"`,
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[instructor-workspace] local material download failed", error);
    return jsonError("The material file is missing from the local server.", 404);
  }
}
