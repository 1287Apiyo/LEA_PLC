import type { Role } from "@/types/auth";

export const APP_NAME = "LEA Labs";

export const ROLE_LABELS: Record<Role, string> = {
  administrator: "Administrator",
  instructor: "Instructor",
  learner: "Learner",
};

/** Home route per role — used by guards and post-login redirects. */
export const ROLE_HOME: Record<Role, string> = {
  administrator: "/admin",
  instructor: "/instructor",
  learner: "/learner",
};

/** Routes a role may access under the protected shell (prefixes). */
export const ROLE_ROUTES: Record<Role, string[]> = {
  administrator: ["/admin"],
  instructor: ["/instructor"],
  learner: ["/learner"],
};

/** Cookie names used by the edge middleware for coarse-grained guards. */
export const AUTH_COOKIE = "lea_auth";
export const ROLE_COOKIE = "lea_role";
