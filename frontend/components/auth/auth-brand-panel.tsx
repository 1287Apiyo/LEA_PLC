import Image from "next/image";
import { BrandMark } from "@/components/shared/brand-mark";

export function AuthBrand({ compact = false }: { compact?: boolean }) {
  return <BrandMark className={compact ? "h-9 w-28" : "h-11 w-40"} />;
}

export function AuthBrandPanel() {
  return (
    <aside className="relative flex min-h-[480px] flex-col overflow-hidden bg-white px-7 py-7 text-[#17171d] sm:px-12 sm:py-10 lg:min-h-full lg:px-14 lg:py-12">
      <div className="relative z-10 flex items-center">
        <AuthBrand compact />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center py-10 sm:py-14">
        <div className="mb-3 max-w-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f15b3b]">Learn with purpose</p>
          <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-4xl lg:text-[3.25rem]">Make room for<br /><span className="text-[#f15b3b]">what&apos;s next.</span></h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6f6f78]">A calm space for focused learning, practical skills and the next idea you want to bring to life.</p>
        </div>

        <div className="relative mx-auto mt-2 w-full max-w-[520px]">
          <Image src="/lea-auth-illustration.png" alt="Learner studying at a laptop with learning cards" width={2304} height={1536} priority className="block h-auto w-full object-contain lea-auth-illustration" />
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-black/10 pt-4 text-[#22222a]"><p className="text-sm font-bold">Ideas look better in motion.</p><span className="text-[10px] font-semibold text-[#9999a1]">LEA LABS</span></div>
      </div>
    </aside>
  );
}
