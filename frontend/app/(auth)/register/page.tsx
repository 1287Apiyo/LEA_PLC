import Link from "next/link";
import { AuthBrand } from "@/components/auth/auth-brand-panel";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-7 flex justify-center"><AuthBrand compact /></div>
      <div className="mb-6 text-center"><h1 className="text-[27px] font-semibold tracking-[-0.05em] text-[#17171d]">Create your account</h1><p className="mt-2 text-xs text-[#a0a0a7]">Start learning with LEA</p></div>
      <RegisterForm />
      <p className="mt-7 text-center text-[11px] text-[#a0a0a7]">Already have an account? <Link href="/login" className="font-semibold text-[#17171d] hover:text-[#f15b3b]">Log in</Link></p>
    </div>
  );
}
