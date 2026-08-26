import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
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

const INTAKE_OPTIONS: IntakeOption[] = [
  { title: "Full-time Hybrid", mode: "Online + in-person classes | Mon–Fri | 8am–5pm EAT" },
  { title: "Full-time Remote", mode: "100% online classes | Mon–Fri | 8am–5pm EAT" },
  { title: "Part-time Remote", mode: "100% online classes | Mon–Fri | 6pm–9pm EAT" },
];

const SOFTWARE_LEVEL_OPTIONS: IntakeOption[] = [
  { level: "Beginner", title: "Foundation Track", mode: "A welcoming starting point for learners building their first confident software-development habits.", duration: "12 weeks", price: "KES 40,000" },
  { level: "Intermediate", title: "Professional Builder", mode: "A structured route for learners ready to build complete products through focused practice and a 16-week project journey.", duration: "16 weeks", price: "KES 45,000" },
  { level: "Advanced", title: "Advanced Product Engineer", mode: "A demanding, project-led pathway for learners ready to deepen their engineering judgement and ship stronger digital products.", duration: "16 weeks", price: "KES 50,000" },
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
  const intakeOptions = isSoftwareProgramme ? SOFTWARE_LEVEL_OPTIONS : INTAKE_OPTIONS;

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />
      <main>
        <section className="bg-[#1f0d2e] px-5 pb-10 pt-5 text-white sm:px-10 sm:pb-12 sm:pt-6 lg:px-[7vw] lg:pb-14">
          <div className="mx-auto max-w-[1440px]">
            <Link href="/#programmes" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-[#f47945]"><ArrowLeft className="h-4 w-4" /> Back to programmes</Link>
            <div className="mx-auto max-w-[980px] pb-2 pt-14 text-center sm:pt-16">
              <h1 className="mx-auto max-w-[900px] text-[clamp(1.85rem,4vw,4rem)] font-normal leading-[0.98] tracking-[-0.075em] text-white"><span>{titleLead}</span>{titleRest ? <> <span className="text-[#f06d36]">{titleRest}</span></> : null}</h1>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-white/80 sm:text-lg">{programme.overview}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="#modules" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-2.5 text-sm font-black text-[#351039] transition hover:bg-[#ff8f57]">Explore programme <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#f47945] hover:text-[#f47945]">Sign in to start <span aria-hidden>↗</span></Link></div>
            </div>
          </div>
        </section>


        <section className="bg-white px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-8 flex flex-col justify-between gap-4 border-y border-[#4d176e]/15 py-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f06d36]">{isSoftwareProgramme ? "Software engineering pathways" : "Available learning formats"}</p>
                <h2 className="mt-2 text-[clamp(1.45rem,2.4vw,2.35rem)] font-normal leading-[1] tracking-[-0.045em] text-[#151116]">{isSoftwareProgramme ? <>Choose your <span className="text-[#4d176e]">starting point.</span></> : <>Choose your <span className="text-[#4d176e]">learning rhythm.</span></>}</h2>
              </div>
              <p className="max-w-[400px] text-base leading-7 text-[#6e6072]">{isSoftwareProgramme ? "Three progressive pathways make it easier to begin at the level that fits your experience, then keep building with practical project work." : "One programme, three ways to make the work. Pick the rhythm that gives you the clearest space to learn, practise, and keep moving."}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {intakeOptions.map((intake) => (
                <article key={intake.title} className="group flex min-h-[350px] flex-col rounded-[18px] border border-dashed border-[#f47945]/55 bg-[#fff8f3] p-5 shadow-[0_10px_24px_rgba(77,23,110,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#f47945] hover:shadow-[0_16px_34px_rgba(77,23,110,0.12)] sm:p-6">
                  {intake.level ? <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#4d176e]">{intake.level}</p> : null}
                  <h3 className="mt-0 text-lg font-semibold tracking-[-0.03em] text-[#f06d36]">{intake.title}</h3>
                  <p className="mt-4 min-h-[72px] text-sm leading-6 text-[#4d176e]">{intake.mode}</p>
                  <div className="mt-5 grid gap-0 border-y border-dashed border-[#f47945]/45 text-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-[#f47945]/35 py-3"><span className="font-medium text-[#351039]">Starts</span><span className="font-bold text-[#4d176e]">August 31st, 2026</span></div>
                    <div className="flex items-center justify-between gap-4 py-3"><span className="font-medium text-[#351039]">Duration</span><span className="font-bold text-[#4d176e]">{intake.duration ?? programme.duration}</span></div>
                  </div>
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-[#f47945]/35 pb-4"><span className="font-medium text-[#351039]">Tuition</span><span className="text-xl font-bold tracking-[-0.03em] text-[#f06d36]">{intake.price ?? programme.price}</span></div>
                    <Link href="/register" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#f47945] px-5 text-sm font-black text-[#351039] transition hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2">Apply <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="scroll-mt-20 bg-white px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 border-t border-[#d9cbdc] pt-8">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f06d36]">Inside the pathway</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <h3 className="text-xl font-normal tracking-[-0.035em] text-[#17131a]">Curriculum breakdown</h3>
                <div className="text-sm text-[#4d176e]">{curriculumModuleCount} {curriculumModuleCount === 1 ? "module" : "modules"} · {programme.curriculum.filter((item) => item.type === "break").length} break included</div>
              </div>
            </div>
            <div className="space-y-4">
              {programme.curriculum.map((item) => (
                <details key={`${programme.slug}-${item.number}-${item.title}`} className={`group overflow-hidden rounded-[18px] border bg-[#fff8f3] shadow-[0_10px_24px_rgba(77,23,110,0.06)] ${item.type === "break" ? "border-dashed border-[#f06d36]/55" : "border-[#f47945]/45"}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 transition hover:bg-[#ffefe6] sm:px-8 sm:py-6 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4d176e]">{item.weeks}</p>
                      <h4 className="mt-1 text-base font-medium tracking-[-0.03em] text-[#4d176e] sm:text-lg">{item.title}</h4>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#4d176e] transition duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-[#eadfe9] bg-white px-5 py-6 sm:px-8 sm:py-7">
                    <p className="max-w-[980px] text-base leading-8 text-[#4d176e]">{curriculumExplanation(item, programme.slug)}</p>
                    {item.topics.length > 0 && <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#4d176e]"><span className="font-semibold text-[#4d176e]">Covers:</span>{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
