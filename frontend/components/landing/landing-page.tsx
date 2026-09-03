"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Clock3,
  Play,
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { TestimonialsRotator } from "@/components/landing/testimonials-rotator";
import { APP_NAME } from "@/lib/constants";
import { PROGRAMMES as programmes } from "@/lib/programmes";

const HERO_IMAGE = "/lea-home-hero-teen-v2.png";
const MENTOR_IMAGE = "/lea-community-dashboard.png";
const COMMUNITY_IMAGE = "/lea-home-community.png";

const PROGRAMME_CARD_IMAGES: Record<string, string> = {
  "software-engineering": "/lea-home-program-software.png",
  "applied-ai": "/lea-home-program-ai.png",
  "basic-computer-knowledge": "/lea-home-program-computers.png",
};



const steps = [
  ["01", "Orient", "Understand the field, your goals, and a starting point that makes sense."],
  ["02", "Practise", "Turn concepts into working habits through projects and focused challenge."],
  ["03", "Refine", "Use peer and mentor feedback to improve how you approach the work."],
  ["04", "Advance", "Leave with a clearer story about the value you are ready to create."],
];

const support = [
  ["01", "Human guidance", "Mentors help make the next concept, project, and decision more navigable."],
  ["02", "Work you can point to", "Practical outputs help you articulate what you have learned and how you work."],
  ["03", "Direction after the room", "Career conversations keep the learning experience connected to your next opportunity."],
];


export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#26142f] selection:bg-[#f47945]/25">
      <LandingNav />

      <main>
        {/* HERO — LEA's editorial learning still-life */}
        <section className="relative h-[520px] min-h-[520px] overflow-hidden bg-[#12091a] text-white sm:h-auto sm:min-h-[680px] lg:min-h-[720px]">
          <Image src={HERO_IMAGE} alt="An African learner working on a laptop in a LEA learning environment" fill priority quality={100} sizes="100vw" unoptimized className="scale-[1.22] object-cover object-[78%_center] origin-[78%_52%] sm:scale-100 sm:object-[72%_center] lg:object-[62%_center]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,9,26,0.9)_0%,rgba(18,9,26,0.66)_34%,rgba(18,9,26,0.08)_72%,rgba(18,9,26,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,9,26,0.72)_0%,transparent_45%),radial-gradient(circle_at_55%_60%,rgba(244,121,69,0.14),transparent_30%)]" />
          <div className="relative flex h-full min-h-0 items-end justify-start px-5 pb-32 sm:h-auto sm:min-h-[680px] sm:px-10 sm:pb-44 lg:min-h-[720px] lg:px-[7vw] lg:pb-48">
            <div className="mx-auto mr-auto w-full max-w-[1440px]">
              <div className="w-full max-w-[900px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f7c2aa]">LEA Labs · learn by doing</p>
              <h1 className="mt-5 max-w-[980px] text-[clamp(2.7rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.075em] text-[#fffdfb] lg:whitespace-nowrap">
                Open a world <span className="block text-[#f47945]">of possibility.</span>
              </h1>
              <p className="mt-6 max-w-[560px] text-sm leading-7 text-white/80 sm:text-base">LEA helps learners across Africa turn curiosity into practical digital confidence through guided programmes, hands-on projects, and support from people who understand the journey. <span className="hidden sm:inline">Start with the foundations, practise on real challenges, and build work you can carry into your next opportunity.</span></p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="#programmes" className="inline-flex h-11 items-center gap-3 rounded-full border border-[#f47945] bg-[#f47945] px-6 text-xs font-bold text-[#351039] transition hover:border-white hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12091a]">Find your starting point <ArrowDownRight className="h-4 w-4" /></Link>
                <Link href="#programmes" className="inline-flex items-center gap-2 border-b border-white/45 pb-1 text-xs font-bold text-white transition hover:border-[#f47945] hover:text-[#f47945]">Explore programmes <span aria-hidden>↗</span></Link>
              </div>
            </div>
          </div>
        </div>
        </section>


        <section id="programmes" className="relative scroll-mt-20 overflow-hidden bg-[#fffdfb] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="relative mx-auto max-w-[1440px]">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><h2 className="max-w-[620px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#151116]">Choose a practical path forward.</h2></div><p className="max-w-[460px] text-sm leading-7 text-[#6e6072]">Choose between <span className="font-semibold text-[#4d176e]">Software Engineering</span>, <span className="font-semibold text-[#4d176e]">Applied AI</span>, and <span className="font-semibold text-[#4d176e]">Digital Foundations</span> for beginners, children, and families.</p></div>
            <div className="mt-8 -mx-5 overflow-hidden px-5 pb-3 md:mx-0 md:px-0 md:pb-0 lg:mt-10"><div className="flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:snap-none">{programmes.map((programme) => <Link key={programme.title} href={`/programmes/${programme.slug}`} className="group w-[calc(100vw-2.5rem)] min-w-[calc(100vw-2.5rem)] shrink-0 basis-[calc(100vw-2.5rem)] snap-start overflow-hidden rounded-[26px] border border-[#f47945]/75 bg-white shadow-[0_18px_45px_rgba(77,23,110,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(77,23,110,0.16)] md:min-w-0 md:w-auto md:basis-auto md:shrink"><div className="relative aspect-[1.45] overflow-hidden bg-[#1f0d2e]"><Image src={PROGRAMME_CARD_IMAGES[programme.slug] ?? programme.image} alt={`${programme.title} programme`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#241027]/75 via-[#351039]/10 to-transparent" /><div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f47945] text-xs font-black text-[#351039]">{programme.number}</div><span className="absolute bottom-5 right-5 text-4xl font-semibold text-white/90">{programme.icon}</span></div><div className="flex min-h-[290px] flex-col p-5 sm:p-6"><h3 className="max-w-[270px] text-[clamp(1.2rem,1.5vw,1.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#f06d36]">{programme.title}</h3><p className="mt-3 text-sm leading-6 text-[#302434]">{programme.short}</p><p className="mt-2 text-xs leading-5 text-[#6e6072]">{programme.audience}</p><div className="mt-4 flex flex-wrap gap-2">{programme.bullets.map((bullet) => <span key={bullet} className="rounded-full border border-[#4d176e]/35 px-3 py-1.5 text-[10px] font-semibold text-[#4d176e]">{bullet}</span>)}</div><span className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f47945] text-xs font-black text-[#351039] transition group-hover:bg-[#ff8f57]">View programme <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div></div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d176e] md:hidden">Swipe to explore →</p>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#6e6072]"><span>Practical learning, whatever your starting point.</span><span>Three pathways. One clear next step.</span></div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 bg-[#1f0d2e] px-5 py-12 text-white sm:px-10 sm:py-14 lg:flex lg:min-h-[540px] lg:items-center lg:px-[7vw] lg:py-12">
          <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
            <div className="flex flex-col justify-center lg:min-h-[380px]">
              <div>
                <h2 className="mt-0 max-w-[450px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-white"><span className="text-white">Your next move</span><br /><span className="text-[#f47945]">is more than a</span><br /><span className="text-white">course.</span></h2>
                <p className="mt-3 max-w-[450px] text-sm leading-7 text-[#ead9ed] sm:text-base">LEA is designed as a practical sequence: find a fit, make the work, gather feedback, and shape a direction you can carry beyond the classroom.</p>
                <Link href="/register" className="mt-5 inline-flex h-10 items-center gap-4 rounded-full bg-white px-5 text-xs font-semibold text-[#26142f] transition hover:-translate-y-0.5 hover:bg-[#fff7ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f0d2e]">Start the conversation <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="relative space-y-5 lg:pt-0">
              <div aria-hidden="true" className="absolute bottom-5 left-[23px] top-5 w-px bg-[#f47945]/55 sm:left-[24px]" />
              {steps.map(([number, title, text]) => (
                <article key={number} className="relative grid grid-cols-[46px_1fr] gap-3 sm:grid-cols-[50px_1fr] sm:gap-3">
                  <div className="relative z-10 flex justify-center pt-0.5"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#f47945] bg-[#1f0d2e] text-[9px] font-bold text-[#f47945] sm:h-7 sm:w-7 sm:text-[10px]">{number}</span></div>
                  <div className="pb-1"><h3 className="text-base font-semibold tracking-[-0.02em] text-[#f47945] sm:text-lg">{title}</h3><p className="mt-1 max-w-[450px] text-[11px] leading-5 text-[#ead9ed] sm:text-sm">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="site-tour" className="scroll-mt-20 bg-white px-5 py-14 text-[#151116] sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="relative mx-auto max-w-[1440px]">
            <div className="grid items-center gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div className="max-w-[420px]">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f47945]">The LEA experience</p>
                <h2 className="mt-4 max-w-[390px] text-[clamp(1.9rem,3vw,3.25rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#151116]">See the path before you take it.</h2>
                <p className="mt-5 max-w-[390px] text-sm leading-7 text-[#5f5265] sm:text-base">Take a guided walk through the real LEA rhythm: choose a programme, learn inside the course player, practise with quizzes and projects, get feedback, and move forward with support.</p>
                <ol className="mt-7">
                  {[
                    ["01", "Choose a direction", "Programme discovery"],
                    ["02", "Make the work", "Lessons, notes, quizzes"],
                    ["03", "Stay supported", "Tutors and discussions"],
                    ["04", "Show your progress", "Projects and certificates"],
                  ].map(([number, title, detail]) => (
                    <li key={number} className="grid grid-cols-[30px_1fr_auto] items-center gap-3 py-3">
                      <span className="text-[10px] font-black text-[#f47945]">{number}</span>
                      <span className="text-xs font-bold text-[#241b42]">{title}</span>
                      <span className="text-right text-[10px] text-[#7b6d80]">{detail}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f6075]"><span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#f47945]" /> 2:19 guided tour</span><span className="inline-flex items-center gap-2"><Play className="h-3.5 w-3.5 text-[#4d176e]" /> Watch at your pace</span></div>
                <Link href="#tour-video" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-3 text-xs font-black text-[#351039] shadow-[0_12px_24px_rgba(244,121,69,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6eef9]">Watch the guided tour <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="relative">
                <div id="tour-video" className="relative overflow-hidden rounded-[28px] border border-[#4d176e]/25 bg-[#12091a] p-2 shadow-[0_28px_70px_rgba(77,23,110,0.22)] sm:p-3">
                  <div className="flex items-center justify-end px-3 py-2 text-[10px] text-[#cdb7d5]"><span className="tracking-[0.16em]">LEA LABS · PRODUCT TOUR</span></div>
                  <video className="aspect-video w-full rounded-[20px] bg-[#1f0d2e] object-cover" controls playsInline preload="metadata" poster="/lea-tour-poster.png" aria-label="LEA Labs product tour showing public programme discovery, learner course tools, tutor support, discussions, projects, certificates, and instructor workflows">
                    <source src="/lea-site-tour.mp4" type="video/mp4" />
                    Your browser does not support the LEA Labs site-tour video. <Link href="#programmes" className="text-[#f47945]">Explore the programmes instead.</Link>
                  </video>
                  <div className="flex flex-col gap-3 px-3 pt-3 text-[10px] text-[#cdb7d5] sm:flex-row sm:items-center sm:justify-between"><span>Guided product tour · built for real learner progress</span><span className="text-[#f47945]">Learn · Build · Move forward</span></div><div className="mt-4 grid gap-2 px-3 pt-3 sm:grid-cols-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f47945]">01</p><p className="mt-1 text-xs font-semibold text-white">Choose your direction</p></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f47945]">02</p><p className="mt-1 text-xs font-semibold text-white">Practise inside the portal</p></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f47945]">03</p><p className="mt-1 text-xs font-semibold text-white">Leave with evidence</p></div></div>
                </div>
              </div>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              {[['01', 'Find your fit'], ['02', 'Learn by doing'], ['03', 'Get guidance'], ['04', 'Share the work']].map(([number, label]) => <div key={number} className="flex items-center gap-3 py-3 text-xs font-bold text-[#4d176e] sm:px-0"><span className="text-[10px] font-black text-[#f47945]">{number}</span><span>{label}</span></div>)}
            </div>
          </div>
        </section>


        <div aria-hidden="true" className="relative z-10 h-8 bg-[#1f0d2e]"><div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-l-[30px] border-r-[30px] border-t-[30px] border-l-transparent border-r-transparent border-t-[#fffdfb]" /></div>

        <section className="bg-[#1f0d2e] px-5 pb-8 pt-16 text-white sm:px-10 sm:pb-10 sm:pt-18 lg:px-[7vw] lg:pb-12 lg:pt-22">
          <div className="relative mx-auto grid max-w-[1440px] items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h2 className="mt-4 max-w-[590px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white"><span className="text-white">The work matters.</span> <span className="text-[#f47945]">So does the person doing it.</span></h2>
              <p className="mt-5 max-w-[620px] text-sm leading-7 text-[#f4e8f5] sm:text-base">Learning is more durable when someone can challenge your thinking, celebrate the progress, and help you connect a project to the direction you are building toward.</p>
            </div>
            <div className="relative flex items-start justify-start lg:justify-end lg:pt-0"><TestimonialsRotator /></div>
          </div>
        </section>

        <section id="community" className="scroll-mt-20 bg-[#f6eef9] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div className="relative pt-8 sm:pt-10"><div className="absolute left-0 top-0 h-20 w-20 border-l border-t border-[#f47945]" /><Image src={COMMUNITY_IMAGE} alt="African learners sharing a collaborative learning space" width={1400} height={1000} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[1.4] w-full object-cover object-center [clip-path:polygon(0_0,100%_0,100%_82%,82%_100%,0_88%)]" /></div>
            <div className="max-w-[520px]"><h2 className="mt-4 text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#151116]"><span className="text-[#151116]">A place to learn from other people in</span> <span className="text-[#f47945]">motion.</span></h2><p className="mt-5 max-w-[480px] text-sm leading-7 text-[#6e6072] sm:text-base">The LEA community is for sharing questions, meeting collaborators, seeing what peers are building, and staying connected to a wider conversation about digital work.</p><div className="mt-6 flex flex-wrap gap-2">{["Peer exchange", "Guest sessions", "Studio events", "Open resources"].map((label) => <span key={label} className="border border-[#cdb7d5] bg-white/30 px-3 py-2 text-[10px] font-bold text-[#5c4566]">{label}</span>)}</div><Link href="/register" className="mt-6 inline-flex items-center gap-2 text-xs font-black text-[#4d176e]">Ask about the LEA community <ExternalLink className="h-3.5 w-3.5" /></Link></div>
          </div>
        </section>


        </main>

        <footer className="bg-[#1f0d2e] px-5 py-8 text-white sm:px-10 lg:px-[7vw] lg:py-9">
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
    </div>
  );
}