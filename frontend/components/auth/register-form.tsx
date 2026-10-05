"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { GraduationCap, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleAuthOption } from "@/components/auth/google-auth-option";
import { useRegister } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api";
import type { Role } from "@/types/auth";
import { registerSchema, type RegisterFormValues } from "@/validation/auth";

const ROLE_OPTIONS: { value: Role; label: string; description: string; icon: typeof GraduationCap }[] = [
  { value: "learner", label: "Learner", description: "Build skills at your own pace", icon: GraduationCap },
  { value: "instructor", label: "Instructor", description: "Guide learners and share knowledge", icon: UserCog },
];

const inputClass = "mt-1 h-9 rounded-none border-0 border-b border-[#d2d2d7] bg-transparent px-0 text-xs shadow-none placeholder:text-[#b6b6bc] focus-visible:border-[#17171d] focus-visible:ring-0";

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", password: "", password_confirmation: "", role: "learner" } });
  const onSubmit = (values: RegisterFormValues) => {
    window.dispatchEvent(new Event("lea-auth-loading"));
    return register.mutate(values, {
    onSuccess: (res) => { toast.success("Account created — welcome to LEA Labs!"); router.replace(ROLE_HOME[res.user.role]); },
    onError: (error) => {
      window.dispatchEvent(new Event("lea-auth-loading-stop"));
      toast.error(error instanceof ApiError ? error.message : "Registration failed. Please try again.");
    },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GoogleAuthOption role={form.watch("role")} />
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem><FormLabel className="text-[13px] font-bold text-[#343b50]">I want to join as a</FormLabel><FormControl><div role="radiogroup" className="mt-1 grid gap-3 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => { const selected = field.value === option.value; return <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => field.onChange(option.value)} className={cn("flex items-start gap-3 rounded-xl border p-3 text-left transition-all", selected ? "border-[#f15b3b] bg-[#fff6f2] shadow-[0_5px_16px_rgba(241,91,59,0.08)]" : "border-[#dfe3eb] bg-[#fbfcfe] hover:border-[#f15b3b]/50")}><span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", selected ? "bg-[#f15b3b] text-white" : "bg-[#eef0f5] text-[#71798b]")}><option.icon className="h-4 w-4" /></span><span><span className={cn("block text-sm font-bold", selected ? "text-[#21173c]" : "text-[#343b50]")}>{option.label}</span><span className="mt-0.5 block text-[11px] leading-4 text-[#8a92a2]">{option.description}</span></span></button>; })}
          </div></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel className="text-[13px] font-bold text-[#343b50]">Full name</FormLabel><FormControl><Input placeholder="Jane Doe" autoComplete="name" className={inputClass} {...field} /></FormControl><FormMessage /></FormItem>} />
          <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel className="text-[13px] font-bold text-[#343b50]">Email address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...field} /></FormControl><FormMessage /></FormItem>} />
        </div>
        <FormField control={form.control} name="password" render={({ field }) => <FormItem><FormLabel className="text-[13px] font-bold text-[#343b50]">Password</FormLabel><FormControl><Input type="password" placeholder="At least 8 characters" autoComplete="new-password" className={inputClass} {...field} /></FormControl><FormDescription className="text-xs text-[#8a92a2]">Use at least 8 characters.</FormDescription><FormMessage /></FormItem>} />
        <FormField control={form.control} name="password_confirmation" render={({ field }) => <FormItem><FormLabel className="text-[13px] font-bold text-[#343b50]">Confirm password</FormLabel><FormControl><Input type="password" placeholder="Repeat your password" autoComplete="new-password" className={inputClass} {...field} /></FormControl><FormMessage /></FormItem>} />
        <Button type="submit" className="h-11 w-full rounded-full bg-[#17171d] text-xs font-bold shadow-none hover:bg-[#6334f3]" disabled={register.isPending}>{register.isPending ? "Creating your account…" : "Create account"}</Button>
        <p className="text-center text-[11px] leading-5 text-[#8a92a2]">By creating an account, you agree to use LEA responsibly and respectfully.</p>
      </form>
    </Form>
  );
}
