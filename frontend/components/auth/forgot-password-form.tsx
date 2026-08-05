"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForgotPassword } from "@/hooks/use-auth";
import { ApiError } from "@/types/api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/validation/auth";

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgot.mutate(values, {
      onSuccess: () => {
        toast.success("Reset link sent — check your inbox.");
      },
      onError: (error) => {
        // Deliberately generic: never reveal whether an email exists.
        toast.error(
          error instanceof ApiError
            ? "If that account exists, a reset link has been sent."
            : "Something went wrong. Please try again."
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={forgot.isPending}>
          {forgot.isPending ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </Form>
  );
}
