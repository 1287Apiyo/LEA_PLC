"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { APP_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#programmes", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/corporate", label: "Corporate Training" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4def0]/90 bg-[#fcfbff]/90 backdrop-blur-xl">
      <div className="px-5 sm:px-10 lg:px-[7vw]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between">
        <Link href="/" className="-ml-2 inline-flex items-center gap-2.5 sm:-ml-3 lg:-ml-2" aria-label={`${APP_NAME} home`}>
          <BrandMark className="h-10 w-12" />
          <span className="text-[15px] font-black tracking-[0.16em] text-[#241b42]">LEA LABS</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-bold text-[#716981] transition hover:text-[#f47945]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-full bg-[#f47945] px-5 text-sm font-bold text-[#351039] shadow-[0_8px_18px_rgba(244,121,69,0.18)] transition hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47d43] focus-visible:ring-offset-2">
            Log in
          </Link>
          <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-full bg-[#4d176e] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(77,23,110,0.18)] transition hover:bg-[#653086] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47d43] focus-visible:ring-offset-2">
            Get started
          </Link>
        </div>

        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#f47945] transition hover:bg-[#fff0ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47d43] md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#e4def0] bg-[#fcfbff] px-5 pb-5 pt-3 shadow-lg md:hidden">
          <nav className="space-y-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-bold text-[#5d5470] transition hover:bg-[#fff0ea] hover:text-[#f47945]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#e4def0] pt-4">
            <Link href="/login" onClick={() => setOpen(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-[#f47945] px-5 text-sm font-bold text-[#351039] shadow-[0_8px_18px_rgba(244,121,69,0.16)] transition hover:bg-[#ff8f57]">
              Log in
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="inline-flex h-11 items-center justify-center rounded-full bg-[#4d176e] text-sm font-bold text-white transition hover:bg-[#653086]">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
