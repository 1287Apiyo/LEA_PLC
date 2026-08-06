"use client";

import Link from "next/link";
import {
  Award,
  BarChart3,
  CalendarPlus,
  ClipboardCheck,
  Code2,
  FilePlus2,
  GraduationCap,
  Megaphone,
  MonitorSmartphone,
  Plus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

const ACTIONS: Record<"administrator" | "instructor" | "learner", QuickAction[]> = {
  administrator: [
    { label: "Register learner", href: "/admin/learners", icon: Users },
    { label: "Schedule class", href: "/admin/classes", icon: CalendarPlus },
    { label: "New course", href: "/admin/courses", icon: Plus },
    { label: "Record payment", href: "/admin/finance", icon: Wallet },
    { label: "Run report", href: "/admin/reports", icon: BarChart3 },
    { label: "Issue certificate", href: "/admin/certificates", icon: Award },
  ],
  instructor: [
    { label: "Mark attendance", href: "/instructor/attendance", icon: ClipboardCheck },
    { label: "Create assignment", href: "/instructor/assignments", icon: FilePlus2 },
    { label: "Grade work", href: "/instructor/grades", icon: Award },
    { label: "Post announcement", href: "/instructor/announcements", icon: Megaphone },
    { label: "View analytics", href: "/instructor/analytics", icon: BarChart3 },
  ],
  learner: [
    { label: "Resume course", href: "/learner/courses", icon: GraduationCap },
    { label: "My assignments", href: "/learner/assignments", icon: FilePlus2 },
    { label: "Coding workspace", href: "/learner/playground", icon: Code2 },
    { label: "My portfolio", href: "/learner/portfolio", icon: MonitorSmartphone },
  ],
};

/** Dashboard quick actions — role-aware shortcuts. */
export function QuickActions({ role }: { role: keyof typeof ACTIONS }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ACTIONS[role].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            className="justify-start gap-2 h-9"
            asChild
          >
            <Link href={action.href}>
              <action.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
