import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1f0d2e] px-5 py-8 text-white sm:px-10 lg:px-[7vw] lg:py-9">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f6eef9]">LEA Labs</p>
            <p className="mt-2 max-w-[260px] text-xs leading-6 text-[#d7c6df]">Practical learning for digital work.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#f6eef9]">
            <Link className="transition hover:text-[#f47945]" href="/">Home</Link>
            <Link className="transition hover:text-[#f47945]" href="/programmes/software-engineering">Programmes</Link>
            <Link className="transition hover:text-[#f47945]" href="/about">About</Link>
            <Link className="transition hover:text-[#f47945]" href="/corporate">Corporate Training</Link>
            <Link className="transition hover:text-[#f47945]" href="/login">Log in</Link>
            <Link className="font-semibold text-[#f47945] transition hover:text-[#ff8f57]" href="/register">Get started</Link>
          </nav>
          <Link className="text-xs text-[#d7c6df] transition hover:text-[#f47945]" href="mailto:hello@lealabs.africa">hello@lealabs.africa</Link>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-[#bfa9c8] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <span>Applewood Adams, 13th Floor</span>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
