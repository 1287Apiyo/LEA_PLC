"use client";

import { useEffect, useState, type ReactNode } from "react";

const MOCK_ENABLED = process.env.NEXT_PUBLIC_API_MOCK === "true";

/**
 * Dev-mode API mock — starts the MSW service worker when
 * NEXT_PUBLIC_API_MOCK=true. Renders children only once the worker
 * is ready so the first request is always intercepted.
 */
export function MockProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!MOCK_ENABLED);

  useEffect(() => {
    if (!MOCK_ENABLED) return;
    let cancelled = false;

    async function start() {
      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });
      if (!cancelled) setReady(true);
    }

    void start();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Starting workspace…
      </div>
    );
  }

  return <>{children}</>;
}
