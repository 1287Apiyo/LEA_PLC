"use client";

import type { ReactNode } from "react";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const today = new Date().toLocaleDateString("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

interface GreetingBannerProps {
  firstName: string;
  message: string;
  /** Small status chip rendered bottom-right. */
  chip?: ReactNode;
  /** Optional action (e.g. a refresh button) rendered top-right. */
  action?: ReactNode;
}

/** Home banner — white card with a flat orange left accent, shared by every role dashboard. */
export function GreetingBanner({ firstName, message, chip, action }: GreetingBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
      <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />
      {action ? <div className="absolute right-5 top-4">{action}</div> : null}
      <p className="text-xs font-medium text-muted-foreground">{today}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {greeting()}, {firstName}
      </h1>
      <p className="mt-1 max-w-lg text-sm text-muted-foreground">{message}</p>
      {chip ? (
        <span className="absolute bottom-4 right-5 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          {chip}
        </span>
      ) : null}
    </div>
  );
}
