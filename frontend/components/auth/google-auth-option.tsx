"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { firebaseAuth } from "@/lib/firebase/client";
import { api } from "@/lib/api-client";
import { ROLE_HOME } from "@/lib/constants";
import type { AuthResponse, Role } from "@/types/auth";

export function GoogleAuthOption({ role = "learner" }: { role?: Extract<Role, "learner" | "instructor"> }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsPending(true);
    window.dispatchEvent(new Event("lea-auth-loading"));

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(firebaseAuth, provider);
      const idToken = await credential.user.getIdToken();
      const response = await api.post<AuthResponse>("/auth/google", { idToken, role }, { auth: false });

      useAuthStore.getState().setAuth(response.token, response.user);
      toast.success(`Welcome to LEA, ${response.user.name.split(" ")[0]}!`);
      router.replace(ROLE_HOME[response.user.role]);
    } catch (error) {
      window.dispatchEvent(new Event("lea-auth-loading-stop"));
      const code = error instanceof Error && "code" in error ? String(error.code) : "";
      if (code === "auth/popup-closed-by-user") {
        toast.info("Google sign-in was cancelled.");
      } else {
        toast.error("Google sign-in could not be completed. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={isPending} className="h-10 w-full gap-2 rounded-full border-0 bg-[#f5f5f6] text-[11px] font-bold text-[#5d5d66] shadow-none hover:bg-[#ececef]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.14c1.84-1.7 2.91-4.2 2.91-7.29Z"/><path fill="#34A853" d="M12 21.75c2.62 0 4.82-.87 6.43-2.37L15.3 16.9c-.87.58-1.98.92-3.3.92-2.53 0-4.68-1.71-5.45-4.01H3.31v2.6A9.72 9.72 0 0 0 12 21.75Z"/><path fill="#FBBC05" d="M6.55 13.81a5.86 5.86 0 0 1 0-3.62v-2.6H3.31a9.75 9.75 0 0 0 0 8.82l3.24-2.6Z"/><path fill="#EA4335" d="M12 6.18c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.81 3.24 14.61 2.25 12 2.25a9.72 9.72 0 0 0-8.69 5.34l3.24 2.6C7.32 7.89 9.47 6.18 12 6.18Z"/></svg>
        {isPending ? "Connecting to Google…" : "Continue with Google"}
      </Button>
      <div className="flex items-center gap-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#b0b0b6] before:h-px before:flex-1 before:bg-[#e7e7eb] after:h-px after:flex-1 after:bg-[#e7e7eb]"><span>or use email</span></div>
    </>
  );
}
