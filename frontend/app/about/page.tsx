import Link from "next/link";
import { ArrowRight, Compass, GraduationCap, Handshake, Hammer, Leaf, Lightbulb, MapPin, MessageCircle, Rocket, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { MobileCarousel } from "@/components/shared/mobile-carousel";

const ABOUT_HERO_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-community-launch_f1ae296d.jpg";
const MENTOR_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-mentor-support_9d78971d.jpg";

const values = [
  { title: "Collaborative Ownership", text: "We take responsibility for the work and move further together." },
  { title: "Innovation First", text: "We stay curious, test ideas, and create useful solutions." },
  { title: "Sustainability", text: "We build for lasting value and responsible growth." },
  { title: "Continuous Learning And Impact", text: "We keep learning and apply it where it matters." },
];

const valueIcons = [Handshake, Sparkles, Leaf, GraduationCap];

const growthIcons = [Search, Hammer, MessageCircle, Rocket];

const growthStages = [
  ["Start", "Find your starting point, understand the field, and choose a direction that feels possible."],
  ["Practise", "Turn ideas into working habits through projects, challenge, and repetition."],
  ["Share", "Use feedback from mentors and peers to make the work clearer and stronger."],
  ["Advance", "Leave with evidence of what you can do and a more confident next step."],
];

export default function AboutPage() {
  return (
    <div className="lea-motion-page min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />

      <main>
        <section className="relative min-h-[620px] overflow-hidden bg-[#1f0d2e] px-5 py-10 text-white sm:px-10 sm:py-12 lg:min-h-0 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]">
            <div className="relative grid items-stretch gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
              <div className="relative z-10 flex flex-col justify-center py-4 lg:py-8">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">About LEA Labs</p>
                <h1 className="mt-5 max-w-[660px] text-[clamp(2.15rem,3.8vw,4.2rem)] font-medium leading-[0.92] tracking-[-0.07em] text-white">A learning ecosystem built for <span className="text-[#f47945]">forward motion.</span></h1>
                <p className="mt-6 max-w-[560px] text-base leading-7 text-white/70">LEA Labs connects practical learning, human guidance, and opportunity so people can build the skills and confidence to move into the digital economy.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="#story" className="inline-flex items-center gap-3 bg-[#f47945] px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#1f0d2e] hover:text-white">Read our story <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="#mission" className="inline-flex items-center border-b border-white/45 pb-1 text-xs font-medium text-white transition hover:border-[#f47945] hover:text-[#f47945]">Our mission <span className="ml-2">↗</span></Link>
                </div>
              </div>
              <div className="absolute inset-0 min-h-[620px] overflow-hidden bg-[#1f0d2e] lg:relative lg:inset-auto lg:min-h-[390px]"><img src={ABOUT_HERO_IMAGE} alt="A LEA learner in a contemporary learning studio" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#1f0d2e]/75 via-[#1f0d2e]/15 to-[#f47945]/25" /><div className="absolute inset-0 bg-[#4d176e]/35 lg:hidden" /><div className="absolute bottom-5 left-5 border border-white/40 bg-[#1f0d2e]/40 px-4 py-3 text-white backdrop-blur-sm"><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f7c2aa]">Learn. Evolve. Advance.</p><p className="mt-1 text-sm">Progress starts with a place to practise.</p></div></div>
            </div>
          </div>
        </section>

        <section id="story" className="scroll-mt-20 px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative min-h-[280px] overflow-hidden bg-[#1f0d2e] sm:min-h-[360px]"><img src="/lea-about-story.png" alt="Learners and mentors building ideas together at LEA Labs" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#1f0d2e]/70 via-[#1f0d2e]/15 to-[#f47945]/20" /><div className="absolute bottom-4 left-4 border border-white/35 bg-[#1f0d2e]/45 px-3 py-2 text-white backdrop-blur-sm"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#f7c2aa]">Our story</p><p className="mt-1 text-xs text-white/80">From learning to something real.</p></div></div>
            <div className="max-w-[650px]"><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">01 · Our story</p><h2 className="mt-4 max-w-[500px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em] text-[#151116]">Learning should lead to <span className="text-[#4d176e]">something real.</span></h2><div className="mt-6 text-sm leading-7 text-[#6e6072]"><p>The world is moving quickly. People need more than information; they need the confidence to use what they know.</p><p className="mt-5">LEA Labs exists to close the distance between learning and doing. We create room for people to practise, make mistakes, receive guidance, and leave with work they can show.</p><p className="mt-5">That work is the beginning of a wider journey: learning can fuel innovation, innovation can create solutions, and enterprise can turn those solutions into lasting impact.</p></div></div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-20 bg-[#fff7ef] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#4d176e]">How we work</p><h2 className="mt-4 max-w-[600px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.98] tracking-[-0.06em] text-[#151116]">How progress grows at <span className="text-[#f47945]">LEA.</span></h2></div><p className="max-w-[380px] text-sm leading-7 text-[#6e6072]">A clear sequence keeps learning connected to practice, feedback, and the next opportunity.</p></div><div className="relative mt-9"><div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-[#d8c8bc] lg:block" /><MobileCarousel ariaLabel="learning stages" className="-mx-5 px-5 sm:mx-0 sm:px-0"><div className="flex w-[calc(200vw-2rem)] gap-6 sm:w-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{growthStages.map(([title, text], index) => { const Icon = growthIcons[index]; return <article key={title} className="relative min-w-[calc(50vw-1.75rem)] snap-start flex flex-col items-center text-center lg:min-w-0 lg:items-start lg:text-left"><div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 ${index % 2 === 0 ? "border-[#f47945] bg-[#fffdfb] text-[#4d176e]" : "border-[#4d176e] bg-[#f6eef9] text-[#f47945]"}`}><Icon className="h-6 w-6" strokeWidth={1.5} /></div><h3 className="mt-4 text-lg font-medium tracking-[-0.03em] text-[#151116]">{title}</h3><p className="mt-2 max-w-[235px] text-xs leading-6 text-[#6e6072]">{text}</p></article>; })}</div></MobileCarousel><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d176e] sm:hidden">Use the arrows to explore →</p></div></div>
        </section>

        <section id="mission" className="scroll-mt-20 bg-[#1f0d2e] px-5 py-8 text-white sm:px-10 sm:py-10 lg:px-[7vw] lg:py-12">
          <div className="mx-auto max-w-[1440px]"><div className="mb-4 flex items-end justify-between"><h2 className="text-[clamp(1.9rem,3vw,3.4rem)] font-medium leading-[0.85] tracking-[-0.075em] text-white">Vision <span className="text-[#f47945]">&amp;</span> Mission</h2><span className="hidden text-xs text-white/45 sm:block">Learn → build → contribute</span></div><div className="flex flex-col gap-4 md:grid md:grid-cols-2"><article className="group relative w-full min-w-0 aspect-[1.35/1] overflow-hidden bg-[#351039]"><img src="/lea-about-vision.png" alt="LEA learners looking toward a future shaped by technology" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1f0d2e]/95 via-[#1f0d2e]/58 to-[#4d176e]/20" /><div className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7c2aa]"><Lightbulb className="h-3.5 w-3.5" /> Vision</div><h3 className="mt-2 max-w-[420px] text-[clamp(1.35rem,2.2vw,2rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">Make LEA a launchpad for digital possibility.</h3><p className="mt-3 max-w-[500px] text-sm leading-6 text-white/75">To be the ultimate global launchpad for digital talent and sustainable tech enterprises—making a smarter, more inclusive future possible.</p></div></article><article className="group relative w-full min-w-0 aspect-[1.35/1] overflow-hidden bg-[#351039]"><img src="/lea-about-mission.png" alt="LEA learners building a practical digital project together" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#1f0d2e]/95 via-[#1f0d2e]/58 to-[#4d176e]/20" /><div className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7c2aa]"><Compass className="h-3.5 w-3.5" /> Mission</div><h3 className="mt-2 max-w-[420px] text-[clamp(1.35rem,2.2vw,2rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">Build an ecosystem where learning creates movement.</h3><p className="mt-3 max-w-[500px] text-sm leading-6 text-white/75">To build an ecosystem where learning fuels innovation, innovation creates solutions, and enterprise drives lasting impact.</p></div></article></div></div>
        </section>

        <section id="values" className="scroll-mt-20 bg-[#fffdfb] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">What guides us</p><h2 className="mt-4 max-w-[560px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.98] tracking-[-0.06em]">The principles behind the <span className="text-[#4d176e]">work.</span></h2></div><p className="max-w-[380px] text-sm leading-7 text-[#6e6072]">Our values shape the way we learn, build, collaborate, and contribute.</p></div><MobileCarousel ariaLabel="core values" className="mt-8 -mx-5 px-5 sm:mx-0 sm:px-0"><div className="flex w-[calc(200vw-2rem)] gap-6 sm:w-auto sm:grid sm:grid-cols-2 lg:grid-cols-4">{values.map((value, index) => { const Icon = valueIcons[index]; return <article key={value.title} className="min-w-[calc(50vw-1.75rem)] snap-start flex flex-col items-center text-center sm:min-w-0"><div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${index % 2 === 0 ? "border-[#f47945] bg-[#fff7ef] text-[#4d176e]" : "border-[#4d176e] bg-[#f6eef9] text-[#f47945]"}`}><Icon className="h-7 w-7" strokeWidth={1.5} /></div><h3 className="mt-2 max-w-[180px] text-base font-medium leading-tight tracking-[-0.02em] text-[#151116]">{value.title}</h3><p className="mt-2 max-w-[190px] text-xs leading-6 text-[#6e6072]">{value.text}</p></article>; })}</div></MobileCarousel><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4d176e] sm:hidden">Use the arrows to explore →</p></div>
        </section>

        <section id="team" className="scroll-mt-20 bg-[#151116] text-white"><div className="mx-auto grid max-w-[1600px] lg:grid-cols-[0.95fr_1.05fr]"><div className="relative min-h-[330px] overflow-hidden sm:min-h-[420px]"><img src={MENTOR_IMAGE} alt="A mentor supporting a learner at LEA Labs" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#151116]/80 via-[#4d176e]/25 to-[#f47945]/15" /></div><div className="flex items-center px-5 py-10 sm:px-10 sm:py-12 lg:px-16"><div className="max-w-[570px]"><div className="flex items-center gap-3 text-[#f7c2aa]"><Users className="h-5 w-5" /><p className="text-xs font-medium uppercase tracking-[0.18em]">05 · The team</p></div><h2 className="mt-5 text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em]">Progress is personal. It should never happen <span className="text-[#f47945]">alone.</span></h2><p className="mt-6 text-sm leading-7 text-white/65 sm:text-base">LEA brings together educators, mentors, builders, and community connectors to create the conditions for people and ideas to grow.</p><Link href="/corporate" className="mt-7 inline-flex items-center gap-3 border-b border-[#f47945] pb-2 text-xs font-medium text-[#f7c2aa] transition hover:text-white">Work with LEA <ArrowRight className="h-4 w-4" /></Link></div></div></div></section>

        <section className="bg-[#f6eef9] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">Next step</p><h2 className="mt-5 max-w-[680px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em]">Your next chapter can begin with a <span className="text-[#4d176e]">conversation.</span></h2><p className="mt-5 max-w-[620px] text-sm leading-7 text-[#6e6072]">Visit us at Applewood Adams, 13th Floor, Nairobi, or start online by exploring a programme that fits your next move.</p></div><div className="flex flex-col items-start gap-4 lg:items-end"><Link href="mailto:hello@lealabs.africa" className="inline-flex items-center gap-3 bg-[#f47945] px-6 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#1f0d2e] hover:text-white">Start a conversation <ArrowRight className="h-4 w-4" /></Link><span className="inline-flex items-center gap-2 text-xs font-medium text-[#4d176e]"><MapPin className="h-4 w-4 text-[#f47945]" /> Applewood Adams, 13th Floor</span></div></div></section>
      </main>

      <LandingFooter />
    </div>
  );
}

export const metadata = {
  title: "About LEA Labs",
  description: "Learn about LEA Labs, our story, mission, vision, values, team, and learning ecosystem.",
};
