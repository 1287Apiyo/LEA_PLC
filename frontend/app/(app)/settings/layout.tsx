import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shared/app-shell";
import { AUTH_COOKIE, ROLE_COOKIE } from "@/lib/constants";
import type { Role } from "@/types/auth";

/** Settings shell — open to any authenticated role. */
export default async function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === "1";
  const role = cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;

  if (!isAuthed || !role) {
    redirect("/login");
  }

  return <AppShell role={role}>{children}</AppShell>;
}
