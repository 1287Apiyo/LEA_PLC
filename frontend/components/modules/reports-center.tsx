"use client";

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

interface ReportDefinition {
  title: string;
  description: string;
  icon: LucideIcon;
}

const REPORTS: ReportDefinition[] = [
  { title: "Revenue report", description: "Income by programme, payment method and period.", icon: Wallet },
  { title: "Attendance report", description: "Attendance rates by class, learner and week.", icon: ClipboardCheck },
  { title: "Completion report", description: "Course and programme completion rates.", icon: CheckCircle2 },
  { title: "Performance report", description: "Assessment scores and grade distributions.", icon: BarChart3 },
  { title: "Impact report", description: "Outcomes, certifications and community reach.", icon: HeartHandshake },
  { title: "Certificates report", description: "Certificates issued, verified and delivered.", icon: Award },
  { title: "Projects report", description: "Technology services projects and support tickets.", icon: Wrench },
  { title: "Trainer report", description: "Per-instructor classes, learners and ratings.", icon: UserCog },
  { title: "Learner report", description: "Individual learner progress, attendance and grades.", icon: Users },
  { title: "School report", description: "School labs, devices, visits and learning impact.", icon: School },
  { title: "Corporate report", description: "Company training hours, employees and contract value.", icon: Building2 },
];

/** Reports center — one card per exportable report. */
export function ReportsCenter() {
  const exportReport = (title: string) => {
    toast.info(`${title} is being prepared — download will start shortly.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue, attendance, completion, performance and impact analytics — exportable to PDF and Excel."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => (
          <Card key={report.title} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <report.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="flex-1 text-sm text-muted-foreground">{report.description}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => exportReport(report.title)}
                >
                  <FileDown className="h-3.5 w-3.5" aria-hidden />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => exportReport(report.title)}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
