import Link from "next/link";
import { Suspense } from "react";
import { AuthBrand } from "@/components/auth/auth-brand-panel";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <div className="mb-9 flex justify-center"><AuthBrand compact /></div>
      <div className="mb-7 text-center"><h1 className="text-[27px] font-semibold tracking-[-0.05em] text-[#17171d]">Welcome back!</h1><p className="mt-2 text-xs text-[#a0a0a7]">Please enter your details</p></div>
      <Suspense><LoginForm /></Suspense>
      <p className="mt-8 text-center text-[11px] text-[#a0a0a7]">Don&apos;t have an account? <Link href="/register" className="font-semibold text-[#17171d] hover:text-[#f15b3b]">Sign up</Link></p>
    </div>
  );
}
