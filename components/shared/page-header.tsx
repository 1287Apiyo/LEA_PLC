import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Actions rendered on the right (buttons, filters, exports…). */
  actions?: ReactNode;
}

/** Standard page title block used across all modules. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
