import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { APP_NAME } from "@/lib/constants";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#1f0d2e] px-5 py-10 text-white sm:px-10 lg:px-[7vw] lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr] md:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-14 items-center justify-center overflow-hidden bg-white p-1">
                <BrandMark className="h-full w-full" />
              </span>
              <span className="text-[11px] font-medium uppercase leading-[0.95] tracking-[0.2em] text-[#f6eef9]">LEA<br />Labs</span>
            </Link>
            <p className="mt-4 max-w-[260px] text-sm leading-6 text-[#d7c6df]">A practical learning ecosystem for people and teams building what comes next.</p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f7c2aa]">Explore</p>
            <div className="mt-3 space-y-2 text-sm text-[#f6eef9]">
              <Link className="block transition hover:text-[#f47945]" href="/">Home</Link>
              <Link className="block transition hover:text-[#f47945]" href="/#programmes">Programmes</Link>
              <Link className="block transition hover:text-[#f47945]" href="/about">About</Link>
              <Link className="block transition hover:text-[#f47945]" href="/corporate">Corporate Training</Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f7c2aa]">Connect</p>
            <div className="mt-3 space-y-2 text-sm text-[#f6eef9]">
              <Link className="block transition hover:text-[#f47945]" href="/register">Get started</Link>
              <Link className="block transition hover:text-[#f47945]" href="/login">Log in</Link>
              <Link className="block transition hover:text-[#f47945]" href="mailto:hello@lealabs.africa">Email LEA</Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f7c2aa]">Keep moving</p>
            <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#d7c6df]">Explore a programme, start a conversation, and take the next practical step.</p>
            <Link href="/register" className="mt-4 inline-flex items-center gap-2 border-b border-[#f47945] pb-1.5 text-xs font-medium text-white transition hover:text-[#f47945]">Start with LEA <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-[#bfa9c8] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <span>Learn. Explore. Achieve.</span>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
