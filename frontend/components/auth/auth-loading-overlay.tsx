"use client";

import { useEffect, useState } from "react";

export function AuthLoadingOverlay() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoading = () => setLoading(true);
    const handleStop = () => setLoading(false);
    window.addEventListener("lea-auth-loading", handleLoading);
    window.addEventListener("lea-auth-loading-stop", handleStop);
    return () => {
      window.removeEventListener("lea-auth-loading", handleLoading);
      window.removeEventListener("lea-auth-loading-stop", handleStop);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#1f0d2e] text-white" role="status" aria-live="polite" aria-label="Loading">
      <div aria-hidden className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#3b1c59] opacity-70 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#2b123f] opacity-80 blur-3xl" />
      <div className="relative flex flex-col items-center text-center lea-auth-loading-enter">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] bg-white/10 shadow-[0_18px_45px_rgba(25,12,90,0.25)] backdrop-blur-sm">
          <span className="absolute inset-2 rounded-[20px] border-2 border-white/25" />
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
        </div>
        <p className="mt-7 text-2xl font-semibold tracking-[-0.04em]">Getting things ready</p>
        <div className="mt-3 flex items-center gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
        </div>
        <p className="mt-5 text-sm text-white/65">One moment while we take you there.</p>
      </div>
    </div>
  );
}
