"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { APP_NAME } from "@/lib/constants";
import { PROGRAMMES } from "@/lib/programmes";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#programmes", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/corporate", label: "Corporate Training" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [expandedProgramme, setExpandedProgramme] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbff]/90 backdrop-blur-xl">
      <div className="px-5 sm:px-10 lg:px-[7vw]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between">
       <Link href="/" className="inline-flex items-center" aria-label={`${APP_NAME} home`}>
  <BrandMark className="h-20 w-20" />
</Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => link.label === "Programs" ? (
            <div key={link.href} className="group relative">
              <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-[#716981] transition hover:text-[#f47945] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-4">
                Programs <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
              </button>
              <div className="pointer-events-none absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                <div className="w-80 overflow-hidden rounded-2xl border border-[#4d176e]/10 bg-white p-2 shadow-[0_18px_45px_rgba(77,23,110,.16)]">
                  {PROGRAMMES.map((programme) => {
                    const isExpanded = expandedProgramme === programme.slug;
                    return <div key={programme.slug} className="rounded-xl transition hover:bg-[#fffaf7]">
                      <div className="flex items-center gap-2">
                        <Link href={`/programmes/${programme.slug}`} className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[#351039] transition hover:text-[#f47945]">{programme.title}</Link>
                        <button type="button" onClick={() => setExpandedProgramme(isExpanded ? null : programme.slug)} className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#4d176e] transition hover:bg-[#fff0ea]" aria-label={`${isExpanded ? "Hide" : "Show"} ${programme.title} courses`} aria-expanded={isExpanded}><ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} /></button>
                      </div>
                      {isExpanded && <div className="mb-2 ml-4 mr-3 space-y-1 border-l border-[#f47945]/35 pl-3">{programme.modules.map((module) => <Link key={module.number} href={`/programmes/${programme.slug}#modules`} className="block rounded-lg px-2 py-2 text-xs font-semibold text-[#6e6072] transition hover:bg-[#fff0ea] hover:text-[#4d176e]">{module.title}</Link>)}</div>}
                    </div>;
                  })}
                </div>
              </div>
            </div>
          ) : (
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
        <div className="bg-[#fcfbff] px-5 pb-5 pt-3 shadow-lg md:hidden">
          <nav className="space-y-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => link.label === "Programs" ? (
              <div key={link.href} className="rounded-xl bg-[#fffaf7] px-3 py-2">
                <p className="px-0 py-2 text-sm font-bold text-[#4d176e]">Programs</p>
                <div className="space-y-1 border-l border-[#f47945]/35 pl-3">
                  {PROGRAMMES.map((programme) => {
                    const isExpanded = expandedProgramme === programme.slug;
                    return <div key={programme.slug}>
                      <div className="flex items-center gap-1">
                        <Link href={`/programmes/${programme.slug}`} onClick={() => setOpen(false)} className="min-w-0 flex-1 rounded-lg px-2 py-2 text-xs font-semibold text-[#5d5470] transition hover:bg-[#fff0ea] hover:text-[#f47945]">{programme.title}</Link>
                        <button type="button" onClick={() => setExpandedProgramme(isExpanded ? null : programme.slug)} className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#4d176e]" aria-label={`${isExpanded ? "Hide" : "Show"} ${programme.title} courses`} aria-expanded={isExpanded}><ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} /></button>
                      </div>
                      {isExpanded && <div className="mb-1 ml-2 space-y-1 border-l border-[#f47945]/35 pl-3">{programme.modules.map((module) => <Link key={module.number} href={`/programmes/${programme.slug}#modules`} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#6e6072] transition hover:bg-[#fff0ea] hover:text-[#4d176e]">{module.title}</Link>)}</div>}
                    </div>;
                  })}
                </div>
              </div>
            ) : (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-bold text-[#5d5470] transition hover:bg-[#fff0ea] hover:text-[#f47945]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 pt-4">
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
