import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Handshake,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata: Metadata = {
  title: "LEA Labs | Start here",
  description:
    "Explore LEA Labs programmes, learning opportunities, corporate training, and practical digital skills.",
};

const links = [
  {
    href: "/#programmes",
    label: "See all programmes",
    description: "Practical pathways in software, AI, and digital foundations.",
    icon: BookOpen,
    featured: true,
  },
  {
    href: "/register",
    label: "Register for learning",
    description: "Create your account and take your next step.",
    icon: Sparkles,
  },
  {
    href: "/corporate",
    label: "Partner with LEA",
    description: "Build digital capability across your organisation.",
    icon: Handshake,
  },
  {
    href: "/about",
    label: "Meet LEA Labs",
    description: "Our story, mission, and approach to practical learning.",
    icon: GraduationCap,
  },
  {
    href: "mailto:lealabsplc@gmail.com",
    label: "Talk to the LEA team",
    description: "Questions, partnerships, or help choosing a pathway?",
    icon: MessageCircle,
  },
];

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M15.5 3c.26 1.75 1.24 2.98 3 3.55v2.74a8.5 8.5 0 0 1-3-.92v5.57a5.3 5.3 0 1 1-4.58-5.24v2.88a2.5 2.5 0 1 0 1.58 2.36V3h3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f2] px-5 py-8 text-[#26142f] sm:px-8 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#f47945]/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#4d176e]/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
        <Link href="/" aria-label="LEA Labs home" className="rounded-xl bg-white p-2 shadow-[0_12px_35px_rgba(77,23,110,0.12)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945]">
          <BrandMark className="h-24 w-64 max-w-[78vw] sm:h-28 sm:w-72" />
        </Link>

        <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.24em] text-[#4d176e]">Learn · Explore · Achieve</p>
        <h1 className="mt-3 text-center text-2xl font-semibold tracking-[-0.04em] text-[#26142f] sm:text-3xl">Your next move starts here.</h1>
        <p className="mt-3 max-w-md text-center text-sm leading-6 text-[#6e6072]">Practical digital learning, human guidance, and opportunities to build work that matters.</p>

        <div className="mt-8 flex w-full flex-col gap-3">
          {links.map(({ href, label, description, icon: Icon, featured }) => (
            <Link
              key={label}
              href={href}
              className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 shadow-[0_8px_24px_rgba(77,23,110,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(77,23,110,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] ${featured ? "border-[#f47945] bg-[#f47945] text-[#351039]" : "border-[#eadcf0] bg-white text-[#26142f]"}`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${featured ? "text-[#351039]" : "text-[#4d176e]"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{label}</span>
                <span className={`mt-1 block text-xs leading-5 ${featured ? "text-[#351039]/75" : "text-[#6e6072]"}`}>{description}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="mt-8 grid w-full grid-cols-2 gap-3">
          <a href="tel:0729929101" className="flex items-center justify-center gap-2 rounded-xl border border-[#eadcf0] bg-white px-3 py-3 text-xs font-semibold text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Call us
          </a>
          <a href="mailto:lealabsplc@gmail.com" className="flex items-center justify-center gap-2 rounded-xl border border-[#eadcf0] bg-white px-3 py-3 text-xs font-semibold text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">
            <Mail className="h-4 w-4" aria-hidden="true" /> Email us
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-[#6e6072]">
          <a href="https://www.tiktok.com/@lea_labs_?_r=1&_t=ZS-99X7MP9krsj" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-[#4d176e]"><TikTokIcon /> TikTok</a>
          <a href="https://www.instagram.com/lea_labs_?stkn=ajRmdmk3NXhnN" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-[#4d176e]"><InstagramIcon /> Instagram</a>
          <Link href="/#site-tour" className="inline-flex items-center gap-1.5 transition hover:text-[#4d176e]"><Briefcase className="h-4 w-4" /> See the LEA experience</Link>
        </div>

        <p className="mt-8 inline-flex items-center gap-1.5 text-center text-[11px] text-[#8b7891]"><MapPin className="h-3.5 w-3.5 text-[#f47945]" /> Applewood Adams, 13th Floor · Nairobi</p>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#b29cad]">LEA Labs PLC · Practical learning for digital work</p>
      </div>
    </main>
  );
}

export const dynamic = "force-static";
