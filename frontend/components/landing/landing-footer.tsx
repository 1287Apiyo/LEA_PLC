import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1f0d2e] px-5 py-8 text-white sm:px-10 lg:px-[7vw] lg:py-9">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-2 text-xs leading-5 text-[#d7c6df]">
            <div className="inline-flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f47945]" strokeWidth={2} aria-hidden="true" /><span>Applewood Adams, 13th Floor</span></div>
            <a className="inline-flex items-center gap-2 transition hover:text-white" href="tel:0746821567"><Phone className="h-3.5 w-3.5 text-[#f47945]" strokeWidth={2} aria-hidden="true" />0746821567</a>
            <a className="inline-flex items-center gap-2 transition hover:text-white" href="mailto:leaorganizationke@gmail.com"><Mail className="h-3.5 w-3.5 text-[#f47945]" strokeWidth={2} aria-hidden="true" />leaorganizationke@gmail.com</a>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f6eef9]">LEA Labs</p>
              <p className="mt-2 text-xs leading-6 text-[#d7c6df]">Practical learning for digital work.</p>
            </div>
            <Link className="inline-flex items-center gap-2 self-start bg-[#f47945] px-5 py-3 text-xs font-semibold text-[#351039] transition hover:bg-white" href="/register">Get started <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-[#bfa9c8]">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
