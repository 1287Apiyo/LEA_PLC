import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, Laptop, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { courseBelongsToProgramme, loadLiveCatalogueSafely, type LiveCatalogueCourse } from "@/lib/firebase/catalogue";
import { getProgramme, PROGRAMMES } from "@/lib/programmes";

type ProgrammePageProps = { params: Promise<{ slug: string }> };

type DisplayModule = {
  id: string;
  number: string;
  title: string;
  summary: string;
  price: string;
  lessonCount: number;
  lessonTitles: string[];
  durationMinutes: number;
  live: boolean;
};

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

function minutesLabel(minutes: number) {
  if (!minutes) return "Self-paced practice";
  return `${minutes} min of guided content`;
}

function toDisplayModule(module: LiveCatalogueCourse, index: number): DisplayModule {
  return {
    id: module.id,
    number: String(index + 1).padStart(2, "0"),
    title: module.title,
    summary: module.summary,
    price: module.price || "Included in programme",
    lessonCount: module.lessonCount,
    lessonTitles: module.lessonTitles,
    durationMinutes: module.durationMinutes,
    live: true,
  };
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();

  const liveCatalogue = await loadLiveCatalogueSafely();
  const liveModules = liveCatalogue.courses
    .filter((course) => courseBelongsToProgramme(course, programme))
    .map(toDisplayModule);
  const fallbackModules: DisplayModule[] = programme.modules.map((module) => ({
    ...module,
    id: `${programme.slug}-${module.number}`,
    lessonCount: 0,
    lessonTitles: [],
    durationMinutes: 0,
    live: false,
  }));
  const displayModules = liveModules.length > 0 ? liveModules : fallbackModules;
  const usesLiveModules = liveModules.length > 0;

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />
      <main>
        <section className="relative overflow-hidden bg-[#f6eef9] px-5 pb-12 pt-7 sm:px-10 sm:pb-16 sm:pt-8 lg:px-[7vw] lg:pb-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#4d176e]/10" />
          <div className="mx-auto max-w-[1440px]">
            <Link href="/#programmes" className="inline-flex items-center gap-2 text-xs font-medium text-[#4d176e] transition hover:text-[#f47945]"><ArrowLeft className="h-4 w-4" /> Back to programmes</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
              <div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f47945] text-xs font-medium text-[#351039]">{programme.number}</div>
                <h1 className="max-w-[650px] text-[clamp(2.15rem,4vw,4.2rem)] font-medium leading-[0.94] tracking-[-0.065em] text-[#151116]">{programme.title}</h1>
                <p className="mt-5 max-w-[550px] text-sm leading-7 text-[#6e6072]">{programme.overview}</p>
                <div className="mt-6 flex flex-wrap gap-3"><Link href="#modules" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#ff8f57]">Explore live curriculum <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-[#4d176e]/25 px-5 py-3 text-xs font-medium text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">Sign in to start <span aria-hidden>↗</span></Link></div>
              </div>
              <div className="relative min-h-[280px] overflow-hidden rounded-[24px] border border-[#d9cbdc] bg-white shadow-[0_22px_70px_rgba(77,23,110,0.12)] sm:min-h-[350px]"><img src={programme.image} alt={`${programme.title} learning experience`} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#351039]/80 via-transparent to-transparent" /><div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-5 text-white sm:p-6"><div><div className="text-xl font-medium tracking-[-0.04em]">{programme.outcome}</div></div><span className="hidden text-6xl font-medium text-white/80 sm:block">{programme.icon}</span></div></div>
            </div>
          </div>
        </section>

        <section id="modules" className="scroll-mt-20 px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <div>
              <h2 className="max-w-[440px] text-[clamp(1.75rem,2.7vw,2.9rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#151116]"><span className="text-[#4d176e]">Build one useful layer</span> <span className="text-[#f47945]">at a time.</span></h2>
              <p className="mt-4 max-w-[420px] text-sm leading-7 text-[#6e6072]">Every course is designed around practice, guidance, and a clear outcome you can carry into the next stage.</p>
              <div className="mt-6 inline-flex items-center gap-3 text-xs font-medium text-[#6e6072]"><Laptop className="h-4 w-4 text-[#f47945]" /> Practical, guided learning</div>
              <div className="mt-5 grid max-w-[560px] gap-4 border-t border-[#eadfe9] pt-4 sm:grid-cols-3"><div><div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a748e]">Duration</div><div className="mt-1 text-xs font-medium leading-5 text-[#4d176e]">{programme.duration}</div></div><div><div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a748e]">Format</div><div className="mt-1 text-xs font-medium leading-5 text-[#4d176e]">{programme.format}</div></div><div><div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a748e]">Best for</div><div className="mt-1 text-xs leading-5 text-[#6e6072]">{programme.audience}</div></div></div>
            </div>
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-[#eadfe9] py-3"><div className="text-xs font-medium text-[#17131a]">{usesLiveModules ? "Live curriculum" : "Programme outline"}</div><div className="text-[11px] text-[#8a748e]">{displayModules.length} {displayModules.length === 1 ? "course" : "courses"} · {usesLiveModules ? "from the LEA learning catalogue" : "admissions outline"}</div></div>
              <div className="grid gap-4 sm:grid-cols-2">{displayModules.map((module) => <Link key={module.id} href="/login" className="group flex min-h-[285px] flex-col rounded-[22px] border border-[#d9cbdc] bg-white p-5 shadow-[0_14px_35px_rgba(77,23,110,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#f47945] hover:shadow-[0_20px_48px_rgba(77,23,110,0.12)] sm:p-6"><div className="flex items-start justify-between gap-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f47945] text-[11px] font-medium text-[#351039]">{module.number}</span><ArrowRight className="h-4 w-4 text-[#4d176e] transition group-hover:translate-x-1 group-hover:text-[#f47945]" /></div><div className="mt-5 text-base font-medium tracking-[-0.03em] text-[#17131a]">{module.title}</div><p className="mt-2 text-sm leading-6 text-[#6e6072]">{module.summary}</p>{module.lessonTitles.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{module.lessonTitles.slice(0, 3).map((lesson) => <span key={lesson} className="border border-[#eadfe9] bg-[#fffdfb] px-2 py-1 text-[10px] leading-4 text-[#6e6072]">{lesson}</span>)}{module.lessonCount > 3 && <span className="px-1 py-1 text-[10px] leading-4 text-[#4d176e]">+{module.lessonCount - 3} more</span>}</div>}<div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eadfe9] pt-4"><div><div className="text-[10px] font-medium text-[#8a748e]">{module.live ? minutesLabel(module.durationMinutes) : "Module tuition"}</div><div className="mt-1 text-sm font-medium text-[#4d176e]">{module.live ? `${module.lessonCount} lessons` : module.price}</div></div><span className="text-[10px] font-medium text-[#4d176e] transition group-hover:text-[#f47945]">Open in learner area</span></div></Link>)}</div>
            </div>
          </div>
        </section>

        <section className="bg-[#1f0d2e] px-5 py-14 text-white sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20"><div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-start"><div><h2 className="max-w-[620px] text-[clamp(1.85rem,2.9vw,3.1rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">A clear next step, with the right support around it.</h2><p className="mt-4 max-w-[520px] text-sm leading-7 text-white/70">{programme.priceNote}</p></div><div className="rounded-[22px] border border-white/20 bg-white/10 p-6 sm:p-8"><div className="text-xs font-medium text-[#f7c2aa]">Full programme tuition</div><div className="mt-3 text-2xl font-medium tracking-[-0.04em] text-white">{programme.price}</div><p className="mt-4 text-sm leading-6 text-white/70">Start with the live course catalogue above, then use the learner area to access lessons, practice, and progress tracking.</p><Link href="/login" className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#f7c2aa]">Talk to admissions <ArrowRight className="h-4 w-4" /></Link></div></div></section>

        <section className="px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20"><div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14"><div><h2 className="max-w-[440px] text-[clamp(1.75rem,2.7vw,2.9rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#151116]">A little clarity goes a long way.</h2><p className="mt-4 max-w-[420px] text-sm leading-7 text-[#6e6072]">If you are not sure whether this is the right starting point, the admissions team can help you think it through.</p><Link href="/login" className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#4d176e]/30 px-5 py-3 text-xs font-medium text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">Ask a question <MessageCircle className="h-4 w-4" /></Link></div><div className="space-y-0">{programme.faqs.map((faq) => <details key={faq.question} className="group border-b border-[#ded3df] py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-medium text-[#17131a] [&::-webkit-details-marker]:hidden"><span>{faq.question}</span><ChevronDown className="h-4 w-4 shrink-0 text-[#4d176e] transition group-open:rotate-180" /></summary><p className="max-w-[640px] pt-3 text-sm leading-6 text-[#6e6072]">{faq.answer}</p></details>)}</div></div></section>

        <section className="bg-[#f6eef9] px-5 py-10 sm:px-10 lg:px-[7vw]"><div className="mx-auto flex max-w-[1440px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-xl font-medium tracking-[-0.04em] text-[#151116]">Take the next step with {programme.title}.</div><p className="mt-2 text-sm text-[#6e6072]">Admissions can help you choose the right starting point.</p></div><Link href="/login" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#ff8f57]">Start with admissions <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <LandingFooter />
    </div>
  );
}
