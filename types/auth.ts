/** Auth domain types — mirror the Laravel Sanctum + RBAC contract. */

export type Role = "administrator" | "instructor" | "learner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: Role;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailInput {
  /** Signed verification URL id + hash, or token, depending on backend contract. */
  id: string;
  hash: string;
}

export interface ProfileSettingsInput {
  name: string;
  email: string;
  avatar_url?: string | null;
}
