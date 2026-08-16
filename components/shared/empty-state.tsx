import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  icon?: ReactNode;
}

/** Consistent empty state for lists, tables and dashboards. */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Button size="sm" onClick={action.onClick} asChild={Boolean(action.href)}>
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      ) : null}
    </div>
  );
}
