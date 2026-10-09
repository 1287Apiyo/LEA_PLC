"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Clock3,
  Play,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { TestimonialsRotator } from "@/components/landing/testimonials-rotator";
import { SocialLinks } from "@/components/landing/social-links";
import { APP_NAME } from "@/lib/constants";
import { PROGRAMMES as programmes } from "@/lib/programmes";

const HERO_VIDEO = "/lea-home-coding-hero.mp4";

const HERO_SLIDES = [
  { slug: "software-engineering", title: "Open a world of possibility.", copy: "LEA helps learners across Africa turn curiosity into practical digital confidence through guided programmes, hands-on projects, and support from people who understand the journey. Start with the foundations, practise on real challenges, and build work you can carry into your next opportunity.", cta: "Find your starting point" },
  { slug: "applied-ai", title: "Make AI useful.", copy: "LEA helps you move beyond the hype and use intelligent tools with clarity, care, and practical intent. Explore workflows for research, decision-making, and creative work while keeping human judgement at the centre.", cta: "Explore Applied AI" },
  { slug: "basic-computer-knowledge", title: "Start with confidence.", copy: "LEA gives beginners, children, and families a welcoming first step into digital life. Build confidence with devices, files, the internet, and everyday tools through supportive practice you can carry into learning, school, and home.", cta: "Explore Digital Foundations" },
];

const PROGRAMME_CARD_IMAGES: Record<string, string> = {
  "software-engineering": "/posters/software-engineering-sharp.png",
  "applied-ai": "/posters/applied-ai-sharp.png",
  "basic-computer-knowledge": "/posters/digital-foundations-sharp.png",
};



const steps = [
  ["01", "Orient", "Understand the field, your goals, and a starting point that makes sense."],
  ["02", "Practise", "Turn concepts into working habits through projects and focused challenge."],
  ["03", "Refine", "Use peer and mentor feedback to improve how you approach the work."],
  ["04", "Advance", "Leave with a clearer story about the value you are ready to create."],
];


export default function LandingPage() {
  const [showCourseNotice, setShowCourseNotice] = useState(true);
  const [noticeProgrammeIndex, setNoticeProgrammeIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
    setNoticeProgrammeIndex(daysSinceEpoch % programmes.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % HERO_SLIDES.length), 8000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".landing-page main > section, .landing-page [data-scroll-reveal]"));
    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>(".landing-page [data-scroll-parallax]"));
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | undefined;
    let scrollFrame = 0;

    const updateScrollMotion = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const maxScroll = root.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        root.style.setProperty("--page-scroll-progress", String(progress));

        if (reducedMotion) return;
        const viewportCenter = window.innerHeight / 2;
        parallaxTargets.forEach((target) => {
          const bounds = target.getBoundingClientRect();
          const range = Math.max(viewportCenter + bounds.height / 2, 1);
          const position = Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - viewportCenter) / range));
          target.style.setProperty("--scroll-offset", `${(-position * 16).toFixed(1)}px`);
        });
      });
    };

    window.addEventListener("scroll", updateScrollMotion, { passive: true });
    window.addEventListener("resize", updateScrollMotion);
    updateScrollMotion();

    if (!reducedMotion && targets.length && "IntersectionObserver" in window) {
      const viewportHeight = window.innerHeight;
      targets.forEach((target) => {
        const bounds = target.getBoundingClientRect();
        target.classList.toggle("is-visible", bounds.top < viewportHeight * 0.9 && bounds.bottom > 0);
      });

      root.classList.add("has-scroll-reveal");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      targets.forEach((target) => observer?.observe(target));
    }

    return () => {
      observer?.disconnect();
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", updateScrollMotion);
      window.removeEventListener("resize", updateScrollMotion);
      root.classList.remove("has-scroll-reveal");
      root.style.removeProperty("--page-scroll-progress");
      parallaxTargets.forEach((target) => target.style.removeProperty("--scroll-offset"));
    };
  }, []);

  const noticeProgramme = programmes[noticeProgrammeIndex] ?? programmes[0];
  const activeHero = HERO_SLIDES[heroIndex];

  return (
    <div id="top" className="landing-page min-h-screen overflow-hidden bg-[#fffdfb] text-[#26142f] selection:bg-[#f47945]/25">
        <div aria-hidden="true" className="lea-scroll-progress"><span /></div>
        {showCourseNotice && (
          <aside className="relative z-[60] flex min-h-[44px] items-center bg-[#4d176e] px-5 py-1.5 text-white sm:px-10 lg:px-[7vw]" aria-label={`${noticeProgramme.title} course announcement`}>
            <div className="mx-auto flex w-full max-w-[1440px] items-center gap-5 pr-8 text-[10px] sm:gap-7 sm:text-xs">
              <a href="mailto:lealabsplc@gmail.com" className="hidden items-center gap-2 whitespace-nowrap text-white/85 transition hover:text-white lg:inline-flex"><Mail className="h-3.5 w-3.5 text-[#f47945]" /> lealabsplc@gmail.com</a>
              <span className="hidden items-center gap-2 whitespace-nowrap text-white/85 sm:inline-flex"><span className="text-[#f47945]">●</span> Mon–Fri 8:00 am – 5:00 pm EAT</span>
              <p className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">{noticeProgramme.title}</p>
              <Link href={`/programmes/${noticeProgramme.slug}`} className="inline-flex h-7 shrink-0 items-center gap-1 rounded-sm bg-[#f47945] px-3 text-[10px] font-black text-[#351039] transition hover:bg-[#ff8f57] sm:px-4 sm:text-xs">Enroll <ArrowRight className="h-3 w-3" /></Link>
              <button type="button" onClick={() => setShowCourseNotice(false)} className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] sm:right-6" aria-label="Dismiss Software Engineering announcement">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>
        )}

      <LandingNav />

      <main>

        {/* HERO — one clear coding video, with programme messages rotating over it */}
        <section className="relative h-[620px] min-h-[620px] overflow-hidden bg-[#12091a] text-white sm:h-auto sm:min-h-[680px] lg:min-h-[720px]">
          <div aria-hidden="true" data-scroll-parallax className="absolute inset-0">
            <video className="absolute inset-0 h-full w-full object-cover object-[70%_center]" autoPlay loop muted playsInline preload="auto" aria-hidden="true"><source src={HERO_VIDEO} type="video/mp4" /></video>
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,18,20,0.88)_0%,rgba(15,18,20,0.58)_34%,rgba(15,18,20,0.08)_72%,rgba(15,18,20,0.16)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,18,20,0.66)_0%,transparent_45%),radial-gradient(circle_at_55%_60%,rgba(244,121,69,0.1),transparent_30%)]" />
          <div aria-hidden="true" className="lea-float-orb pointer-events-none absolute right-[13%] top-[22%] hidden h-20 w-20 rounded-full border border-white/20 bg-white/5 lg:block" />
          <div aria-hidden="true" className="lea-float-orb lea-float-orb-delay pointer-events-none absolute bottom-[24%] right-[28%] hidden h-10 w-10 rounded-full border border-[#f47945]/40 bg-[#f47945]/10 lg:block" />
          <div className="relative flex h-full min-h-0 items-start justify-start px-5 pb-20 pt-24 sm:h-auto sm:min-h-[680px] sm:items-end sm:px-10 sm:pb-44 sm:pt-0 lg:min-h-[720px] lg:px-[7vw] lg:pb-48">
            <div className="mx-auto mr-auto w-full max-w-[1440px]">
              <div key={activeHero.slug} data-scroll-reveal className="lea-slide-content-enter w-full max-w-[900px]">
              <h1 className="lea-stagger-2 mt-0 w-full text-[clamp(1.1rem,5.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.055em] text-white whitespace-nowrap">
                {activeHero.title}
              </h1>
              <p key={`${activeHero.slug}-copy`} className="lea-stagger-2 mt-6 max-w-[560px] text-sm leading-7 text-white/80 sm:text-base">{activeHero.copy}</p>
              <div className="lea-stagger-3 mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/programmes/${activeHero.slug}`} className="inline-flex h-11 items-center gap-3 rounded-full border border-[#f47945] bg-[#f47945] px-6 text-xs font-bold text-[#351039] transition hover:border-white hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12091a]">{activeHero.cta} <ArrowDownRight className="h-4 w-4" /></Link>
                <Link href="#programmes" className="inline-flex items-center gap-2 border-b border-white/45 pb-1 text-xs font-bold text-white transition hover:border-[#f47945] hover:text-[#f47945]">Explore programmes <span aria-hidden>↗</span></Link>
              </div>
              <div className="mt-8 flex items-center gap-2" aria-label="Hero programme slides">{HERO_SLIDES.map((slide, index) => <button key={slide.slug} type="button" onClick={() => setHeroIndex(index)} aria-label={`Show ${slide.title}`} aria-current={heroIndex === index ? "true" : undefined} className={`h-1.5 rounded-full transition-all ${heroIndex === index ? "w-10 bg-[#f47945]" : "w-5 bg-white/40 hover:bg-white/70"}`} />)}</div>
            </div>
          </div>
        </div>
        </section>


        <section id="programmes" className="relative scroll-mt-20 overflow-hidden bg-[#fffdfb] px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="relative mx-auto max-w-[1440px]">
            <div data-scroll-reveal className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><h2 className="max-w-[620px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#151116]">Choose a practical path forward.</h2></div><p className="max-w-[460px] text-sm leading-7 text-[#6e6072]">Choose between <span className="font-semibold text-[#1f0d2e]">Software Engineering</span>, <span className="font-semibold text-[#1f0d2e]">Applied AI</span>, and <span className="font-semibold text-[#1f0d2e]">Digital Foundations</span> for beginners, children, and families.</p></div>
            <div className="mt-8 -mx-5 overflow-hidden px-5 pb-3 md:mx-0 md:px-0 md:pb-0 lg:mt-10"><div className="flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible md:snap-none">{programmes.map((programme, index) => <Link key={programme.title} data-scroll-reveal data-scroll-delay={index + 1} href={`/programmes/${programme.slug}`} className="group w-[calc(100vw-2.5rem)] min-w-[calc(100vw-2.5rem)] shrink-0 basis-[calc(100vw-2.5rem)] snap-start overflow-hidden rounded-[26px] border border-[#f47945]/75 bg-[#1f0d2e] shadow-[0_18px_45px_rgba(31,13,46,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(31,13,46,0.16)] md:min-w-0 md:w-auto md:basis-auto md:shrink"><div className="relative aspect-[4/5] overflow-hidden bg-[#1f0d2e]"><Image src={PROGRAMME_CARD_IMAGES[programme.slug] ?? programme.image} alt={`${programme.title} programme`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="flex min-h-[160px] flex-col p-4 sm:p-5"><h3 className="text-base font-bold leading-tight tracking-[-0.02em] text-[#f7c2aa]">{programme.title}</h3><p className="mt-2 text-xs leading-5 text-white/85">{programme.short}</p><span className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f47945] px-5 text-xs font-black text-[#351039] transition group-hover:bg-[#ff8f57]">View programme <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div></div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1f0d2e] md:hidden">Swipe to explore →</p>
            <div data-scroll-reveal className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#6e6072]"><span>Practical learning, whatever your starting point.</span><span>Three pathways. One clear next step.</span></div>
          </div>
        </section>

        <section id="how-it-works" className="relative isolate scroll-mt-20 overflow-hidden px-5 py-12 text-[#f47945] sm:px-10 sm:py-12 lg:flex lg:min-h-[540px] lg:items-center lg:px-[7vw] lg:py-12">
          <div aria-hidden="true" data-scroll-parallax className="lea-scroll-image pointer-events-none absolute inset-0 z-0">
            <Image src="/lea-community-learners.jpeg" alt="" fill sizes="100vw" className="object-cover blur-[26px] brightness-[0.52] saturate-[0.68]" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div data-scroll-parallax className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
            <div data-scroll-reveal data-reveal="left" className="flex flex-col justify-center">
              <h2 className="mt-0 max-w-[500px] text-[clamp(1.85rem,3vw,2.9rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-white">Your next move<br /><span className="text-white">is more than a</span><br />course</h2>
              <p className="mt-5 max-w-[470px] text-sm leading-7 text-white/90 sm:text-base sm:leading-8">LEA is designed as a practical sequence: find a fit, make the work, gather feedback, and shape a direction you can carry beyond the classroom.</p>
              <Link href="/register" className="mt-7 inline-flex h-12 w-fit items-center gap-3 rounded-xl bg-[#f47945] px-5 text-sm font-bold text-[#1f0d2e] shadow-[0_10px_24px_rgba(244,121,69,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f0d2e]">Start the conversation <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div data-scroll-reveal data-reveal="right" className="relative p-4 sm:p-6 lg:p-8">
              <span aria-hidden="true" className="absolute bottom-9 left-9 top-9 w-px bg-[#f47945] sm:bottom-11 sm:left-11 sm:top-11 lg:bottom-[52px] lg:left-[52px] lg:top-[52px]" />
              <ol className="relative space-y-4">
                {steps.map(([number, title, text]) => (
                  <li key={number} data-scroll-reveal data-reveal="right" data-scroll-delay={Number(number)} className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4 motion-safe:transition-transform motion-safe:hover:translate-x-1">
                    <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[11px] font-bold tracking-[0.08em] text-[#f47945] ring-1 ring-[#1f0d2e]/10">{number}</span>
                    <div>
                      <h3 className="text-base font-bold tracking-[-0.02em] text-[#f47945] sm:text-lg">{title}</h3>
                      <p className="mt-2 max-w-[42ch] text-xs leading-5 text-white sm:text-sm sm:leading-6">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="site-tour" className="scroll-mt-20 bg-white px-5 py-14 text-[#151116] sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div data-scroll-parallax className="relative mx-auto max-w-[1440px] rounded-[32px] border border-[#eee3e9] bg-white p-5 shadow-[0_24px_70px_rgba(31,13,46,0.06)] sm:p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
              <div data-scroll-reveal data-reveal="left" className="max-w-[420px]">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f47945]">Inside the LEA platform</p>
                <h2 className="mt-4 max-w-[390px] text-[clamp(1.9rem,3vw,3.25rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#151116]">See how the learning journey works.</h2>
                <p className="mt-5 max-w-[390px] text-sm leading-7 text-[#5f5265] sm:text-base">Take a step-by-step tour of the real LEA homepage, programme choices, and learner dashboard. The dashboard screen uses clearly representative sample data, not a live learner account.</p>
                <ol className="mt-7">
                  {[
                    ["01", "Start at the homepage", "See where to begin"],
                    ["02", "Browse the programmes", "Compare learning paths"],
                    ["03", "Find the holiday bootcamp", "Digital Scratch Programming"],
                    ["04", "Open the learner dashboard", "Courses and next steps"],
                  ].map(([number, title, detail]) => (
                    <li key={number} className="group grid grid-cols-[30px_1fr_auto] items-center gap-3 rounded-xl border-b border-[#f0e8e5] px-2 py-3 transition duration-300 hover:translate-x-1">
                      <span className="text-[10px] font-black text-[#f47945]">{number}</span>
                      <span className="text-xs font-bold text-[#241b42] transition-colors duration-300 group-hover:text-[#f47945]">{title}</span>
                      <span className="text-right text-[10px] text-[#7b6d80]">{detail}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f6075]"><span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-[#f47945]" /> 00:22 platform tour</span><span className="inline-flex items-center gap-2"><Play className="h-3.5 w-3.5 text-[#4d176e]" /> Real screens · sample data</span></div>
                <Link href="#tour-video" className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-3 text-xs font-black text-[#351039] shadow-[0_12px_24px_rgba(244,121,69,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6eef9]">Watch the platform tour <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div data-scroll-reveal data-reveal="right" className="relative">
                <div id="tour-video" className="relative overflow-hidden rounded-[28px] border border-[#4d176e]/25 bg-[#12091a] p-2 shadow-[0_28px_70px_rgba(77,23,110,0.22)] sm:p-3">
                  <div className="flex items-center justify-end px-3 py-2 text-[10px] text-[#cdb7d5]"><span className="tracking-[0.16em]">REAL LEA SCREENS · STEP BY STEP</span></div>
                  <video className="aspect-video w-full rounded-[20px] bg-[#1f0d2e] object-cover" controls playsInline preload="metadata" poster="/lea-real-site-tour-poster.png" aria-label="A step-by-step tour of the actual LEA homepage, programmes, holiday bootcamp and learner dashboard; dashboard values are sample data.">
                    <source src="/lea-real-site-walkthrough.webm" type="video/webm" />
                    Your browser does not support the LEA Labs site-tour video. <Link href="#programmes" className="text-[#f47945]">Explore the programmes instead.</Link>
                  </video>
                  <div className="flex flex-col gap-3 px-3 pt-3 text-[10px] text-[#cdb7d5] sm:flex-row sm:items-center sm:justify-between"><span>Actual LEA pages and learner dashboard components</span><span className="text-[#f47945]">Sample learner data · no live account</span></div>
                  <div className="mt-4 grid gap-2 px-3 pt-3 sm:grid-cols-3"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f47945]">01</p><p className="mt-1 text-xs font-semibold text-white">Browse the site</p></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f47945]">02</p><p className="mt-1 text-xs font-semibold text-white">Choose a programme</p></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f47945]">03</p><p className="mt-1 text-xs font-semibold text-white">Follow your progress</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden px-5 pb-8 pt-16 text-white sm:px-10 sm:pb-10 sm:pt-18 lg:px-[7vw] lg:pb-12 lg:pt-22">
          <div aria-hidden="true" data-scroll-parallax className="lea-scroll-image pointer-events-none absolute inset-0 z-0">
            <Image src="/lea-card-computers-african.jpeg" alt="" fill sizes="100vw" className="object-cover blur-[26px] brightness-[0.52] saturate-[0.68]" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div data-scroll-parallax className="relative z-10 mx-auto grid max-w-[1440px] items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h2 data-scroll-reveal data-reveal="left" className="mt-4 max-w-[590px] text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white"><span className="text-white">The work matters.</span> <span className="text-white">So does the person doing it.</span></h2>
              <p data-scroll-reveal data-reveal="left" className="mt-5 max-w-[620px] text-sm leading-7 text-white/80 sm:text-base">Learning is more durable when someone can challenge your thinking, celebrate the progress, and help you connect a project to the direction you are building toward.</p>
            </div>
            <div data-scroll-reveal data-reveal="right" className="relative flex items-start justify-start lg:justify-end lg:pt-0"><TestimonialsRotator /></div>
          </div>
        </section>

        <section id="community" className="scroll-mt-20 bg-white px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div data-scroll-parallax className="relative mx-auto grid max-w-[1280px] items-center gap-8 rounded-[32px] border border-[#eee3e9] bg-white p-5 shadow-[0_24px_70px_rgba(31,13,46,0.06)] sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:p-10">
            <div data-scroll-reveal data-reveal="left" className="group relative mx-auto aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(36,16,43,0.16)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_32px_72px_rgba(36,16,43,0.24)] focus-within:-translate-y-1">
              <Image src="/posters/scratch-bootcamp-sharp.png" alt="LEA Labs Scratch Programming Bootcamp holiday poster with the full programme price of KES 25,000." fill sizes="(min-width: 1024px) 500px, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div data-scroll-reveal data-reveal="right" className="max-w-[600px] lg:py-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#f47945]">Holiday bootcamp</p>
              <h2 className="mt-3 max-w-[18ch] text-[clamp(1.5rem,2.3vw,2.35rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[#151116]">Digital Scratch Programming</h2>
              <p className="mt-4 max-w-[54ch] text-sm leading-6 text-[#6e6072]">During the school holidays, learners use Scratch to turn ideas into interactive stories, animations, and simple games—one practical project at a time.</p>
              <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-[#f1ded5] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#6e6072]">Full programme</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-[#4d176e] sm:text-[1.35rem]">KES 25,000</p>
                </div>
                <p className="max-w-[28ch] text-xs leading-5 text-[#6e6072] sm:text-right">Covers the full programme.</p>
              </div>
              <Link href="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f47945] px-5 py-3 text-xs font-semibold text-[#1f0d2e] shadow-[0_12px_24px_rgba(244,121,69,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2">Register your interest <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>


        </main>

        <footer className="bg-[#1f0d2e] px-5 py-8 text-white sm:px-10 lg:px-[7vw] lg:py-9">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div data-scroll-reveal className="flex flex-col items-start gap-2 text-xs leading-5 text-[#d7c6df]">
                <div className="inline-flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f47945]" strokeWidth={2} aria-hidden="true" /><span>Applewood Adams, 13th Floor</span></div>
                <a className="inline-flex items-center gap-2 transition hover:text-white" href="tel:0729929101"><Phone className="h-3.5 w-3.5 text-[#f47945]" strokeWidth={2} aria-hidden="true" />0729 929101</a>
                <a className="inline-flex items-center gap-2 transition hover:text-white" href="mailto:lealabsplc@gmail.com"><Mail className="h-3.5 w-3.5 text-[#f47945]" strokeWidth={2} aria-hidden="true" />lealabsplc@gmail.com</a>
                <div className="mt-5"><SocialLinks /></div>
              </div>
              <div data-scroll-reveal className="flex flex-col items-start gap-4">
                <div className="text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f6eef9]">LEA Labs</p>
                  <p className="mt-2 text-xs leading-6 text-[#d7c6df]">Practical learning for digital work.</p>
                </div>
                <Link className="inline-flex items-center gap-2 self-start bg-[#f47945] px-5 py-3 text-xs font-semibold text-[#351039] transition hover:bg-white" href="/register">Get started <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            </div>
            <div data-scroll-reveal className="mt-6 border-t border-white/10 pt-4 text-[11px] text-[#bfa9c8]">
              <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
            </div>
          </div>
        </footer>
    </div>
  );
}
