import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1f0d2e] px-3 py-3 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
      <div className="relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1240px] overflow-hidden rounded-[26px] bg-white shadow-[0_30px_100px_rgba(39,18,100,0.35)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr] lg:rounded-[34px]">
        <AuthBrandPanel />

        <section className="relative flex min-h-[680px] flex-col bg-white lg:min-h-full">
          <header className="flex justify-end px-6 py-5 sm:px-10 sm:py-7">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#9b9ba3] transition-colors hover:text-[#17171d]">
              <ArrowLeft className="h-3.5 w-3.5" /> Back home
            </Link>
          </header>
          <main className="flex flex-1 items-center justify-center px-7 pb-14 pt-2 sm:px-14 lg:px-16 lg:pb-20">
            <div className="lea-anim-fade-up w-full max-w-[330px]" style={{ animationDelay: "0.08s" }}>
              {children}
            </div>
          </main>
        </section>
      </div>
      <AuthLoadingOverlay />
    </div>
  );
}
