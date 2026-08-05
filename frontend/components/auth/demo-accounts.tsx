"use client";

import { GraduationCap, ShieldCheck, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/constants";
import type { Role } from "@/types/auth";

const MOCK_ENABLED = process.env.NEXT_PUBLIC_API_MOCK === "true";

const DEMO_ACCOUNTS: { role: Role; email: string; label: string; icon: typeof ShieldCheck }[] = [
  { role: "administrator", email: "admin@lealabs.test", label: "Administrator", icon: ShieldCheck },
  { role: "instructor", email: "teacher@lealabs.test", label: "Instructor", icon: UserCog },
  { role: "learner", email: "learner@lealabs.test", label: "Learner", icon: GraduationCap },
];

/**
 * One-click demo sign-ins — visible only when the mock API is enabled.
 * Lets you explore the full role-based experience without a backend.
 */
export function DemoAccounts() {
  const router = useRouter();
  const login = useLogin();

  if (!MOCK_ENABLED) return null;

  const signInAs = (role: Role, email: string) => {
    login.mutate(
      { email, password: "lealabs-demo" },
      {
        onSuccess: (res) => {
          toast.success(`Signed in as ${res.user.name}.`);
          router.replace(ROLE_HOME[role]);
        },
        onError: () => toast.error("Could not sign in with demo account."),
      }
    );
  };

  return (
    <div className="mt-4 rounded-lg border border-dashed p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Demo mode — no backend required
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        One-click sign in to explore the platform:
      </p>
      <div className="mt-3 grid gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <Button
            key={account.role}
            type="button"
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            disabled={login.isPending}
            onClick={() => signInAs(account.role, account.email)}
          >
            <account.icon className="h-4 w-4" aria-hidden />
            {account.label}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Or type any email + a password of 8+ characters. Role is inferred from
        the email prefix (admin@ / teacher@ → otherwise learner).
      </p>
    </div>
  );
}
