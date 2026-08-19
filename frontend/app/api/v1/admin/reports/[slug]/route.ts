import PDFDocument from "pdfkit";
import { getDb } from "@/lib/firebase/admin";
import { jsonError, requireUser } from "@/lib/firebase/api-helpers";

export const runtime = "nodejs";

type ReportDefinition = { title: string; collection: string; role?: string };

const REPORTS: Record<string, ReportDefinition> = {
  revenue: { title: "Revenue report", collection: "payments" },
  attendance: { title: "Attendance report", collection: "attendance" },
  completion: { title: "Completion report", collection: "enrolments" },
  performance: { title: "Performance report", collection: "assessments" },
  impact: { title: "Impact report", collection: "certificates" },
  certificates: { title: "Certificates report", collection: "certificates" },
  projects: { title: "Projects report", collection: "projects" },
  trainer: { title: "Trainer report", collection: "users", role: "instructor" },
  learner: { title: "Learner report", collection: "users", role: "learner" },
  school: { title: "School report", collection: "schools" },
  corporate: { title: "Corporate report", collection: "companies" },
};

const PRIVATE_FIELDS = new Set(["salt", "password_hash", "storagePath"]);

function clean(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).replace(/\r?\n/g, " ").trim();
}

function rowsAsCsv(rows: Record<string, unknown>[]): string {
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row).filter((key) => !PRIVATE_FIELDS.has(key)))));
  const quote = (value: unknown) => `"${clean(value).replace(/"/g, '""')}"`;
  return [keys.map(quote).join(","), ...rows.map((row) => keys.map((key) => quote(row[key])).join(","))].join("\n");
}

function renderPdf(title: string, rows: Record<string, unknown>[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: "A4", margins: { top: 48, bottom: 48, left: 48, right: 48 }, info: { Title: `LEA Labs — ${title}`, Author: "LEA Labs" } });
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.rect(0, 0, document.page.width, 8).fill("#f47945");
    document.fillColor("#1f0d2e").font("Helvetica-Bold").fontSize(20).text("LEA LABS");
    document.moveDown(0.4);
    document.fillColor("#4d176e").fontSize(16).text(title);
    document.fillColor("#5f5661").font("Helvetica").fontSize(9).text(`Generated ${new Date().toLocaleString("en-KE")}`);
    document.moveDown(0.8);

    if (!rows.length) {
      document.fillColor("#151116").fontSize(11).text("No records were available for this report.");
    } else {
      rows.slice(0, 250).forEach((row, index) => {
        const fields = Object.entries(row).filter(([key]) => !PRIVATE_FIELDS.has(key)).slice(0, 8);
        document.fillColor(index % 2 ? "#f6eef9" : "#ffffff").rect(document.page.margins.left, document.y, document.page.width - document.page.margins.left - document.page.margins.right, 34).fill();
        document.fillColor("#151116").font("Helvetica-Bold").fontSize(9).text(`${index + 1}. ${clean(row.title ?? row.name ?? row.id ?? "Record")}`, { width: 150, continued: false });
        document.fillColor("#5f5661").font("Helvetica").fontSize(8).text(fields.map(([key, value]) => `${key}: ${clean(value)}`).join(" · "), { width: document.page.width - document.page.margins.left - document.page.margins.right - 165, align: "right", lineGap: 2 });
        document.moveDown(0.35);
        if (document.y > document.page.height - document.page.margins.bottom - 50) document.addPage();
      });
    }
    document.end();
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;
  if (auth.user.role !== "administrator") return jsonError("Administrator access required.", 403);

  const { slug } = await params;
  const definition = REPORTS[slug];
  if (!definition) return jsonError("Report not found.", 404);
  const format = new URL(req.url).searchParams.get("format") === "pdf" ? "pdf" : "csv";

  const query = definition.role
    ? getDb().collection(definition.collection).where("role", "==", definition.role).limit(500)
    : getDb().collection(definition.collection).limit(500);
  const snapshot = await query.get();
  const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }));
  const filename = `lea-${slug}-report.${format === "pdf" ? "pdf" : "csv"}`;

  if (format === "csv") {
    return new Response(`\ufeff${rowsAsCsv(rows)}`, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "private, no-store" } });
  }

  const pdf = await renderPdf(definition.title, rows);
  return new Response(new Uint8Array(pdf), { status: 200, headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"`, "Content-Length": String(pdf.length), "Cache-Control": "private, no-store" } });
}
