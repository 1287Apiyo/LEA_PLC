"use client";

import { useState } from "react";
import {
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileDown,
  FileSpreadsheet,
  HeartHandshake,
  School,
  UserCog,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { API_BASE_URL } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

interface ReportDefinition {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const REPORTS: ReportDefinition[] = [
  { slug: "revenue", title: "Revenue report", description: "Income by programme, payment method and period.", icon: Wallet },
  { slug: "attendance", title: "Attendance report", description: "Attendance rates by class, learner and week.", icon: ClipboardCheck },
  { slug: "completion", title: "Completion report", description: "Course and programme completion rates.", icon: CheckCircle2 },
  { slug: "performance", title: "Performance report", description: "Assessment scores and grade distributions.", icon: BarChart3 },
  { slug: "impact", title: "Impact report", description: "Outcomes, certifications and community reach.", icon: HeartHandshake },
  { slug: "certificates", title: "Certificates report", description: "Certificates issued, verified and delivered.", icon: Award },
  { slug: "projects", title: "Projects report", description: "Technology services projects and support tickets.", icon: Wrench },
  { slug: "trainer", title: "Trainer report", description: "Per-instructor classes, learners and ratings.", icon: UserCog },
  { slug: "learner", title: "Learner report", description: "Individual learner progress, attendance and grades.", icon: Users },
  { slug: "school", title: "School report", description: "School labs, devices, visits and learning impact.", icon: School },
  { slug: "corporate", title: "Corporate report", description: "Company training hours, employees and contract value.", icon: Building2 },
];

/** Reports center — real PDF and CSV exports from administrator-scoped data. */
export function ReportsCenter() {
  const [pending, setPending] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  async function exportReport(report: ReportDefinition, format: "pdf" | "csv") {
    if (!token) {
      window.location.assign("/login");
      return;
    }
    const actionKey = `${report.slug}-${format}`;
    setPending(actionKey);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/${report.slug}?format=${format}`, {
        headers: { Accept: format === "pdf" ? "application/pdf" : "text/csv", Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? `Report export failed with status ${response.status}.`);
      }
      const blobUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `lea-${report.slug}-report.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
      toast.success(`${report.title} downloaded.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The report could not be exported.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue, attendance, completion, performance and impact analytics — exportable to PDF and CSV/Excel-compatible format."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => (
          <Card key={report.slug} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <report.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="flex-1 text-sm text-muted-foreground">{report.description}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void exportReport(report, "pdf")} disabled={pending !== null}>
                  <FileDown className="h-3.5 w-3.5" aria-hidden />
                  {pending === `${report.slug}-pdf` ? "Preparing…" : "PDF"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void exportReport(report, "csv")} disabled={pending !== null}>
                  <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
                  {pending === `${report.slug}-csv` ? "Preparing…" : "CSV / Excel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
