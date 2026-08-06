"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
}

/** Dashboard metric card — label, value, trend delta and hint. */
export function StatCard({ label, value, delta, hint, icon: Icon }: StatCardProps) {
  const hasDelta = delta !== undefined && delta !== null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          {hasDelta ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              )}
            >
              {delta >= 0 ? (
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              ) : (
                <ArrowDownRight className="h-3 w-3" aria-hidden />
              )}
              {Math.abs(delta)}%
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
