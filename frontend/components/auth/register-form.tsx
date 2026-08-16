"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GraduationCap, ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api";
import type { Role } from "@/types/auth";
import { registerSchema, type RegisterFormValues } from "@/validation/auth";

const ROLE_OPTIONS: { value: Role; label: string; description: string; icon: typeof GraduationCap }[] = [
  { value: "learner", label: "Learner", description: "I'm here to learn and grow", icon: GraduationCap },
  { value: "instructor", label: "Instructor", description: "I teach classes and grade work", icon: UserCog },
  { value: "administrator", label: "Administrator", description: "I run the platform behind the scenes", icon: ShieldCheck },
];

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", password_confirmation: "", role: "learner" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register.mutate(values, {
      onSuccess: (res) => {
        toast.success("Account created — welcome to LEA Labs!");
        router.replace(ROLE_HOME[res.user.role]);
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Registration failed. Please try again."
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Role picker */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a…</FormLabel>
              <FormControl>
                <div role="radiogroup" aria-label="Role" className="space-y-2">
                  {ROLE_OPTIONS.map((option) => {
                    const selected = field.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-colors",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40 hover:bg-muted/40"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                            selected ? "border-primary" : "border-input"
                          )}
                        >
                          {selected ? (
                            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center",
                            selected ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          <option.icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              selected ? "text-primary" : "text-foreground"
                            )}
                          >
                            {option.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>Minimum 8 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
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
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
