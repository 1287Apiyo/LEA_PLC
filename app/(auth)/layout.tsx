import { AuthBrand, AuthBrandPanel } from "@/components/auth/auth-brand-panel";

/**
 * Split-screen auth layout:
 *  - Desktop: purple LEA Labs brand panel (illustration + tagline) beside the form.
 *  - Mobile: compact brand header above the form.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      <AuthBrandPanel />

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        {/* Mobile brand header */}
        <div className="lea-anim-fade-up mb-6 flex lg:hidden">
          <AuthBrand />
        </div>

        <div className="lea-anim-fade-up w-full max-w-md" style={{ animationDelay: "0.08s" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
