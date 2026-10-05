"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleAuthOption } from "@/components/auth/google-auth-option";
import { useLogin } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/constants";
import { ApiError } from "@/types/api";
import { loginSchema, type LoginFormValues } from "@/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = (values: LoginFormValues) => {
    window.dispatchEvent(new Event("lea-auth-loading"));
    login.mutate(values, {
      onSuccess: (res) => {
        toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
        const next = searchParams.get("next");
        router.replace(next && next.startsWith("/") ? next : ROLE_HOME[res.user.role]);
      },
      onError: (error) => {
        window.dispatchEvent(new Event("lea-auth-loading-stop"));
        toast.error(error instanceof ApiError ? error.message : "Login failed. Please try again.");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <GoogleAuthOption />
        <div className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-semibold text-[#777780]">Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" autoComplete="email" className="mt-1 h-9 rounded-none border-0 border-b border-[#d2d2d7] bg-transparent px-0 text-xs shadow-none placeholder:text-[#b6b6bc] focus-visible:border-[#17171d] focus-visible:ring-0" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between"><FormLabel className="text-[10px] font-semibold text-[#777780]">Password</FormLabel><Link href="/forgot-password" className="text-[10px] font-medium text-[#b0b0b6] hover:text-[#17171d]">Forgot password?</Link></div>
              <FormControl><Input type="password" placeholder="••••••••" autoComplete="current-password" className="mt-1 h-9 rounded-none border-0 border-b border-[#d2d2d7] bg-transparent px-0 text-xs shadow-none placeholder:text-[#b6b6bc] focus-visible:border-[#17171d] focus-visible:ring-0" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="remember" render={({ field }) => (
          <FormItem className="flex items-center gap-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} aria-label="Remember me" className="h-3 w-3 rounded-[3px] border-[#c9c9cf] data-[state=checked]:border-[#17171d] data-[state=checked]:bg-[#17171d]" /></FormControl><FormLabel className="text-[10px] font-medium text-[#9999a1]">Remember for 30 days</FormLabel></FormItem>
        )} />
        <Button type="submit" className="h-11 w-full rounded-full bg-[#17171d] text-xs font-bold shadow-none hover:bg-[#6334f3]" disabled={login.isPending}>{login.isPending ? "Signing you in…" : "Log in"}</Button>
      </form>
    </Form>
  );
}
