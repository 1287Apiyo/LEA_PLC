import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/types/auth";
import { AUTH_COOKIE, ROLE_COOKIE } from "@/lib/constants";

/**
 * Auth store — single source of truth for the session on the client.
 *
 * - Persisted to localStorage (survives reloads) — token is used by the API client.
 * - Mirrors a coarse-grained cookie pair for edge-middleware guards.
 */
interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function syncSessionCookies(user: User | null) {
  if (typeof window === "undefined") return;
  const maxAge = user ? SESSION_MAX_AGE : 0;
  document.cookie = `${AUTH_COOKIE}=${user ? "1" : ""}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=${user?.role ?? ""}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        syncSessionCookies(user);
        set({ token, user });
      },
      setUser: (user) => {
        syncSessionCookies(user);
        set({ user });
      },
      clearAuth: () => {
        syncSessionCookies(null);
        set({ token: null, user: null });
      },
    }),
    {
      name: "lea-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

/** Selector hook returning whether a session exists (avoids re-renders on user updates). */
export const useIsAuthenticated = () => useAuthStore((s) => Boolean(s.token));
