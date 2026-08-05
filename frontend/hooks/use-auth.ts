"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth-store";
import { authService } from "@/services/auth";
import type {
  ForgotPasswordInput,
  LoginInput,
  ProfileSettingsInput,
  RegisterInput,
  ResetPasswordInput,
} from "@/types/auth";

const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

/** Login — stores the session on success. */
export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (res) => {
      useAuthStore.getState().setAuth(res.token, res.user);
    },
  });
}

/** Register — stores the session on success (email verification flow follows). */
export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (res) => {
      useAuthStore.getState().setAuth(res.token, res.user);
    },
  });
}

/** Logout — clears the local session after the server invalidates the token. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
    },
  });
}

/** Current user — cached for 5 minutes, refetched when the window refocuses. */
export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: () => authService.me(),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authService.forgotPassword(input),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authService.resetPassword(input),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileSettingsInput) => authService.updateProfile(input),
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      void queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
  });
}
