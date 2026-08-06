"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { ROLE_HOME } from "@/lib/constants";
import { authService } from "@/services/auth";
import { ApiError } from "@/types/api";

/**
 * Email verification — called with ?id=<uuid>&hash=<signature> from the
 * verification email, or with no params when the user lands here directly.
 */
export function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<"verifying" | "done" | "error">("verifying");
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const id = searchParams.get("id");
    const hash = searchParams.get("hash");

    if (!id || !hash) {
      // Direct visit — nothing to verify yet; offer resend.
      setState("error");
      setMessage("No verification link detected. You can request a new one below.");
      return;
    }

    authService
      .verifyEmail({ id, hash })
      .then(() => {
        setState("done");
        toast.success("Email verified!");
        setTimeout(() => {
          router.replace(user ? ROLE_HOME[user.role] : "/login");
        }, 1200);
      })
      .catch((error: unknown) => {
        setState("error");
        setMessage(
          error instanceof ApiError
            ? error.message
            : "Verification failed. The link may have expired."
        );
      });
  }, [searchParams, router, user]);

  const resend = () => {
    authService
      .resendVerification()
      .then(() => toast.success("Verification email sent — check your inbox."))
      .catch(() => toast.error("Could not resend. Please try again."));
  };

  return (
    <div className="space-y-4 text-sm">
      {state === "verifying" ? (
        <p className="text-muted-foreground">Verifying your email address…</p>
      ) : null}
      {state === "done" ? (
        <p className="text-emerald-600 dark:text-emerald-400">
          Your email has been verified. Taking you to your workspace…
        </p>
      ) : null}
      {state === "error" ? (
        <>
          <p className="text-muted-foreground">{message}</p>
          <Button type="button" variant="outline" size="sm" onClick={resend}>
            Resend verification email
          </Button>
        </>
      ) : null}
    </div>
  );
}
