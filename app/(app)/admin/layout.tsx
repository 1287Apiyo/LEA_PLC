import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shared/app-shell";
import { AUTH_COOKIE, ROLE_COOKIE } from "@/lib/constants";

/** Administrator shell — server-side backstop guard + role-aware layout. */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === "1";
  const role = cookieStore.get(ROLE_COOKIE)?.value;

  if (!isAuthed || role !== "administrator") {
    redirect("/login");
  }

  return <AppShell role="administrator">{children}</AppShell>;
}
