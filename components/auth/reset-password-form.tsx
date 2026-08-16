"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/use-auth";
import { ApiError } from "@/types/api";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/validation/auth";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const reset = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, token, password: "", password_confirmation: "" },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    reset.mutate(values, {
      onSuccess: () => {
        toast.success("Password updated — you can now sign in.");
        router.replace("/login");
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Could not reset your password. Please try again."
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={reset.isPending}>
          {reset.isPending ? "Updating…" : "Reset password"}
        </Button>
      </form>
    </Form>
  );
}
