import { z } from "zod";

/** Auth validation schemas — shared with React Hook Form via resolvers. */

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export const profileSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  avatar_url: z.string().url().nullable().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
