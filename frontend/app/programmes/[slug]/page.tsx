import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Sparkles, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { SoftwareLevelSelector } from "@/components/landing/software-level-selector";
import { getProgramme, PROGRAMMES, type CurriculumItem } from "@/lib/programmes";

type ProgrammePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROGRAMMES.map((programme) => ({ slug: programme.slug }));
}

export async function generateMetadata({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  return {
    title: programme ? `${programme.title} | LEA Labs` : "Programme | LEA Labs",
    description: programme?.overview,
  };
}

type IntakeOption = { title: string; mode: string; level?: string; duration?: string; price?: string };

const PROGRAMME_CARD_IMAGES: Record<string, string> = {
  "software-engineering": "/lea-home-program-software.png",
  "applied-ai": "/lea-home-program-ai.png",
  "basic-computer-knowledge": "/lea-home-program-computers.png",
};

const HYBRID_SURCHARGE: Record<string, string> = {
  "software-engineering": "KES 45,000",
  "applied-ai": "KES 40,000",
  "basic-computer-knowledge": "KES 30,000",
};

function getIntakeOptions(slug: string): IntakeOption[] {
  return [
    { title: "Full-time Hybrid", mode: "Online + in-person classes | Mon–Fri | 8am–5pm EAT", price: HYBRID_SURCHARGE[slug] },
    { title: "Full-time Remote", mode: "100% online classes | Mon–Fri | 8am–5pm EAT" },
    { title: "Part-time Remote", mode: "100% online classes | Mon–Fri | 6pm–9pm EAT" },
  ];
}

type SoftwareFormat = { format: string; schedule: string; price: string };
type SoftwareLevel = { level: string; title: string; description: string; duration: string; formats: SoftwareFormat[] };

const SOFTWARE_LEVELS: SoftwareLevel[] = [
  { level: "Beginner", title: "Foundation Track", description: "A welcoming starting point for learners building their first confident software-development habits.", duration: "12 weeks", formats: [
    { format: "Full-time Hybrid", schedule: "Online + in-person | Mon–Fri | 8am–5pm EAT", price: "KES 45,000" },
    { format: "Full-time Remote", schedule: "100% online | Mon–Fri | 8am–5pm EAT", price: "KES 40,000" },
    { format: "Part-time Remote", schedule: "100% online | Mon–Fri | 6pm–9pm EAT", price: "KES 40,000" },
  ] },
  { level: "Intermediate", title: "Professional Builder", description: "A structured route for learners ready to build complete products through focused practice and a 16-week project journey.", duration: "16 weeks", formats: [
    { format: "Full-time Hybrid", schedule: "Online + in-person | Mon–Fri | 8am–5pm EAT", price: "KES 50,000" },
    { format: "Full-time Remote", schedule: "100% online | Mon–Fri | 8am–5pm EAT", price: "KES 45,000" },
    { format: "Part-time Remote", schedule: "100% online | Mon–Fri | 6pm–9pm EAT", price: "KES 45,000" },
  ] },
  { level: "Advanced", title: "Advanced Product Engineer", description: "A demanding, project-led pathway for learners ready to deepen their engineering judgement and ship stronger digital products.", duration: "16 weeks", formats: [
    { format: "Full-time Hybrid", schedule: "Online + in-person | Mon–Fri | 8am–5pm EAT", price: "KES 55,000" },
    { format: "Full-time Remote", schedule: "100% online | Mon–Fri | 8am–5pm EAT", price: "KES 50,000" },
    { format: "Part-time Remote", schedule: "100% online | Mon–Fri | 6pm–9pm EAT", price: "KES 50,000" },
  ] },
];

function curriculumExplanation(item: CurriculumItem, programmeSlug: string) {
  if (item.type === "break") return item.summary;
  if (programmeSlug === "software-engineering") {
    if (item.title.toLowerCase().includes("frontend")) return "This stage takes learners from the structure of a web page into confident frontend practice. You will work with semantic HTML, CSS, responsive layouts, accessibility, component thinking, and the habits needed to test an interface across real devices before moving on to application behaviour and backend services.";
    if (item.title.toLowerCase().includes("backend")) return "This stage explains the systems behind a digital product. You will build routes and services, work with data, validation, authentication concepts, and error handling, then understand how a backend communicates with the frontend to support a secure and dependable product.";
    if (item.title.toLowerCase().includes("full-stack")) return "This stage connects the interface, application behaviour, APIs, and backend into one working product. You will practise moving data through the full system, handling forms and states, testing the important flows, and preparing the project for deployment with confidence.";
  }
  return item.summary;
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();

  const titleWords = programme.title.split(" ");
  const titleLead = titleWords[0];
  const titleRest = titleWords.slice(1).join(" ");
  const curriculumModuleCount = programme.curriculum.filter((item) => item.type !== "break").length;
  const isSoftwareProgramme = programme.slug === "software-engineering";
  const intakeOptions = getIntakeOptions(slug);
  const heroPosition = programme.slug === "basic-computer-knowledge" ? "70% center" : "center";
  const programmeCardImage = PROGRAMME_CARD_IMAGES[programme.slug] ?? programme.image;

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#4d176e]/20">
      <div className="hidden bg-[#4d176e] px-5 py-2 text-xs font-semibold text-white/90 sm:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"><span>Learn with purpose · Build with confidence</span><span className="text-white/70">LEA Labs learning programmes</span></div>
      </div>
      <LandingNav />
      <main>
        <section className="relative isolate overflow-hidden bg-[#1f0d2e] text-white">
          <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: `url(${programme.image})`, backgroundPosition: heroPosition }} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#1f0d2e] via-[#1f0d2e]/90 to-[#1f0d2e]/35" />
          <div className="relative mx-auto grid min-h-[520px] max-w-[1440px] items-center gap-10 px-5 py-14 sm:px-10 lg:grid-cols-[1.08fr_.92fr] lg:px-[7vw] lg:py-16">
            <div className="max-w-[680px]">
              <Link href="/#programmes" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-[#f47945]"><ArrowLeft className="h-4 w-4" /> Back to programmes</Link>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f47945]">{programme.eyebrow}</p>
              <h1 className="mt-4 text-[clamp(2.5rem,6vw,5.8rem)] font-normal leading-[.92] tracking-[-0.075em] text-white">{titleLead}{titleRest ? <> <span className="text-[#f47945]">{titleRest}</span></> : null}</h1>
              <p className="mt-6 max-w-[620px] text-base leading-8 text-white/80 sm:text-lg">{programme.overview}</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="#enrol" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-6 py-3 text-sm font-black text-[#351039] shadow-[0_12px_28px_rgba(244,121,69,.25)] transition hover:bg-[#ff8f57]">Start your application <ArrowRight className="h-4 w-4" /></Link><Link href="#modules" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">View curriculum</Link></div>
            </div>
            <div className="relative hidden lg:block">
              <div className="overflow-hidden rounded-[28px] border border-white/25 bg-white/10 p-3 shadow-2xl backdrop-blur-sm"><img src={programmeCardImage} alt={`${programme.title} programme`} className="h-[320px] w-full rounded-[20px] object-cover" /><div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4"><span className="text-sm font-semibold text-white/80">{programme.outcome}</span><Sparkles className="h-5 w-5 shrink-0 text-[#f47945]" /></div></div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-8 max-w-[1440px] px-5 sm:px-10 lg:px-[7vw]">
          <div className="grid overflow-hidden rounded-[20px] border border-[#4d176e]/10 bg-white shadow-[0_18px_45px_rgba(77,23,110,.12)] sm:grid-cols-3">
            {[{ icon: Clock3, label: "Duration", value: programme.duration }, { icon: CalendarDays, label: "Next intake", value: "October 1st, 2026" }, { icon: Users, label: "Learning format", value: programme.format }].map(({ icon: Icon, label, value }) => <div key={label} className="flex items-center gap-4 border-b border-[#4d176e]/10 px-5 py-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0ea] text-[#f47945]"><Icon className="h-5 w-5" /></div><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#6e6072]">{label}</p><p className="mt-1 text-sm font-semibold text-[#351039]">{value}</p></div></div>)}
          </div>
        </section>

        <section className="px-5 pb-14 pt-16 sm:px-10 sm:pb-20 lg:px-[7vw]">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <div className="mb-8 flex border-b border-[#d9cbdc]" role="tablist" aria-label="Programme sections"><a href="#about" className="border-b-2 border-[#f47945] px-4 pb-4 text-sm font-black text-[#351039]">About this programme</a><a href="#modules" className="px-4 pb-4 text-sm font-semibold text-[#6e6072] transition hover:text-[#4d176e]">Curriculum</a></div>
              <div id="about" className="scroll-mt-28">
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#f47945]">The LEA learning experience</p>
                <h2 className="mt-3 max-w-[720px] text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[.98] tracking-[-.06em] text-[#17131a]">A practical pathway for <span className="text-[#4d176e]">real progress.</span></h2>
                <p className="mt-6 max-w-[760px] text-base leading-8 text-[#6e6072]">{programme.overview} {programme.outcome}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">{programme.bullets.map((bullet) => <div key={bullet} className="rounded-xl border border-[#4d176e]/12 bg-white p-4 shadow-[0_8px_24px_rgba(77,23,110,.05)]"><Check className="h-5 w-5 text-[#f47945]" /><p className="mt-3 text-sm font-semibold text-[#351039]">{bullet}</p></div>)}</div>
              </div>
            </div>

            <aside id="enrol" className="scroll-mt-28 rounded-[22px] border border-[#4d176e]/15 bg-white p-6 shadow-[0_16px_42px_rgba(77,23,110,.12)] lg:sticky lg:top-28"><p className="text-xs font-black uppercase tracking-[.2em] text-[#f47945]">Join this programme</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-[#351039]">Start learning today</h2><p className="mt-3 text-sm leading-6 text-[#6e6072]">Choose the format that fits your season. Our admissions team can help you take the next step.</p><div className="mt-6 border-y border-[#4d176e]/12 py-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[#351039]">From</span><span className="text-xl font-black text-[#4d176e]">{programme.price}</span></div><p className="mt-2 text-xs leading-5 text-[#6e6072]">{programme.priceNote}</p></div><Link href="/register" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f47945] px-5 text-sm font-black text-[#351039] transition hover:bg-[#ff8f57]">Apply now <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#4d176e]/20 px-5 text-sm font-bold text-[#4d176e] transition hover:bg-[#f8f3fa]">Already enrolled? Sign in</Link></aside>
          </div>
        </section>

        <section className="bg-[#f8f3fa] px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20" id="formats">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="text-xs font-black uppercase tracking-[.2em] text-[#f47945]">Flexible ways to learn</p><h2 className="mt-2 text-[clamp(1.8rem,3vw,3rem)] font-normal leading-none tracking-[-.05em]">Choose your <span className="text-[#4d176e]">learning rhythm.</span></h2></div>
              <p className="max-w-[430px] text-sm leading-6 text-[#6e6072]">Pick the rhythm that gives you the clearest space to learn, practise, and keep moving.</p>
            </div>
            {isSoftwareProgramme ? <SoftwareLevelSelector levels={SOFTWARE_LEVELS} /> : <div className="grid gap-5 lg:grid-cols-3">{intakeOptions.map((intake) => <article key={intake.title} className="flex min-h-[300px] flex-col rounded-[18px] border border-[#4d176e]/15 bg-white p-6 shadow-[0_10px_24px_rgba(77,23,110,.05)]"><h3 className="text-lg font-semibold text-[#17131a]">{intake.title}</h3><p className="mt-4 text-sm leading-6 text-[#6e6072]">{intake.mode}</p>{intake.title === "Full-time Hybrid" && <p className="mt-3 text-xs font-semibold leading-5 text-[#4d176e]">Physical classes: Applewood Adams, 13th Floor, Ngong Road, Nairobi.</p>}<div className="mt-auto border-t border-[#4d176e]/12 pt-5"><div className="flex justify-between gap-3 text-sm"><span className="text-[#6e6072]">Starts</span><strong className="text-[#351039]">October 1st, 2026</strong></div><div className="mt-2 flex justify-between gap-3 text-sm"><span className="text-[#6e6072]">Tuition</span><strong className="text-[#4d176e]">{intake.price ?? programme.price}</strong></div><Link href="/register" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#f47945] text-sm font-black text-[#351039]">Apply <ArrowRight className="ml-2 h-4 w-4" /></Link></div></article>)}</div>}
          </div>
        </section>

        <section id="modules" className="scroll-mt-20 bg-white px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20"><div className="mx-auto max-w-[1440px]"><div className="mb-8 border-t border-[#d9cbdc] pt-8"><p className="text-[11px] font-black uppercase tracking-[.2em] text-[#f47945]">Inside the pathway</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><h3 className="text-[clamp(1.8rem,3vw,3rem)] font-normal tracking-[-.05em]">Curriculum <span className="text-[#4d176e]">breakdown.</span></h3><div className="text-sm text-[#6e6072]">{curriculumModuleCount} {curriculumModuleCount === 1 ? "module" : "modules"} · {programme.curriculum.filter((item) => item.type === "break").length} break included</div></div></div><div className="space-y-4">{programme.curriculum.map((item) => <details key={`${programme.slug}-${item.number}-${item.title}`} className={`group overflow-hidden rounded-[18px] border bg-white shadow-[0_10px_24px_rgba(77,23,110,.05)] transition-shadow hover:shadow-[0_16px_34px_rgba(77,23,110,.1)] ${item.type === "break" ? "border-dashed border-[#4d176e]/35" : "border-[#4d176e]/15"}`}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 transition hover:bg-[#f8f3fa] sm:px-8 sm:py-6 [&::-webkit-details-marker]:hidden"><div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-[.16em] text-[#6e6072]">{item.weeks}</p><h4 className="mt-1 text-base font-medium tracking-[-.03em] text-[#17131a] sm:text-lg">{item.title}</h4></div><ChevronDown className="h-5 w-5 shrink-0 text-[#6e6072] transition duration-300 group-open:rotate-180" /></summary><div className="border-t border-[#eadfe9] bg-white px-5 py-6 sm:px-8 sm:py-7"><p className="max-w-[980px] text-base leading-8 text-[#6e6072]">{curriculumExplanation(item, programme.slug)}</p>{item.project ? <div className="mt-5 rounded-xl border border-[#f47945]/30 bg-[#fff8f3] p-4 sm:p-5"><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b94920]">Build project</p><p className="mt-2 text-sm font-semibold leading-6 text-[#351039]">{item.project}</p></div> : null}{item.topics.length > 0 && <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6e6072]"><span className="font-semibold text-[#351039]">Covers:</span>{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>}</div></details>)}</div></div></section>
      </main>
      <LandingFooter />
    </div>
  );
}

// Intake and curriculum content intentionally remain driven by lib/programmes.ts so this page can evolve without duplicating programme copy.
