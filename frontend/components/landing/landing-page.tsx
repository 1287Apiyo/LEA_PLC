"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Layers3,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { LandingNav } from "@/components/landing/landing-nav";
import { APP_NAME } from "@/lib/constants";

const HERO_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-hero-learning-current_d35697f7.jpg";
const COLLABORATION_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-programme-collaboration_c9aa5e6b.jpg";
const MENTOR_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-mentor-support_9d78971d.jpg";
const COMMUNITY_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-community-launch_f1ae296d.jpg";

const programmes = [
  {
    number: "01",
    title: "Software Engineering",
    short: "Design, build, test, and ship useful web products with a disciplined software practice.",
    audience: "For makers ready to turn curiosity into working digital products.",
    bullets: ["Product thinking", "Modern web foundations", "Project practice"],
    icon: "</>",
  },
  {
    number: "02",
    title: "Data & Analytics",
    short: "Learn to find the signal in complex information and turn data into better decisions.",
    audience: "For curious problem-solvers who want to work with evidence and insight.",
    bullets: ["Data foundations", "Analytical thinking", "Decision-ready outputs"],
    icon: "◒",
  },
  {
    number: "03",
    title: "Cybersecurity",
    short: "Understand the habits, systems, and practical controls that keep digital work safe.",
    audience: "For careful thinkers who want to make technology more trustworthy.",
    bullets: ["Security principles", "Risk awareness", "Practical defence"],
    icon: "◈",
  },
  {
    number: "04",
    title: "Applied AI",
    short: "Explore how intelligent tools can support better research, workflows, and creative work.",
    audience: "For builders who want to work thoughtfully with emerging technology.",
    bullets: ["AI foundations", "Responsible use", "Applied experiments"],
    icon: "✦",
  },
  {
    number: "05",
    title: "Product & Digital Operations",
    short: "Connect customer needs, systems, and delivery so useful digital work can move forward.",
    audience: "For organisers and operators who make teams more effective.",
    bullets: ["Product operations", "Customer insight", "Delivery practice"],
    icon: "▣",
  },
  {
    number: "06",
    title: "School-Leaver Launchpad",
    short: "Build a confident first foundation for study, work, and the opportunities ahead.",
    audience: "For school-leavers ready to make a practical start in the digital economy.",
    bullets: ["Digital confidence", "Career direction", "Project practice"],
    icon: "↗",
  },
];

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

const faqs = [
  ["Who are LEA programmes designed for?", "LEA programmes are designed for ambitious learners at different starting points, from school-leavers building confidence to working professionals ready to move into digital work."],
  ["Can I learn around an existing job or studies?", "Yes. Each pathway is designed around focused practice, clear milestones, and a rhythm that can fit alongside existing commitments."],
  ["What kind of learning experience should I expect?", "Expect practical projects, guided support, feedback, and a community of people who are also building their next direction."],
  ["How do I choose the right programme?", "Start with the kind of work you want to explore. The admissions team can help you compare pathways and choose a starting point that fits."],
];

export default function LandingPage() {
  const [activeProgramme, setActiveProgramme] = useState(0);
  const selected = programmes[activeProgramme];

  return (
    <div id="top" className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#26142f] selection:bg-[#f47945]/25">
      <LandingNav />

      <main>
        <section className="relative grid min-h-[calc(100vh-72px)] overflow-hidden border-b border-[#eadfe9] bg-[#f6eef9] lg:grid-cols-[1fr_1fr]">
          <div className="relative flex flex-col justify-between px-5 pb-12 pt-7 sm:px-10 sm:pb-16 sm:pt-8 lg:px-[6vw] lg:pb-20 lg:pt-8">
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.22em] text-[#4d176e]"><span className="h-5 w-[3px] bg-[#f47945]" /> 01 / Begin</div>
            <div className="mt-20 sm:mt-24 lg:mt-28">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#6c5877]"><span className="h-px w-7 bg-[#f47945]" /> LEA / Learn. Evolve. Advance.</div>
              <h1 className="mt-7 max-w-[700px] text-[clamp(2.85rem,5.6vw,6.2rem)] font-semibold leading-[0.93] tracking-[-0.065em] text-[#17131a]">Build the skills<br />your next role will<br />ask for.</h1>
              <p className="mt-8 max-w-[540px] text-sm leading-6 text-[#6a5a70] sm:text-base sm:leading-7">LEA Labs is a practical learning space for ambitious people who want to move with confidence into the digital economy.</p>
              <div className="mt-8 flex flex-wrap items-center gap-5"><Link href="#programmes" className="inline-flex h-12 items-center gap-3 rounded-full bg-[#f47945] px-6 text-xs font-black text-[#351039] shadow-[0_14px_24px_rgba(244,121,69,0.2)] transition hover:-translate-y-0.5 hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d176e] focus-visible:ring-offset-2">Explore programmes <ArrowDownRight className="h-4 w-4" /></Link><Link href="#programmes" className="inline-flex items-center gap-1 border-b border-[#4d176e]/45 pb-1 text-xs font-black text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">Find your path <span aria-hidden>↗</span></Link></div>
            </div>
            <div className="mt-14 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold text-[#6b5b73] sm:mt-20"><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f47945]" /> Practical learning</span><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7db3a9]" /> Guided support</span><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#4d176e]" /> Career direction</span></div>
          </div>
          <div className="relative min-h-[560px] overflow-hidden bg-[#e9d9ed] lg:min-h-0">
            <div className="absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-[#f6eef9] via-[#f6eef9]/80 to-transparent" />
            <div className="absolute left-0 top-0 z-20 h-40 w-28 bg-[#4d176e] [clip-path:polygon(0_0,100%_0,0_100%)]" />
            <img src={HERO_IMAGE} alt="LEA learner moving forward with a laptop in a contemporary learning studio" className="absolute inset-0 h-full w-full object-cover object-[64%_center]" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#f6eef9]/80 via-transparent to-[#4d176e]/10" />
            <div className="absolute right-8 top-7 z-30 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#4d176e] sm:right-10"><span className="h-2 w-2 bg-[#f47945]" /> 01 / Access</div>
            <div className="absolute right-8 top-7 z-30 hidden flex-col items-center gap-1 sm:flex"><span className="h-8 w-[3px] rotate-[28deg] bg-[#f47945]" /><span className="-mt-3 ml-3 h-5 w-[3px] rotate-[115deg] bg-[#2e4768]" /></div>
            <div className="absolute bottom-0 left-10 z-30 flex items-end sm:left-20"><div className="relative h-20 w-32 bg-[#4d176e] p-4 text-white sm:h-24 sm:w-40"><div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#f7c2aa]">LEA</div><div className="mt-1 text-xl font-black leading-[0.85]">01</div><div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em]">Move forward</div></div><svg className="h-20 w-[250px] text-[#f47945] sm:h-24" viewBox="0 0 250 72" fill="none" aria-hidden><path d="M0 55 C50 60 48 12 105 31 C153 47 160 5 207 25 C225 33 236 41 250 38" stroke="currentColor" strokeWidth="3" /></svg></div>
          </div>
        </section>

        <div className="bg-[#4d176e] px-5 py-4 text-[#fff7ef] sm:px-10"><div className="mx-auto flex max-w-[1440px] items-center justify-center gap-x-8 gap-y-2 overflow-hidden text-center text-[11px] font-bold sm:justify-between"><span>Skill meets direction</span><i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f47945]" /><span>Practice meets possibility</span><i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f47945]" /><span>Growth moves in company</span><i className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[#f47945] sm:block" /><span className="hidden sm:inline">Skill meets direction</span></div></div>

        <section id="programmes" className="scroll-mt-20 px-5 py-20 sm:px-10 lg:px-[7vw] lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.65fr] lg:items-end"><div><div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#876e8c]"><span className="h-px w-7 bg-[#f47945]" /> 01 / Choose your current</div><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,4.2vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#17131a]">A programme for the way you want to grow.</h2></div><p className="max-w-sm text-sm leading-7 text-[#6e6072]">Start where your curiosity is strongest. Each LEA pathway combines essential knowledge with project-based practice and a clearer view of the work ahead.</p></div>
            <div className="mt-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="space-y-2" role="tablist" aria-label="LEA programmes">
                {programmes.map((programme, index) => (
                  <button key={programme.title} type="button" role="tab" aria-selected={activeProgramme === index} onClick={() => setActiveProgramme(index)} className={`group flex w-full items-center gap-4 border-b border-[#eadfe9] px-3 py-4 text-left transition ${activeProgramme === index ? "bg-[#fff3ed] text-[#f47945]" : "text-[#4d176e] hover:bg-[#faf2f8]"}`}><span className="w-7 text-[10px] font-black text-[#aa98aa]">{programme.number}</span><span className="flex-1 text-sm font-black sm:text-base">{programme.title}</span><span className={`text-lg transition ${activeProgramme === index ? "text-[#f47945]" : "text-[#8e778e] group-hover:translate-x-1"}`}>↗</span></button>
                ))}
              </div>

              <div className="grid min-h-[400px] overflow-hidden bg-[#eee5f6] sm:grid-cols-[0.5fr_1fr]" aria-live="polite">
                <div className="flex flex-col justify-between bg-[#f47945] p-6 text-[#351039] sm:p-8"><div><span className="text-4xl font-black">{selected.icon}</span><div className="mt-16 -rotate-90 origin-left whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-[#6f2e3d] sm:mt-28">01 / Build</div></div><div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#713b47]">Pathway selected</div></div>
                <div className="relative p-7 sm:p-10"><div className="absolute right-0 top-0 h-40 w-40 rounded-full border border-[#4d176e]/15" /><div className="relative text-[9px] font-black uppercase tracking-[0.2em] text-[#927ba0]">Programme pathway</div><h3 className="relative mt-6 max-w-sm text-3xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#17131a] sm:text-4xl">{selected.title}</h3><div className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#8a708e]">Start <span className="h-px w-8 bg-[#f47945]" /> Build momentum <span className="text-base text-[#f47945]">↗</span></div><p className="mt-7 max-w-md text-sm leading-7 text-[#6e6072]">{selected.short}</p><p className="mt-3 max-w-md text-sm leading-7 text-[#6e6072]">{selected.audience}</p><div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">{selected.bullets.map((bullet) => <span key={bullet} className="inline-flex items-center gap-2 text-xs font-bold text-[#5a4661]"><Check className="h-3.5 w-3.5 text-[#f47945]" /> {bullet}</span>)}</div><Link href="/register" className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#4d176e]/35 px-5 py-3 text-xs font-black text-[#4d176e] transition hover:border-[#f47945] hover:bg-white">Talk through this path <span>↗</span></Link></div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-[#4d176e] px-5 py-20 text-white sm:px-10 sm:py-24 lg:min-h-[760px] lg:px-[7vw] lg:py-28">
          <div className="pointer-events-none absolute -right-28 -top-20 h-64 w-[390px] rotate-[-18deg] rounded-[50%] border border-white/20 sm:-right-20 sm:-top-16" />
          <div className="pointer-events-none absolute right-[32%] top-[52%] h-1.5 w-1.5 rounded-full bg-[#f47945]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/10" />
          <div className="relative mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="flex flex-col justify-between lg:min-h-[580px]">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#e6cfe9]"><span className="h-px w-7 bg-[#f47945]" /> 02 / Learning by doing</div>
                <h2 className="mt-7 max-w-[510px] text-[clamp(2.8rem,5vw,5.7rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-white">Your next move<br />is more than a<br />course.</h2>
                <p className="mt-7 max-w-[470px] text-sm leading-7 text-[#ead9ed] sm:text-base">LEA is designed as a practical sequence: find a fit, make the work, gather feedback, and shape a direction you can carry beyond the classroom.</p>
                <Link href="/register" className="mt-8 inline-flex h-11 items-center gap-4 rounded-full bg-white px-5 text-xs font-semibold text-[#26142f] transition hover:-translate-y-0.5 hover:bg-[#fff7ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#4d176e]">Start the conversation <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-16 text-[9px] font-black uppercase tracking-[0.24em] text-[#e6cfe9] lg:mt-0">02 / Make</div>
            </div>
            <div className="space-y-7 lg:pt-3">
              {steps.map(([number, title, text], index) => (
                <article key={number} className="grid grid-cols-[56px_1fr] gap-5 sm:grid-cols-[60px_1fr] sm:gap-5">
                  <div className="relative flex justify-center"><span className="z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/45 text-[11px] font-semibold text-white sm:h-12 sm:w-12">{number}</span>{index < steps.length - 1 && <span className="absolute left-1/2 top-12 h-[calc(100%+1.25rem)] -translate-x-1/2 border-l border-dashed border-white/35" />}</div>
                  <div className="pb-1"><h3 className="text-xl font-semibold tracking-[-0.025em] text-[#f6d9c8] sm:text-2xl">{title}</h3><p className="mt-3 max-w-[460px] text-xs leading-6 text-[#ead9ed] sm:text-sm">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#4d176e] bg-[#fffdfb] px-5 py-16 sm:px-10 sm:py-20 lg:px-[7vw] lg:py-24">
          <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
            <div className="relative pl-8 pt-8 sm:pl-14 sm:pt-10">
              <div className="absolute left-0 top-0 h-24 w-24 border-l border-t border-[#f47945] sm:h-28 sm:w-28" />
              <img src={COLLABORATION_IMAGE} alt="LEA learners collaborating over a digital project" className="aspect-[1.58] w-full object-cover object-center" />
            </div>
            <blockquote className="relative max-w-[390px] lg:pb-7"><span className="block text-7xl font-black leading-[0.6] text-[#f47945]">“</span><p className="mt-6 text-[clamp(2rem,3.3vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#4d176e]">Good learning does not ask you to wait until you are ready. It gives you a room to become ready.</p><cite className="mt-8 block text-[9px] font-black uppercase tracking-[0.2em] text-[#6e6072] not-italic">The LEA learning philosophy</cite><span className="absolute -right-1 bottom-0 hidden h-px w-24 bg-[#f47945] sm:block" /></blockquote>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#fffdfb] px-5 py-20 sm:px-10 sm:py-24 lg:px-[7vw] lg:py-28">
          <div className="pointer-events-none absolute left-[17%] top-7 hidden text-[7rem] font-black leading-none text-[#eee7f2] lg:block">03</div>
          <div className="pointer-events-none absolute bottom-9 right-[15%] h-24 w-52 rotate-[7deg] rounded-[50%] border border-[#f47945]/60" />
          <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#876e8c]"><span className="h-px w-7 bg-[#f47945]" /> 03 / Support that travels</div>
              <h2 className="mt-6 max-w-[620px] text-[clamp(2.6rem,4.5vw,5.1rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#4d176e]">The work matters. So does the person doing it.</h2>
              <p className="mt-7 max-w-[620px] text-sm leading-7 text-[#6e6072] sm:text-base">Learning is more durable when someone can challenge your thinking, celebrate the progress, and help you connect a project to the direction you are building toward.</p>
              <div className="mt-12 grid gap-7 sm:grid-cols-3">{support.map(([number, title, text]) => <article key={number} className="border-t border-[#4d176e] pt-4"><div className="text-[10px] font-black text-[#f47945]">{number}</div><h3 className="mt-5 text-lg font-semibold leading-tight text-[#4d176e]">{title}</h3><p className="mt-3 text-xs leading-6 text-[#6e6072]">{text}</p></article>)}</div>
            </div>
            <div className="relative lg:pt-2"><div className="mx-auto max-w-[470px] overflow-hidden bg-[#f4dfd9]"><img src={MENTOR_IMAGE} alt="Mentor supporting a learner at a workstation" className="aspect-[0.88] h-full w-full object-cover object-center" /><div className="bg-[#4d176e] px-5 py-4 text-white"><div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f47945]">Mentor moment</div><div className="mt-1 text-base font-semibold">Feedback that moves work forward.</div></div></div></div>
          </div>
        </section>

        <section id="community" className="relative scroll-mt-20 overflow-hidden bg-[#f6eef9] px-5 py-20 sm:px-10 sm:py-24 lg:px-[7vw] lg:py-28">
          <div className="pointer-events-none absolute left-12 top-5 text-[9px] font-black uppercase tracking-[0.24em] text-[#f47945] sm:left-20">04 / Collective momentum</div>
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-[#4d176e]/15" />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div className="relative pt-8 sm:pt-10"><div className="absolute left-0 top-0 h-20 w-20 border-l border-t border-[#f47945]" /><img src={COMMUNITY_IMAGE} alt="Young professionals connecting after a LEA community event" className="aspect-[1.4] w-full object-cover object-center [clip-path:polygon(0_0,100%_0,100%_82%,82%_100%,0_88%)]" /></div>
            <div className="max-w-[520px]"><div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#876e8c]"><span className="h-px w-7 bg-[#f47945]" /> 04 / In good company</div><h2 className="mt-6 text-[clamp(2.6rem,4.5vw,5.1rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#4d176e]">A place to learn from other people in motion.</h2><p className="mt-7 max-w-[480px] text-sm leading-7 text-[#6e6072] sm:text-base">The LEA community is for sharing questions, meeting collaborators, seeing what peers are building, and staying connected to a wider conversation about digital work.</p><div className="mt-8 flex flex-wrap gap-2">{["Peer exchange", "Guest sessions", "Studio events", "Open resources"].map((label) => <span key={label} className="border border-[#cdb7d5] bg-white/30 px-3 py-2 text-[10px] font-bold text-[#5c4566]">{label}</span>)}</div><Link href="/register" className="mt-8 inline-flex items-center gap-2 border-b border-[#4d176e] pb-2 text-xs font-black text-[#4d176e]">Ask about the LEA community <ExternalLink className="h-3.5 w-3.5" /></Link></div>
          </div>
        </section>

        <section id="questions" className="scroll-mt-20 px-5 py-20 sm:px-10 lg:px-[7vw] lg:py-28"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#876e8c]"><span className="h-px w-7 bg-[#f47945]" /> 05 / Clear answers</div><h2 className="mt-6 max-w-2xl text-[clamp(2.25rem,4.2vw,4.7rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#17131a]">Questions are part of choosing well.</h2></div><p className="max-w-sm text-sm leading-7 text-[#6e6072]">Here are a few practical starting points. If your question is more personal, the admissions team can help you think it through.</p></div><Link href="/register" className="mt-8 inline-flex items-center gap-2 border-b border-[#4d176e]/35 pb-2 text-sm font-black text-[#4d176e]">Speak to admissions <ArrowRight className="h-4 w-4" /></Link><div className="mt-12 max-w-4xl border-t border-[#d5c6d9]">{faqs.map(([question, answer]) => <details key={question} className="group border-b border-[#d5c6d9] py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-[#4d176e] marker:hidden"><span>{question}</span><ChevronDown className="h-5 w-5 shrink-0 text-[#f47945] transition group-open:rotate-180" /></summary><p className="max-w-2xl pt-4 text-sm leading-7 text-[#6e6072]">{answer}</p></details>)}</div></div></section>

        <section className="px-5 pb-20 sm:px-10 lg:px-[7vw] lg:pb-28"><div className="relative mx-auto max-w-[1440px] overflow-hidden bg-[#4d176e] px-7 py-12 text-white sm:px-12 lg:px-20 lg:py-16"><div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[46px] border-[#f47945]/50" /><div className="relative max-w-3xl"><div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#f7c2aa]"><span className="h-px w-7 bg-[#f47945]" /> LEA / Next</div><h2 className="mt-6 max-w-2xl text-[clamp(2.8rem,5vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">The future is not a waiting room.</h2><p className="mt-6 max-w-xl text-base leading-7 text-[#e7d8eb]">Tell us where you are now. We will help you map a practical way forward.</p><Link href="/register" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f47945] px-6 py-3.5 text-sm font-black text-[#351039] transition hover:bg-[#ff8f57]">Speak to admissions <ArrowRight className="h-4 w-4" /></Link></div></div></section>
      </main>

      <footer className="border-t border-[#eadfe9] bg-[#fffdfb] px-5 py-12 sm:px-10 lg:px-[7vw] lg:py-16"><div className="mx-auto max-w-[1440px]"><div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]"><div><Link href="#top" className="inline-flex items-center gap-3"><BrandMark className="h-10 w-10" /><span className="text-[11px] font-black uppercase leading-[0.9] tracking-[0.22em] text-[#31104e]">LEA<br />LABS</span></Link><p className="mt-5 max-w-xs text-sm leading-7 text-[#6e6072]">Learning, momentum, and meaningful work—held together in one practical space.</p><Link href="#top" className="mt-7 inline-flex items-center gap-2 text-xs font-black text-[#4d176e]">Back to top <ArrowRight className="h-3.5 w-3.5 -rotate-90" /></Link></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9b849d]">Explore</p><div className="mt-4 space-y-3 text-sm font-bold text-[#5c4566]"><Link className="block hover:text-[#f47945]" href="#programmes">Programmes</Link><Link className="block hover:text-[#f47945]" href="#how-it-works">How LEA works</Link><Link className="block hover:text-[#f47945]" href="#community">Community</Link></div></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9b849d]">Connect</p><div className="mt-4 space-y-3 text-sm font-bold text-[#5c4566]"><Link className="block hover:text-[#f47945]" href="/register">Admissions</Link><Link className="block hover:text-[#f47945]" href="/register">Contact LEA</Link><Link className="block hover:text-[#f47945]" href="/login">Log in</Link></div></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9b849d]">Stay in the current</p><p className="mt-4 text-sm leading-7 text-[#6e6072]">Receive programme updates, useful resources, and invitations to upcoming LEA conversations.</p><Link href="/register" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f47945] px-5 py-3 text-xs font-black text-[#351039] transition hover:bg-[#ff8f57]">Join the LEA list <ArrowRight className="h-3.5 w-3.5" /></Link></div></div><div className="mt-12 flex flex-col gap-2 border-t border-[#eadfe9] pt-5 text-xs text-[#8c758f] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span><span>Built for learning in motion.</span></div></div></footer>
    </div>
  );
}
