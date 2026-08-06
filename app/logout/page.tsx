"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLogout } from "@/hooks/use-auth";

/** Dedicated /logout route — signs out and returns to the login page. */
export default function LogoutPage() {
  const router = useRouter();
  const logout = useLogout();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    logout.mutate(undefined, {
      onSettled: () => router.replace("/login"),
    });
  }, [logout, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Signing you out…
    </div>
  );
}
