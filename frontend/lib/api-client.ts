import { useAuthStore } from "@/lib/auth-store";
import { ApiError, type ApiErrorBody } from "@/types/api";

/**
 * Typed API client — the only place the frontend talks to the backend.
 *
 * - Base URL from NEXT_PUBLIC_API_URL (Vercel deploy-time env).
 * - Injects the Sanctum bearer token from the auth store.
 * - Normalizes errors into ApiError, handles 401 by clearing the session
 *   and redirecting to /login (single silent bounce).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable body — automatically stringified and content-typed. */
  body?: unknown;
  /** Whether to attach the bearer token. Default true. */
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers: extraHeaders, ...rest } = options;

  const headers = new Headers(extraHeaders);
  headers.set("Accept", "application/json");
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token = useAuthStore.getState().token;
  if (auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
      undefined
    );
  }

  if (!response.ok) {
    let payload: ApiErrorBody | undefined;
    try {
      payload = (await response.json()) as ApiErrorBody;
    } catch {
      // Non-JSON error body — fall through with status message.
    }

    if (response.status === 401 && auth) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload?.errors
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

/** Builds a query string from ListParams (page, search, sort, filters…). */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "object") {
      for (const [fk, fv] of Object.entries(value as Record<string, unknown>)) {
        if (fv !== undefined && fv !== null && fv !== "") {
          searchParams.set(`filter[${fk}]`, String(fv));
        }
      }
    } else {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}
