import { delay, http, HttpResponse } from "msw";
import type { Role, User } from "@/types/auth";
import type { AppNotification, NotificationList } from "@/services/notifications";
import {
  ADMIN_DASHBOARD,
  INSTRUCTOR_DASHBOARD,
  LEARNER_DASHBOARD,
} from "@/mocks/dashboard-data";
import { DB, listResource, RESOURCE_KEYS, type ResourceKey, type Row } from "@/mocks/data";

/**
 * Dev-mode mock API â€” active only when NEXT_PUBLIC_API_MOCK=true.
 *
 * Mirrors the Laravel /api/v1 contract so the frontend runs standalone.
 * Flip the env var off and the identical code talks to the real backend.
 */

const NOW = new Date().toISOString();

const DEMO_USERS: Record<Role, User> = {
  administrator: {
    id: "usr-admin-0001",
    name: "Amani Administrator",
    email: "admin@lealabs.test",
    role: "administrator",
    avatar_url: null,
    email_verified_at: NOW,
    created_at: NOW,
  },
  instructor: {
    id: "usr-inst-0001",
    name: "Grace Instructor",
    email: "teacher@lealabs.test",
    role: "instructor",
    avatar_url: null,
    email_verified_at: NOW,
    created_at: NOW,
  },
  learner: {
    id: "usr-learn-0001",
    name: "John Learner",
    email: "learner@lealabs.test",
    role: "learner",
    avatar_url: null,
    email_verified_at: NOW,
    created_at: NOW,
  },
};

/** token â†’ user, kept in memory so /auth/me returns the session user. */
const sessions = new Map<string, User>();

function roleForEmail(email: string): Role {
  const normalized = email.toLowerCase();
  if (normalized.startsWith("admin")) return "administrator";
  if (
    normalized.startsWith("teacher") ||
    normalized.startsWith("instructor") ||
    normalized.startsWith("trainer")
  ) {
    return "instructor";
  }
  return "learner";
}

function bearerRole(request: Request): Role {
  const auth = request.headers.get("Authorization") ?? "";
  const match = auth.match(/mock-token-(administrator|instructor|learner)/);
  return (match?.[1] as Role) ?? "learner";
}

const NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-0001",
    type: "class",
    title: "Today's classes start at 9:00",
    body: "You have 3 classes scheduled today: Digital Literacy (09:00), Coding Basics (11:00) and Corporate Onboarding (14:00).",
    read_at: null,
    created_at: NOW,
  },
  {
    id: "ntf-0002",
    type: "payment",
    title: "Payment received",
    body: "M-Pesa payment of KSh 4,500 confirmed for learner enrolment #ENR-1024.",
    read_at: null,
    created_at: NOW,
  },
  {
    id: "ntf-0003",
    type: "system",
    title: "Welcome to LEA Labs",
    body: "Your workspace is ready. Explore your dashboard to get started.",
    read_at: NOW,
    created_at: NOW,
  },
];

export const handlers = [
  // â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password || body.password.length < 8) {
      return HttpResponse.json(
        {
          message: "The given data was invalid.",
          errors: {
            email: body.email ? [] : ["Email is required."],
            password:
              !body.password || body.password.length < 8
                ? ["Password must be at least 8 characters."]
                : [],
          },
        },
        { status: 422 }
      );
    }
    await delay(500);
    const role = roleForEmail(body.email);
    const user = { ...DEMO_USERS[role], email: body.email.toLowerCase() };
    const token = `mock-token-${role}-${Date.now()}`;
    sessions.set(token, user);
    return HttpResponse.json({ token, user });
  }),

  http.post("/api/v1/auth/register", async ({ request }) => {
    const body = (await request.json()) as { name?: string; email?: string };
    await delay(500);
    const role = roleForEmail(body.email ?? "");
    const user = {
      ...DEMO_USERS[role],
      name: body.name?.trim() || DEMO_USERS[role].name,
      email: (body.email ?? DEMO_USERS[role].email).toLowerCase(),
    };
    const token = `mock-token-${role}-${Date.now()}`;
    sessions.set(token, user);
    return HttpResponse.json({ token, user });
  }),

  http.post("/api/v1/auth/logout", () =>
    HttpResponse.json({ message: "Logged out." })
  ),

  http.get("/api/v1/auth/me", ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    const user = sessions.get(token) ?? DEMO_USERS[bearerRole(request)];
    return HttpResponse.json(user);
  }),

  http.post("/api/v1/auth/forgot-password", () =>
    HttpResponse.json({ message: "If that account exists, a reset link has been sent." })
  ),

  http.post("/api/v1/auth/reset-password", () =>
    HttpResponse.json({ message: "Your password has been reset." })
  ),

  http.post("/api/v1/auth/email/verify", () =>
    HttpResponse.json({ message: "Email verified." })
  ),

  http.post("/api/v1/auth/email/resend", () =>
    HttpResponse.json({ message: "Verification email sent." })
  ),

  http.put("/api/v1/auth/profile", async ({ request }) => {
    const body = (await request.json()) as Partial<User>;
    const user = { ...DEMO_USERS[bearerRole(request)], ...body };
    return HttpResponse.json(user);
  }),

  // â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  http.get("/api/v1/notifications", () => {
    const list: NotificationList = {
      data: NOTIFICATIONS,
      unread_count: NOTIFICATIONS.filter((n) => !n.read_at).length,
    };
    return HttpResponse.json(list);
  }),

  http.post("/api/v1/notifications/:id/read", () =>
    HttpResponse.json({ message: "Marked as read." })
  ),

  http.post("/api/v1/notifications/read-all", () =>
    HttpResponse.json({ message: "All notifications marked as read." })
  ),

  // â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  http.get("/api/v1/dashboard/admin", () =>
    HttpResponse.json(ADMIN_DASHBOARD)
  ),

  http.get("/api/v1/dashboard/instructor", () =>
    HttpResponse.json(INSTRUCTOR_DASHBOARD)
  ),

  http.get("/api/v1/dashboard/learner", () =>
    HttpResponse.json(LEARNER_DASHBOARD)
  ),

  // â”€â”€ Generic resources (registered last) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GET /api/v1/:resource?search=&sort=&order=&page=&per_page=
  http.get("/api/v1/:resource", ({ request, params }) => {
    const resource = params.resource as string;
    if (!RESOURCE_KEYS.includes(resource as ResourceKey)) {
      return HttpResponse.json({ message: "Resource not found." }, { status: 404 });
    }
    const url = new URL(request.url);
    const result = listResource(resource as ResourceKey, {
      search: url.searchParams.get("search") ?? undefined,
      sort: url.searchParams.get("sort"),
      order: (url.searchParams.get("order") as "asc" | "desc" | null) ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      per_page: Number(url.searchParams.get("per_page") ?? 10),
    });
    return HttpResponse.json(result);
  }),

  // GET /api/v1/:resource/:id
  http.get("/api/v1/:resource/:id", ({ params }) => {
    const { resource, id } = params as { resource: string; id: string };
    if (!RESOURCE_KEYS.includes(resource as ResourceKey)) {
      return HttpResponse.json({ message: "Resource not found." }, { status: 404 });
    }
    const row = DB[resource as ResourceKey].find((entry) => entry.id === id);
    if (!row) {
      return HttpResponse.json({ message: "Record not found." }, { status: 404 });
    }
    return HttpResponse.json({ data: row });
  }),

  // POST /api/v1/:resource â€” create
  http.post("/api/v1/:resource", async ({ request, params }) => {
    const resource = params.resource as string;
    if (!RESOURCE_KEYS.includes(resource as ResourceKey)) {
      return HttpResponse.json({ message: "Resource not found." }, { status: 404 });
    }
    const body = (await request.json()) as Row;
    const prefix = (resource.slice(0, 3) + "-").toUpperCase();
    const row: Row = {
      id: `${prefix}${Math.floor(1000 + Math.random() * 9000)}`,
      ...body,
      created_at: new Date().toISOString(),
    };
    DB[resource as ResourceKey].unshift(row);
    return HttpResponse.json({ data: row }, { status: 201 });
  }),

  // PATCH /api/v1/:resource/:id â€” update
  http.patch("/api/v1/:resource/:id", async ({ request, params }) => {
    const { resource, id } = params as { resource: string; id: string };
    const rows = DB[resource as ResourceKey];
    if (!rows) {
      return HttpResponse.json({ message: "Resource not found." }, { status: 404 });
    }
    const index = rows.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Record not found." }, { status: 404 });
    }
    const body = (await request.json()) as Row;
    rows[index] = { ...rows[index], ...body, id };
    return HttpResponse.json({ data: rows[index] });
  }),

  // DELETE /api/v1/:resource/:id â€” delete
  http.delete("/api/v1/:resource/:id", ({ params }) => {
    const { resource, id } = params as { resource: string; id: string };
    const rows = DB[resource as ResourceKey];
    if (!rows) {
      return HttpResponse.json({ message: "Resource not found." }, { status: 404 });
    }
    const index = rows.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Record not found." }, { status: 404 });
    }
    rows.splice(index, 1);
    return HttpResponse.json({ message: "Record deleted." });
  }),
];

