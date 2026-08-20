import { readFile } from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

const STATIC_PACKS: Record<string, { relativePath: string; filename: string }> = {
  "crs-app": {
    relativePath: "course-packs/application-development.pdf",
    filename: "lea-application-development-course-pack.pdf",
  },
  "crs-web": {
    relativePath: "course-packs/web-development.pdf",
    filename: "lea-web-development-course-pack.pdf",
  },
};

function clean(value: unknown) {
  return String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/[*_`#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
}

function asText(value: unknown) {
  return clean(value) || "Not provided yet.";
}

function lessonNotesForPdf(lesson: Record<string, unknown>) {
  const content = lesson.lesson_content as Record<string, unknown> | undefined;
  const sections = Array.isArray(content?.sections) ? content.sections as Record<string, unknown>[] : [];
  if (!sections.length) return lesson.notes;
  return [
    content?.learning_goal,
    ...sections.flatMap((section) => [section.title, section.body]),
  ].filter(Boolean).join("\n\n");
}

function renderPdf(course: Record<string, unknown>, lessons: Record<string, unknown>[], origin: string) {
  return new Promise<Buffer>((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      info: {
        Title: `LEA Labs — ${asText(course.title)}`,
        Author: "LEA Labs",
        Subject: "Course learning pack",
        Keywords: "LEA Labs, learning, course, lesson notes",
      },
    });
    const chunks: Buffer[] = [];

    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    const contentWidth = document.page.width - document.page.margins.left - document.page.margins.right;
    const purple = "#1f0d2e";
    const brandPurple = "#4d176e";
    const orange = "#f47945";
    const ink = "#151116";
    const muted = "#5f5661";

    const heading = (text: string, size = 14) => {
      document.moveDown(0.65);
      document.fillColor(brandPurple).font("Helvetica-Bold").fontSize(size).text(text, { width: contentWidth });
      document.moveDown(0.18);
    };

    const body = (text: unknown, options: { color?: string; size?: number; gap?: number } = {}) => {
      document
        .fillColor(options.color ?? muted)
        .font("Helvetica")
        .fontSize(options.size ?? 10)
        .text(asText(text), { width: contentWidth, lineGap: options.gap ?? 3 });
    };

    document.rect(0, 0, document.page.width, 10).fill(orange);
    document.fillColor(purple).font("Helvetica-Bold").fontSize(25).text("LEA LABS", { width: contentWidth });
    document.moveDown(0.45);
    document.fillColor(ink).font("Helvetica-Bold").fontSize(20).text(asText(course.title), { width: contentWidth });
    document.moveDown(0.25);
    document.fillColor(brandPurple).font("Helvetica-Bold").fontSize(10).text(`${asText(course.programme)}  ·  ${asText(course.duration_weeks)} weeks  ·  ${lessons.length} lessons`, { width: contentWidth });
    document.moveDown(0.6);
    body(course.summary ?? course.description, { color: ink, size: 11, gap: 4 });

    heading("How to use this learning pack", 13);
    body("Use the lesson notes to prepare before watching, practise the assignment after the video, and use the links at the end of each lesson for additional support. You can work through the lessons in sequence or revisit any lesson when you need a refresher.");

    heading("By the end of this course, you can", 13);
    const outcomes = Array.isArray(course.outcomes) ? course.outcomes : [];
    if (outcomes.length) {
      for (const outcome of outcomes) {
        document.fillColor(muted).font("Helvetica").fontSize(10).text(`• ${asText(outcome)}`, { width: contentWidth, indent: 10, lineGap: 3 });
      }
    } else {
      body("Complete the lesson sequence and submit the practical project evidence.");
    }

    heading("Lesson notes and practice sequence", 15);
    lessons.forEach((lesson, index) => {
      if (index > 0) document.addPage();
      document.fillColor(orange).font("Helvetica-Bold").fontSize(10).text(`LESSON ${index + 1}  ·  ${asText(lesson.duration_minutes)} MINUTES`, { width: contentWidth });
      document.moveDown(0.2);
      document.fillColor(ink).font("Helvetica-Bold").fontSize(17).text(asText(lesson.title), { width: contentWidth });
      document.moveDown(0.35);

      heading("Lesson overview", 12);
      body(lesson.description);

      heading("Notes", 12);
      body(lessonNotesForPdf(lesson), { color: ink, size: 10, gap: 4 });

      heading("Practice assignment", 12);
      body(lesson.assignment, { color: ink, size: 10, gap: 4 });

      const videoUrl = clean(lesson.video_url);
      if (videoUrl) {
        heading("Video", 12);
        body(videoUrl, { color: brandPurple, size: 9 });
      }

      const resources = Array.isArray(lesson.resources) ? (lesson.resources as Record<string, unknown>[]) : [];
      if (resources.length) {
        heading("Additional resources", 12);
        for (const resource of resources) {
          const title = asText(resource.title) || "Learning resource";
          const url = clean(resource.download_url) || clean(resource.url);
          const resolvedUrl = url.startsWith("/") ? `${origin}${url}` : url;
          document.fillColor(muted).font("Helvetica").fontSize(9).text(`• ${title}`, { width: contentWidth, lineGap: 2 });
          if (resolvedUrl) document.fillColor(brandPurple).fontSize(8).text(resolvedUrl, { width: contentWidth, indent: 10, lineGap: 2 });
        }
      }
    });

    document.addPage();
    heading("Evidence of work", 15);
    body(course.project ?? course.deliverable, { color: ink, size: 11, gap: 4 });
    document.moveDown(0.8);
    body("This PDF was generated by LEA Labs for authenticated learners. External videos and references remain hosted by their original providers.", { size: 9 });

    document.end();
  });
}

/**
 * GET /api/v1/courses/[id]/lesson-pack
 *
 * Generates a private PDF pack from the authenticated learner curriculum in
 * Firestore. It includes original LEA lesson notes and links to external
 * resources without copying third-party media.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  const snap = await getDb().collection("courses").doc(id).get();
  if (!snap.exists) return jsonError("Course not found.", 404);

  const course = snap.data() ?? {};
  const lessons = Array.isArray(course.lessons) ? (course.lessons as Record<string, unknown>[]) : [];
  const staticPack = STATIC_PACKS[id];

  if (staticPack) {
    try {
      const pdf = await readFile(path.join(process.cwd(), "public", staticPack.relativePath));
      return new Response(new Uint8Array(pdf), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${staticPack.filename}"`,
          "Content-Length": String(pdf.byteLength),
          "Cache-Control": "private, no-store",
        },
      });
    } catch {
      // Fall back to the generated PDF if the approved static pack is unavailable.
    }
  }

  const pdf = await renderPdf(course, lessons, new URL(req.url).origin);
  const filename = `lea-${id}-course-notes.pdf`.replace(/[^a-zA-Z0-9._-]/g, "-");

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "private, no-store",
    },
  });
}
