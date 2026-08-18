import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, Laptop, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { getProgramme, PROGRAMMES } from "@/lib/programmes";

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

export default async function ProgrammeDetailPage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();

  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />
      <main>
        <section className="relative overflow-hidden bg-[#f6eef9] px-5 pb-13 pt-7 sm:px-10 sm:pb-18 sm:pt-8 lg:px-[7vw] lg:pb-22">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#4d176e]/10" />
          <div className="mx-auto max-w-[1440px]">
            <Link href="/#programmes" className="inline-flex items-center gap-2 text-xs font-bold text-[#4d176e] transition hover:text-[#f47945]"><ArrowLeft className="h-4 w-4" /> Back to programmes</Link>
            <div className="mt-10 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
              <div>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#f47945] text-xs font-black text-[#351039]">{programme.number}</div>
                <h1 className="max-w-[680px] text-[clamp(2.45rem,5vw,5.3rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[#151116]">{programme.title}</h1>
                <p className="mt-5 max-w-[560px] text-base leading-7 text-[#6e6072]">{programme.overview}</p>
                <div className="mt-6 flex flex-wrap gap-3"><Link href="#modules" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-3 text-xs font-black text-[#351039] transition hover:bg-[#ff8f57]">Explore modules <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-[#4d176e]/25 px-5 py-3 text-xs font-black text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">Sign in to start <span aria-hidden>↗</span></Link></div>
              </div>
              <div className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-[#d9cbdc] bg-white shadow-[0_22px_70px_rgba(77,23,110,0.12)] sm:min-h-[380px]"><img src={programme.image} alt={`${programme.title} learning experience`} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#351039]/80 via-transparent to-transparent" /><div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-5 text-white sm:p-6"><div><div className="text-2xl font-semibold tracking-[-0.04em]">{programme.outcome}</div></div><span className="hidden text-6xl font-semibold text-white/80 sm:block">{programme.icon}</span></div></div>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#d9cbdc] bg-white/60 p-5"><div className="text-sm font-black text-[#4d176e]">Duration</div><div className="mt-2 text-sm leading-6 text-[#6e6072]">{programme.duration}</div></div><div className="rounded-2xl border border-[#d9cbdc] bg-white/60 p-5"><div className="text-sm font-black text-[#4d176e]">Format</div><div className="mt-2 text-sm leading-6 text-[#6e6072]">{programme.format}</div></div><div className="rounded-2xl border border-[#d9cbdc] bg-white/60 p-5"><div className="text-sm font-black text-[#4d176e]">Best for</div><div className="mt-2 text-sm leading-6 text-[#6e6072]">{programme.audience}</div></div></div>
          </div>
        </section>

        <section id="modules" className="scroll-mt-20 px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22"><div className="mx-auto grid max-w-[1440px] gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"><div><h2 className="max-w-[460px] text-[clamp(2rem,3.25vw,3.55rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#151116]"><span className="text-[#4d176e]">Build one useful layer</span> <span className="text-[#f47945]">at a time.</span></h2><p className="mt-4 max-w-[430px] text-sm leading-7 text-[#6e6072]">Every module is designed to give you something concrete to practise, discuss, and carry into the next stage.</p><div className="mt-6 inline-flex items-center gap-3 text-xs font-bold text-[#6e6072]"><Laptop className="h-4 w-4 text-[#f47945]" /> Practical, guided learning</div></div><div className="grid gap-4 sm:grid-cols-2">{programme.modules.map((module) => <Link key={module.number} href="/login" className="group flex min-h-[225px] flex-col rounded-[24px] border border-[#d9cbdc] bg-white p-6 shadow-[0_14px_35px_rgba(77,23,110,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#f47945] hover:shadow-[0_20px_48px_rgba(77,23,110,0.12)] sm:p-7"><div className="flex items-start justify-between gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f47945] text-xs font-black text-[#351039]">{module.number}</span><ArrowRight className="h-4 w-4 text-[#4d176e] transition group-hover:translate-x-1 group-hover:text-[#f47945]" /></div><div className="mt-6 text-lg font-semibold tracking-[-0.03em] text-[#17131a]">{module.title}</div><p className="mt-2 text-sm leading-6 text-[#6e6072]">{module.summary}</p><div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eadfe9] pt-5"><div><div className="text-[11px] font-semibold text-[#8a748e]">Module tuition</div><div className="mt-1 text-base font-black text-[#4d176e]">{module.price}</div></div><span className="text-[11px] font-black text-[#4d176e] transition group-hover:text-[#f47945]">Open module</span></div></Link>)}</div></div></section>

        <section className="bg-[#4d176e] px-5 py-16 text-white sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22"><div className="mx-auto grid max-w-[1440px] gap-9 lg:grid-cols-[1fr_0.72fr] lg:items-start"><div><h2 className="max-w-[650px] text-[clamp(2.1rem,3.4vw,3.85rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-white">A clear next step, with the right support around it.</h2><p className="mt-4 max-w-[540px] text-sm leading-7 text-white/70">{programme.priceNote}</p></div><div className="rounded-[24px] border border-white/20 bg-white/10 p-7 sm:p-9"><div className="text-sm font-bold text-[#f7c2aa]">Full programme tuition</div><div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{programme.price}</div><p className="mt-4 text-sm leading-6 text-white/70">Or start with one module at a time. Module prices are shown above, and admissions can explain the available payment options.</p><Link href="/login" className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-black text-[#351039] transition hover:bg-[#f7c2aa]">Talk to admissions <ArrowRight className="h-4 w-4" /></Link></div></div></section>

        <section className="px-5 py-16 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22"><div className="mx-auto grid max-w-[1440px] gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16"><div><h2 className="max-w-[460px] text-[clamp(2rem,3.25vw,3.55rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#151116]">A little clarity goes a long way.</h2><p className="mt-4 max-w-[430px] text-sm leading-7 text-[#6e6072]">If you are not sure whether this is the right starting point, the admissions team can help you think it through.</p><Link href="/login" className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#4d176e]/30 px-5 py-3 text-xs font-black text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">Ask a question <MessageCircle className="h-4 w-4" /></Link></div><div className="space-y-0">{programme.faqs.map((faq) => <details key={faq.question} className="group border-b border-[#ded3df] py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-[#17131a] [&::-webkit-details-marker]:hidden"><span>{faq.question}</span><ChevronDown className="h-4 w-4 shrink-0 text-[#4d176e] transition group-open:rotate-180" /></summary><p className="max-w-[640px] pt-4 text-sm leading-6 text-[#6e6072]">{faq.answer}</p></details>)}</div></div></section>

        <section className="bg-[#f6eef9] px-5 py-12 sm:px-10 lg:px-[7vw]"><div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-2xl font-semibold tracking-[-0.04em] text-[#151116]">Take the next step with {programme.title}.</div><p className="mt-2 text-sm text-[#6e6072]">Admissions can help you choose the right starting point.</p></div><Link href="/login" className="inline-flex items-center gap-3 rounded-full bg-[#f47945] px-5 py-3 text-xs font-black text-[#351039] transition hover:bg-[#ff8f57]">Start with admissions <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
    </div>
  );
}
