import { api } from "@/lib/api-client";
import type {
  AuthResponse,
  ForgotPasswordInput,
  LoginInput,
  ProfileSettingsInput,
  RegisterInput,
  ResetPasswordInput,
  User,
  VerifyEmailInput,
} from "@/types/auth";

/** Auth API service — one typed function per backend endpoint. */
export const authService = {
  login: (input: LoginInput) => api.post<AuthResponse>("/auth/login", input),
  register: (input: RegisterInput) => api.post<AuthResponse>("/auth/register", input),
  logout: () => api.post<void>("/auth/logout"),
  me: () => api.get<User>("/auth/me"),
  forgotPassword: (input: ForgotPasswordInput) =>
    api.post<void>("/auth/forgot-password", input),
  resetPassword: (input: ResetPasswordInput) =>
    api.post<void>("/auth/reset-password", input),
  verifyEmail: (input: VerifyEmailInput) =>
    api.post<void>("/auth/email/verify", input),
  resendVerification: () => api.post<void>("/auth/email/resend"),
  updateProfile: (input: ProfileSettingsInput) =>
    api.put<User>("/auth/profile", input),
};
