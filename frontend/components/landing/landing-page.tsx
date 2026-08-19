"use client";

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
import { PROGRAMMES as programmes } from "@/lib/programmes";

const HERO_IMAGE = "/lea-hero-purple-orange.png";
const COLLABORATION_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-programme-collaboration_c9aa5e6b.jpg";
const MENTOR_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-mentor-support_9d78971d.jpg";
const COMMUNITY_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-community-launch_f1ae296d.jpg";



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
  return (
    <div id="top" className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#26142f] selection:bg-[#f47945]/25">
      <LandingNav />

      <main>
        <section className="relative overflow-hidden border-b border-[#1f0d2e] bg-[#1f0d2e] lg:min-h-[calc(100svh-72px)]">
          <div className="relative grid min-h-[650px] w-full lg:min-h-[calc(100svh-72px)] lg:grid-cols-2">
            <div className="relative z-10 flex items-center px-5 py-16 sm:px-10 sm:py-20 lg:pl-[max(7vw,calc((100vw_-_1440px)_/_2))] lg:pr-[5vw] lg:py-24">
              <div className="max-w-[650px]">
                <h1 className="max-w-[610px] text-[clamp(2.25rem,4.3vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-[#fffdfb]">
                  <span>Build the skills</span><br />
                  <span>your next role will</span><br />
                  <span className="text-[#f47945]">ask for.</span>
                </h1>
                <p className="mt-6 max-w-[500px] text-sm leading-6 text-white/75 sm:text-base sm:leading-7">LEA Labs is a practical learning space for ambitious people who want to move with confidence into the digital economy.</p>
                <p className="mt-3 max-w-[470px] text-xs font-medium leading-6 text-[#f6eef9]/90 sm:text-sm">Learn by building, grow with guidance, and leave with work you can show.</p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link href="#programmes" className="inline-flex h-11 items-center gap-3 rounded-md bg-[#f47945] px-5 text-xs font-semibold text-[#351039] transition hover:bg-[#e96836] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f0d2e]">Explore programmes <ArrowDownRight className="h-4 w-4" /></Link>
                  <Link href="#programmes" className="inline-flex items-center gap-1 border-b border-white/55 pb-1 text-xs font-semibold text-white transition hover:border-[#f47945] hover:text-[#f47945]">Find your path <span aria-hidden>↗</span></Link>
                </div>
              </div>
            </div>
            <div className="relative min-h-[430px] overflow-hidden bg-transparent lg:min-h-[calc(100svh-72px)]">
              <img src={HERO_IMAGE} alt="LEA learner moving forward with a laptop in a contemporary learning studio" className="absolute inset-0 h-full w-full object-cover object-[58%_center]" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(77,23,110,0.62)_0%,rgba(55,31,76,0.20)_46%,rgba(21,17,22,0.16)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_25%,rgba(244,121,69,0.34),transparent_34%),linear-gradient(180deg,rgba(46,71,104,0.12),rgba(21,17,22,0.32))]" />
            </div>
          </div>
        </section>

        <section id="programmes" className="relative scroll-mt-20 overflow-hidden border-y border-[#eee7f2] bg-[#fffdfb] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full border border-[#4d176e]/10" />
          <div className="pointer-events-none absolute bottom-10 left-[8%] h-px w-24 bg-[#f47945]" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><h2 className="max-w-[620px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#151116]">Choose a practical path forward.</h2></div><p className="max-w-[460px] text-sm leading-7 text-[#6e6072]">Choose between <span className="font-semibold text-[#4d176e]">Software Engineering</span>, <span className="font-semibold text-[#4d176e]">Applied AI</span>, and <span className="font-semibold text-[#4d176e]">Basic Computer Knowledge</span> for beginners, children, and families.</p></div>
            <div className="mt-8 grid gap-5 md:grid-cols-3 lg:mt-10">{programmes.map((programme) => <Link key={programme.title} href={`/programmes/${programme.slug}`} className="group overflow-hidden rounded-[26px] border border-[#f47945]/75 bg-white shadow-[0_18px_45px_rgba(77,23,110,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(77,23,110,0.16)]"><div className="relative aspect-[1.45] overflow-hidden bg-[#1f0d2e]"><img src={programme.image} alt={`${programme.title} programme`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#241027]/75 via-[#351039]/10 to-transparent" /><div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f47945] text-xs font-black text-[#351039]">{programme.number}</div><span className="absolute bottom-5 right-5 text-4xl font-semibold text-white/90">{programme.icon}</span></div><div className="flex min-h-[290px] flex-col p-5 sm:p-6"><h3 className="max-w-[270px] text-[clamp(1.2rem,1.5vw,1.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#f06d36]">{programme.title}</h3><p className="mt-3 text-sm leading-6 text-[#302434]">{programme.short}</p><p className="mt-2 text-xs leading-5 text-[#6e6072]">{programme.audience}</p><div className="mt-4 flex flex-wrap gap-2">{programme.bullets.map((bullet) => <span key={bullet} className="rounded-full border border-[#4d176e]/35 px-3 py-1.5 text-[10px] font-semibold text-[#4d176e]">{bullet}</span>)}</div><div className="mt-4 flex items-center justify-between border-t border-[#efcfc1] pt-4"><span className="text-xs text-[#6e6072]">Full programme</span><span className="text-sm font-black text-[#4d176e]">{programme.price}</span></div><span className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f47945] text-xs font-black text-[#351039] transition group-hover:bg-[#ff8f57]">View programme <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#6e6072]"><span>Practical learning, whatever your starting point.</span><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f47945]" /> Three pathways. One clear next step.</span></div>
          </div>
        </section>

        <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-[#1f0d2e] px-5 py-12 text-white sm:px-10 sm:py-14 lg:flex lg:min-h-[540px] lg:items-center lg:px-[7vw] lg:py-12">
          <div className="pointer-events-none absolute -right-28 -top-20 h-64 w-[390px] rotate-[-18deg] rounded-[50%] border border-white/20 sm:-right-20 sm:-top-16" />
          <div className="pointer-events-none absolute right-[32%] top-[52%] h-1.5 w-1.5 rounded-full bg-[#f47945]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/10" />
          <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
            <div className="flex flex-col justify-center lg:min-h-[380px]">
              <div>
                <h2 className="mt-0 max-w-[450px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-white"><span className="text-white">Your next move</span><br /><span className="text-[#f47945]">is more than a</span><br /><span className="text-white">course.</span></h2>
                <p className="mt-3 max-w-[450px] text-sm leading-7 text-[#ead9ed] sm:text-base">LEA is designed as a practical sequence: find a fit, make the work, gather feedback, and shape a direction you can carry beyond the classroom.</p>
                <Link href="/register" className="mt-5 inline-flex h-10 items-center gap-4 rounded-full bg-white px-5 text-xs font-semibold text-[#26142f] transition hover:-translate-y-0.5 hover:bg-[#fff7ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f0d2e]">Start the conversation <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="space-y-3 lg:pt-0">
              {steps.map(([number, title, text], index) => (
                <article key={number} className="grid grid-cols-[46px_1fr] gap-3 sm:grid-cols-[50px_1fr] sm:gap-3">
                  <div className="relative flex justify-center"><span className="z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/45 text-[10px] font-semibold text-white sm:h-10 sm:w-10">{number}</span>{index < steps.length - 1 && <span className="absolute left-1/2 top-10 h-[calc(100%+0.75rem)] -translate-x-1/2 border-l border-dashed border-white/35" />}</div>
                  <div className="pb-0"><h3 className="text-base font-semibold tracking-[-0.02em] text-[#f6d9c8] sm:text-lg">{title}</h3><p className="mt-1 max-w-[450px] text-[11px] leading-5 text-[#ead9ed] sm:text-sm">{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t-2 border-[#f47945]/70 bg-[#fffdfb] px-5 py-13 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="mx-auto grid max-w-[1440px] items-center gap-9 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div className="relative pl-8 pt-8 sm:pl-14 sm:pt-10">
              <div className="absolute left-0 top-0 h-24 w-24 border-l border-t border-[#f47945] sm:h-28 sm:w-28" />
              <img src={COLLABORATION_IMAGE} alt="LEA learners collaborating over a digital project" className="aspect-[1.58] w-full object-cover object-center" />
            </div>
            <blockquote className="relative max-w-[390px] lg:pb-7"><span className="block text-7xl font-black leading-[0.6] text-[#f47945]">“</span><p className="mt-5 text-[clamp(1.55rem,2.4vw,2.35rem)] font-semibold leading-[1] tracking-[-0.045em] text-[#151116]"><span className="text-[#151116]">Good learning does not ask you to wait until you are ready.</span> <span className="text-[#4d176e]">It gives you a room to become ready.</span></p></blockquote>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-[#f47945]/55 bg-[#fffdfb] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="pointer-events-none absolute left-[17%] top-7 hidden text-[7rem] font-black leading-none text-[#eee7f2] lg:block">03</div>
          <div className="pointer-events-none absolute bottom-9 right-[15%] h-24 w-52 rotate-[7deg] rounded-[50%] border border-[#f47945]/60" />
          <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h2 className="mt-4 max-w-[590px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#151116]"><span className="text-[#151116]">The work matters.</span> <span className="text-[#4d176e]">So does the person doing it.</span></h2>
              <p className="mt-5 max-w-[620px] text-sm leading-7 text-[#6e6072] sm:text-base">Learning is more durable when someone can challenge your thinking, celebrate the progress, and help you connect a project to the direction you are building toward.</p>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">{support.map(([number, title, text]) => <article key={number} className="border-t border-[#4d176e] pt-3"><div className="text-[10px] font-black text-[#f47945]">{number}</div><h3 className="mt-3 text-base font-semibold leading-tight text-[#151116]">{title}</h3><p className="mt-3 text-xs leading-6 text-[#6e6072]">{text}</p></article>)}</div>
            </div>
            <div className="relative lg:pt-2"><div className="mx-auto max-w-[470px] overflow-hidden bg-[#f4dfd9]"><img src={MENTOR_IMAGE} alt="Mentor supporting a learner at a workstation" className="aspect-[0.88] h-full w-full object-cover object-center" /><div className="bg-[#1f0d2e] px-5 py-4 text-white"><div className="mt-1 text-base font-semibold">Feedback that moves work forward.</div></div></div></div>
          </div>
        </section>

        <section id="community" className="relative scroll-mt-20 overflow-hidden border-t border-[#f47945]/35 bg-[#f6eef9] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-[#4d176e]/15" />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <div className="relative pt-8 sm:pt-10"><div className="absolute left-0 top-0 h-20 w-20 border-l border-t border-[#f47945]" /><img src={COMMUNITY_IMAGE} alt="Young professionals connecting after a LEA community event" className="aspect-[1.4] w-full object-cover object-center [clip-path:polygon(0_0,100%_0,100%_82%,82%_100%,0_88%)]" /></div>
            <div className="max-w-[520px]"><h2 className="mt-4 text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#151116]"><span className="text-[#151116]">A place to learn from other people in</span> <span className="text-[#f47945]">motion.</span></h2><p className="mt-5 max-w-[480px] text-sm leading-7 text-[#6e6072] sm:text-base">The LEA community is for sharing questions, meeting collaborators, seeing what peers are building, and staying connected to a wider conversation about digital work.</p><div className="mt-6 flex flex-wrap gap-2">{["Peer exchange", "Guest sessions", "Studio events", "Open resources"].map((label) => <span key={label} className="border border-[#cdb7d5] bg-white/30 px-3 py-2 text-[10px] font-bold text-[#5c4566]">{label}</span>)}</div><Link href="/register" className="mt-6 inline-flex items-center gap-2 border-b border-[#4d176e] pb-2 text-xs font-black text-[#4d176e]">Ask about the LEA community <ExternalLink className="h-3.5 w-3.5" /></Link></div>
          </div>
        </section>

        <section id="questions" className="relative scroll-mt-20 border-t border-[#f47945]/60 bg-[#fffdfb] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="pointer-events-none absolute right-[16%] top-16 hidden h-20 w-20 border-r border-t border-[#f47945] lg:block" />
          <div className="relative mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
            <div className="max-w-[330px]">
              <h2 className="mt-4 text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#151116]">Questions are part of choosing well.</h2>
              <p className="mt-5 text-sm leading-7 text-[#6e6072]">Here are a few practical starting points. If your question is more personal, the admissions team can help you think it through.</p>
              <Link href="/register" className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#4d176e] px-5 py-3 text-xs font-bold text-[#151116] transition hover:bg-[#1f0d2e] hover:text-white">Speak to admissions <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="relative pt-2"><div className="pointer-events-none absolute -right-1 -top-1 h-16 w-16 border-r border-t border-[#f47945]" /><div className="border-t border-[#d9cfdc]">{faqs.map(([question, answer]) => <details key={question} className="group border-b border-[#d9cfdc] py-4 sm:py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 pr-4 text-sm font-semibold tracking-[-0.02em] text-[#151116] marker:hidden sm:text-base"><span>{question}</span><ChevronDown className="h-4 w-4 shrink-0 text-[#6e6072] transition group-open:rotate-180" /></summary><p className="max-w-2xl pt-4 text-sm leading-7 text-[#6e6072]">{answer}</p></details>)}</div></div>
          </div>
        </section>

        </main>

        <footer className="border-t border-white/10 bg-[#1f0d2e] px-5 py-10 text-white sm:px-10 lg:px-[7vw] lg:py-13">
          <div className="mx-auto max-w-[1440px]"><div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.8fr_1.2fr] md:items-start"><div><Link href="#top" className="inline-flex items-center gap-3"><BrandMark className="h-10 w-10" /><span className="text-[11px] font-black uppercase leading-[0.9] tracking-[0.22em] text-[#f6eef9]">LEA<br />LABS</span></Link></div><p className="max-w-[240px] text-sm leading-7 text-[#d7c6df]">Learning, momentum, and meaningful work—held together in one practical space.</p><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7c2aa]">Explore</p><div className="mt-4 space-y-3 text-sm text-[#f6eef9]"><Link className="block transition hover:text-[#f47945]" href="#programmes">Programmes</Link><Link className="block transition hover:text-[#f47945]" href="#how-it-works">How LEA works</Link><Link className="block transition hover:text-[#f47945]" href="#community">Community</Link></div></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7c2aa]">Connect</p><div className="mt-4 space-y-3 text-sm text-[#f6eef9]"><Link className="block transition hover:text-[#f47945]" href="/register">Admissions</Link><Link className="block transition hover:text-[#f47945]" href="/register">Contact LEA</Link><Link className="block transition hover:text-[#f47945]" href="/login">Log in</Link></div></div><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7c2aa]">Stay in the current</p><p className="mt-4 text-sm leading-7 text-[#d7c6df]">Receive programme updates, useful resources, and invitations to upcoming LEA conversations.</p><Link href="/register" className="mt-5 inline-flex items-center gap-2 border-b border-[#f47945] pb-2 text-xs font-bold text-white transition hover:text-[#f47945]">Join the LEA list <ArrowRight className="h-3.5 w-3.5" /></Link></div></div><div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-[#bfa9c8] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span><Link href="#top" className="inline-flex items-center gap-2 font-bold text-white hover:text-[#f47945]">Back to top <ArrowRight className="h-3.5 w-3.5 -rotate-90" /></Link><span>Built for learning in motion.</span></div></div>
        </footer>
    </div>
  );
}
