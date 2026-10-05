import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing/landing-page";
import { AUTH_COOKIE, ROLE_COOKIE, ROLE_HOME } from "@/lib/constants";
import type { Role } from "@/types/auth";

export const metadata = {
  title: "Digital products, consulting and skills",
  description:
    "LEA Labs is a technology company building digital products, providing technology consulting, and delivering practical coding and digital skills programs for young learners and organisations.",
};

/**
 * Public landing page — the LEA Labs website. Visitors get the marketing page
 * with a login entry point; authenticated users are sent straight to their
 * role home. (The edge middleware doesn't cover "/", so this server component
 * does the auth check.)
 */
export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === "1";
  const role = cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;

  if (isAuthed && role && role in ROLE_HOME) {
    redirect(ROLE_HOME[role]);
  }

  return <LandingPage />;
}
