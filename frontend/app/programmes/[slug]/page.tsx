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

// Hybrid surcharge map — keyed by programme slug
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

// Software Engineering: each level × three formats
type SoftwareFormat = { format: string; schedule: string; price: string };
type SoftwareLevel = {
  level: string;
  title: string;
  description: string;
  duration: string;
  formats: SoftwareFormat[];
};

const SOFTWARE_LEVELS: SoftwareLevel[] = [
  {
    level: "Beginner",
    title: "Foundation Track",
    description: "A welcoming starting point for learners building their first confident software-development habits.",
    duration: "12 weeks",
    formats: [
      { format: "Full-time Hybrid", schedule: "Online + in-person | Mon–Fri | 8am–5pm EAT", price: "KES 45,000" },
      { format: "Full-time Remote", schedule: "100% online | Mon–Fri | 8am–5pm EAT", price: "KES 40,000" },
      { format: "Part-time Remote", schedule: "100% online | Mon–Fri | 6pm–9pm EAT", price: "KES 40,000" },
    ],
  },
  {
    level: "Intermediate",
    title: "Professional Builder",
    description: "A structured route for learners ready to build complete products through focused practice and a 16-week project journey.",
    duration: "16 weeks",
    formats: [
      { format: "Full-time Hybrid", schedule: "Online + in-person | Mon–Fri | 8am–5pm EAT", price: "KES 50,000" },
      { format: "Full-time Remote", schedule: "100% online | Mon–Fri | 8am–5pm EAT", price: "KES 45,000" },
      { format: "Part-time Remote", schedule: "100% online | Mon–Fri | 6pm–9pm EAT", price: "KES 45,000" },
    ],
  },
  {
    level: "Advanced",
    title: "Advanced Product Engineer",
    description: "A demanding, project-led pathway for learners ready to deepen their engineering judgement and ship stronger digital products.",
    duration: "16 weeks",
    formats: [
      { format: "Full-time Hybrid", schedule: "Online + in-person | Mon–Fri | 8am–5pm EAT", price: "KES 55,000" },
      { format: "Full-time Remote", schedule: "100% online | Mon–Fri | 8am–5pm EAT", price: "KES 50,000" },
      { format: "Part-time Remote", schedule: "100% online | Mon–Fri | 6pm–9pm EAT", price: "KES 50,000" },
    ],
  },
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

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#4d176e]/20">
      <LandingNav />
      <main>
        <section className="relative isolate min-h-[410px] overflow-hidden bg-[#1f0d2e] px-5 pb-8 pt-5 text-white sm:min-h-[460px] sm:px-10 sm:pb-10 sm:pt-6 lg:px-[7vw] lg:pb-12">
          <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${programme.image})`, backgroundPosition: heroPosition }} />
          <div aria-hidden="true" className="absolute inset-0 bg-[#1f0d2e]/90" />
          <div className="relative z-10 mx-auto max-w-[1440px]">
            <Link href="/#programmes" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-[#d9b9e8]"><ArrowLeft className="h-4 w-4" /> Back to programmes</Link>
            <div className="mx-auto max-w-[980px] pb-2 pt-10 text-center sm:pt-12">
              <h1 className="mx-auto max-w-[900px] text-[clamp(1.85rem,4vw,4rem)] font-normal leading-[0.98] tracking-[-0.075em] text-white"><span>{titleLead}</span>{titleRest ? <> <span className="text-[#f06d36]">{titleRest}</span></> : null}</h1>
              <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-white/80 sm:text-lg">{programme.overview}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="#modules" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-2.5 text-sm font-black text-[#351039] transition hover:bg-[#ff8f57]">Explore programme <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2.5 text-sm font-medium text-white transition hover:border-[#d9b9e8] hover:text-[#d9b9e8]">Sign in to start <span aria-hidden>↗</span></Link></div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-8 flex flex-col justify-between gap-4 border-y border-[#4d176e]/15 py-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6e6072]">{isSoftwareProgramme ? "Software engineering pathways" : "Available learning formats"}</p>
                <h2 className="mt-2 text-[clamp(1.45rem,2.4vw,2.35rem)] font-normal leading-[1] tracking-[-0.045em] text-[#151116]">{isSoftwareProgramme ? <>Choose your <span className="text-[#4d176e]">level &amp; format.</span></> : <>Choose your <span className="text-[#4d176e]">learning rhythm.</span></>}</h2>
              </div>
              <p className="max-w-[400px] text-base leading-7 text-[#6e6072]">{isSoftwareProgramme ? "Three progressive levels, each available in Hybrid, Full-time Remote, or Part-time Remote. Hybrid adds in-person sessions and is priced KES 5,000 above the remote rate." : "One programme, three ways to make the work. Pick the rhythm that gives you the clearest space to learn, practise, and keep moving."}</p>
            </div>

            {isSoftwareProgramme ? (
              /* Software Engineering — level × format grid */
              <div className="space-y-10">
                {SOFTWARE_LEVELS.map((lvl) => (
                  <div key={lvl.level}>
                    <div className="mb-4 flex flex-wrap items-baseline gap-3">
                      <span className="rounded-full bg-[#4d176e]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#4d176e]">{lvl.level}</span>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#17131a]">{lvl.title}</h3>
                      <span className="text-sm text-[#6e6072]">· {lvl.duration}</span>
                    </div>
                    <p className="mb-5 max-w-[680px] text-sm leading-6 text-[#6e6072]">{lvl.description}</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {lvl.formats.map((fmt) => (
                        <article key={fmt.format} className="group flex flex-col rounded-[18px] border border-[#4d176e]/22 bg-white p-5 shadow-[0_10px_24px_rgba(77,23,110,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#4d176e]/60 hover:bg-[#fcf9fd] hover:shadow-[0_16px_34px_rgba(77,23,110,0.12)]">
                          <h4 className="text-sm font-semibold tracking-[-0.02em] text-[#17131a]">{fmt.format}</h4>
                          <p className="mt-2 text-xs leading-5 text-[#6e6072]">{fmt.schedule}</p>
                          <div className="mt-4 border-t border-[#4d176e]/15 pt-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-[#351039]">Tuition</span>
                              <span className="text-base font-bold tracking-[-0.03em] text-[#4d176e]">{fmt.price}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#6e6072]">
                              <span>Starts</span>
                              <span className="font-semibold text-[#351039]">Oct 1st, 2026</span>
                            </div>
                          </div>
                          <Link href="/register" className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#f47945] px-4 text-xs font-black text-[#351039] transition hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2">Apply <ArrowRight className="ml-1.5 h-3 w-3" /></Link>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Other programmes — simple 3-card grid */
              <div className="grid gap-5 lg:grid-cols-3">
                {intakeOptions.map((intake) => (
                  <article key={intake.title} className="group flex min-h-[350px] flex-col rounded-[18px] border border-[#4d176e]/22 bg-white p-5 shadow-[0_10px_24px_rgba(77,23,110,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#4d176e]/60 hover:bg-[#fcf9fd] hover:shadow-[0_16px_34px_rgba(77,23,110,0.12)] sm:p-6">
                    {intake.level ? <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#6e6072]">{intake.level}</p> : null}
                    <h3 className="mt-0 text-lg font-semibold tracking-[-0.03em] text-[#17131a]">{intake.title}</h3>
                    <p className="mt-4 min-h-[72px] text-sm leading-6 text-[#6e6072]">{intake.mode}</p>
                    <div className="mt-5 grid gap-0 border-y border-[#4d176e]/15 text-sm">
                      <div className="flex items-center justify-between gap-4 border-b border-[#4d176e]/15 py-3"><span className="font-medium text-[#351039]">Starts</span><span className="font-semibold text-[#351039]">October 1st, 2026</span></div>
                      <div className="flex items-center justify-between gap-4 py-3"><span className="font-medium text-[#351039]">Duration</span><span className="font-semibold text-[#351039]">{intake.duration ?? programme.duration}</span></div>
                    </div>
                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between gap-4 border-b border-[#4d176e]/15 pb-4"><span className="font-medium text-[#351039]">Tuition</span><span className="text-xl font-bold tracking-[-0.03em] text-[#4d176e]">{intake.price ?? programme.price}</span></div>
                      <Link href="/register" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#f47945] px-5 text-sm font-black text-[#351039] transition hover:bg-[#ff8f57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2">Apply <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="modules" className="scroll-mt-20 bg-white px-5 py-14 sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 border-t border-[#d9cbdc] pt-8">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6e6072]">Inside the pathway</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <h3 className="text-xl font-normal tracking-[-0.035em] text-[#17131a]">Curriculum breakdown</h3>
                <div className="text-sm text-[#6e6072]">{curriculumModuleCount} {curriculumModuleCount === 1 ? "module" : "modules"} · {programme.curriculum.filter((item) => item.type === "break").length} break included</div>
              </div>
            </div>
            <div className="space-y-4">
              {programme.curriculum.map((item) => (
                <details key={`${programme.slug}-${item.number}-${item.title}`} className={`group overflow-hidden rounded-[18px] border bg-white shadow-[0_10px_24px_rgba(77,23,110,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(77,23,110,0.12)] ${item.type === "break" ? "border-dashed border-[#4d176e]/35" : "border-[#4d176e]/22"}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 transition hover:bg-[#f8f3fa] sm:px-8 sm:py-6 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6e6072]">{item.weeks}</p>
                      <h4 className="mt-1 text-base font-medium tracking-[-0.03em] text-[#17131a] sm:text-lg">{item.title}</h4>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#6e6072] transition duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-[#eadfe9] bg-white px-5 py-6 sm:px-8 sm:py-7">
                    <p className="max-w-[980px] text-base leading-8 text-[#6e6072]">{curriculumExplanation(item, programme.slug)}</p>
                    {item.project ? <div className="mt-5 rounded-xl border border-[#f47945]/30 bg-[#fff8f3] p-4 sm:p-5"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b94920]">Build project</p><p className="mt-2 text-sm font-semibold leading-6 text-[#351039]">{item.project}</p></div> : null}
                    {item.topics.length > 0 && <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6e6072]"><span className="font-semibold text-[#351039]">Covers:</span>{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>}
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

