import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shared/app-shell";
import { AUTH_COOKIE, ROLE_COOKIE } from "@/lib/constants";

/** Instructor shell — server-side backstop guard + role-aware layout. */
export default async function InstructorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === "1";
  const role = cookieStore.get(ROLE_COOKIE)?.value;

  if (!isAuthed || role !== "instructor") {
    redirect("/login");
  }

  return <AppShell role="instructor">{children}</AppShell>;
}
