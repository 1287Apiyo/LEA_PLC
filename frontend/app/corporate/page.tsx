import Link from "next/link";
import {
  ArrowRight,
  Layers3,
  Lightbulb,
  Network,
  Users,
  Wrench,
} from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

const COLLABORATION_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-programme-collaboration_c9aa5e6b.jpg";
const COMMUNITY_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-community-launch_f1ae296d.jpg";

const trainingOffers = [
  { title: "Upskill your teams", text: "Build practical digital capability where your people need it most, from foundations to modern technical workflows.", icon: Wrench },
  { title: "Reskill for what’s next", text: "Give teams a supported route into new tools, new roles, and a more confident way of solving problems.", icon: Layers3 },
  { title: "Turn learning into momentum", text: "Move from training sessions to visible progress through projects, feedback, and outcomes your organization can use.", icon: Network },
];

const outcomes = [
  "A practical capability plan shaped around your team’s goals",
  "Facilitated learning that connects concepts to current work",
  "Projects and practice that create visible evidence of progress",
  "Mentor and facilitator feedback to keep the work moving",
];

const formats = [
  { title: "Team workshops", text: "Focused sessions for shared language, new tools, and an immediate next step." },
  { title: "Cohort sprints", text: "A guided sequence that gives teams time to practise, build, review, and improve." },
  { title: "Custom pathways", text: "A tailored learning experience aligned to your people, priorities, and operating context." },
];

export default function CorporateTrainingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />
      <main>
        <section className="relative isolate min-h-[420px] overflow-hidden bg-[#1f0d2e] text-white sm:min-h-[460px] lg:min-h-[500px]">
          <div className="absolute inset-0 bg-cover bg-center saturate-[0.8]" style={{ backgroundImage: `url(${COLLABORATION_IMAGE})` }} />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(35,72,111,0.72)_0%,rgba(31,13,46,0.76)_54%,rgba(244,121,69,0.24)_100%)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#1f0d2e]/20" />
          <div className="relative mx-auto flex min-h-[420px] w-full max-w-[1440px] items-center justify-center px-5 py-12 text-center sm:min-h-[460px] sm:px-10 sm:py-14 lg:min-h-[500px] lg:px-[7vw] lg:py-16">
            <div className="mx-auto max-w-[720px]">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[#f7c2aa]">Corporate Training</p>
              <h1 className="mx-auto max-w-[690px] text-[clamp(3.1rem,5.15vw,5.65rem)] font-medium leading-[0.92] tracking-[-0.075em]"><span>Build capability</span><br /><span className="text-[#f7c2aa]">that moves</span><br /><span className="text-[#f47945]">the work forward.</span></h1>
              <p className="mx-auto mt-5 max-w-[580px] text-sm leading-6 text-white/78 sm:text-base sm:leading-7">Practical corporate training for teams that want to upskill, reskill, and turn digital learning into useful progress.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/register" className="inline-flex items-center gap-3 bg-[#f47945] px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#ff8f57]">Talk to LEA Labs <ArrowRight className="h-4 w-4" /></Link><Link href="#approach" className="inline-flex items-center gap-2 border border-white/45 px-5 py-3 text-xs font-medium text-white transition hover:border-[#f47945] hover:text-[#f47945]">See our approach <span aria-hidden>↘</span></Link></div>
            </div>
          </div>
        </section>

        <section className="bg-[#1f0d2e] px-5 py-12 text-white sm:px-10 sm:py-14 lg:px-[7vw] lg:py-16"><div className="mx-auto grid max-w-[1440px] gap-8 sm:grid-cols-3 sm:gap-10"><div><div className="flex items-center gap-3 text-[#f47945]"><Wrench className="h-5 w-5" /><h2 className="text-xl font-medium tracking-[-0.03em]">Skills that stick</h2></div><p className="mt-3 max-w-[250px] text-sm leading-6 text-white/65">Capability people can bring back to the work.</p></div><div><div className="flex items-center gap-3 text-[#f47945]"><Lightbulb className="h-5 w-5" /><h2 className="text-xl font-medium tracking-[-0.03em]">Projects that prove</h2></div><p className="mt-3 max-w-[250px] text-sm leading-6 text-white/65">Practice that makes progress visible.</p></div><div><div className="flex items-center gap-3 text-[#f47945]"><Users className="h-5 w-5" /><h2 className="text-xl font-medium tracking-[-0.03em]">Confidence to move</h2></div><p className="mt-3 max-w-[250px] text-sm leading-6 text-white/65">People ready for the next challenge.</p></div></div></section>

        <section id="approach" className="scroll-mt-20 px-5 py-12 sm:px-10 sm:py-14 lg:px-[7vw] lg:py-18"><div className="mx-auto max-w-[1440px]"><div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-end lg:gap-14"><div><h2 className="max-w-[560px] text-[clamp(2rem,3.1vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#151116]">Training that meets your <span className="text-[#4d176e]">context.</span></h2></div><p className="max-w-[560px] text-sm leading-7 text-[#6e6072]">The strongest learning is connected to the work already in motion. We shape the route around your people, priorities, and pace.</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">{trainingOffers.map((offer) => { const Icon = offer.icon; return <article key={offer.title} className="bg-[#f6eef9] p-6 transition hover:bg-[#efe2f7]"><Icon className="h-6 w-6 text-[#4d176e]" /><h3 className="mt-8 text-xl font-medium leading-tight tracking-[-0.03em] text-[#17131a]">{offer.title}</h3><p className="mt-3 text-sm leading-7 text-[#6e6072]">{offer.text}</p></article>; })}</div></div></section>

        <section className="bg-[#fff7ef] px-5 py-12 sm:px-10 sm:py-14 lg:px-[7vw] lg:py-18"><div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14"><div className="relative min-h-[300px] overflow-hidden bg-[#1f0d2e] sm:min-h-[400px]"><img src={COMMUNITY_IMAGE} alt="People learning and connecting through a shared community" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#1f0d2e]/78 via-transparent to-[#f47945]/10" /></div><div><h2 className="max-w-[560px] text-[clamp(2rem,3.1vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#151116]">What your team leaves with.</h2><p className="mt-5 max-w-[540px] text-sm leading-7 text-[#6e6072]">Each engagement is designed to leave behind a stronger way of working, not a folder of unfinished course notes.</p><div className="mt-8 grid gap-5">{outcomes.map((outcome) => <div key={outcome} className="flex items-start gap-4 text-sm leading-6 text-[#4d176e]"><span className="mt-2 h-2.5 w-2.5 shrink-0 bg-[#f47945]" /><span>{outcome}</span></div>)}</div></div></div></section>

        <section className="px-5 py-12 sm:px-10 sm:py-14 lg:px-[7vw] lg:py-18"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><h2 className="max-w-[600px] text-[clamp(2rem,3.1vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#151116]">Choose the format that fits the <span className="text-[#f47945]">moment.</span></h2></div><p className="max-w-[430px] text-sm leading-7 text-[#6e6072]">Start small, build a cohort, or design a longer pathway around a strategic priority.</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">{formats.map((format) => <article key={format.title} className="border-t-4 border-[#f47945] bg-[#fff7ef] p-6 transition hover:bg-[#fff0e8]"><div className="flex items-center justify-between"><h3 className="text-xl font-medium tracking-[-0.03em] text-[#17131a]">{format.title}</h3><ArrowRight className="h-5 w-5 text-[#4d176e]" /></div><p className="mt-4 text-sm leading-7 text-[#6e6072]">{format.text}</p></article>)}</div></div></section>

        <section className="bg-[#1f0d2e] px-5 py-10 text-white sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16"><div className="mx-auto grid max-w-[1440px] gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-[clamp(1.9rem,3vw,3.1rem)] font-medium leading-[0.98] tracking-[-0.055em]">Ready to build capability that lasts?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/70">Tell us what your team is working toward. We will help you shape a practical starting point.</p></div><Link href="/register" className="inline-flex w-fit items-center gap-3 bg-[#f47945] px-6 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#ff8f57]">Start a conversation <ArrowRight className="h-4 w-4" /></Link></div></section>
      </main>
      <LandingFooter />
    </div>
  );
}

export const metadata = {
  title: "Corporate Training | LEA Labs",
  description: "Practical corporate training to help teams upskill, reskill, and turn digital learning into useful progress.",
};
