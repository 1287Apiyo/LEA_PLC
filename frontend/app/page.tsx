import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, ROLE_COOKIE, ROLE_HOME } from "@/lib/constants";
import type { Role } from "@/types/auth";

/**
 * Entry point — routes users to their role home or the login page.
 * (The edge middleware doesn't cover "/", so this server component does.)
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === "1";
  const role = cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;

  if (isAuthed && role && role in ROLE_HOME) {
    redirect(ROLE_HOME[role]);
  }
  redirect("/login");
}
