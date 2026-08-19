import Link from "next/link";
import { ArrowRight, Compass, GraduationCap, Handshake, Leaf, Lightbulb, MapPin, MessageCircle, ShieldCheck, Sparkles, Target, TrendingUp, Users, Wrench } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

const COMMUNITY_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-community-launch_f1ae296d.jpg";
const COLLABORATION_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-programme-collaboration_c9aa5e6b.jpg";
const MENTOR_IMAGE = "https://leasystem-jgtiwg7u.manus.space/manus-storage/lea-mentor-support_9d78971d.jpg";

const values = [
  { title: "Collaborative Ownership", text: "We take responsibility for the work and move further together." },
  { title: "Innovation First", text: "We stay curious, test ideas, and create useful solutions." },
  { title: "Sustainability", text: "We build for lasting value and responsible growth." },
  { title: "Continuous Learning And Impact", text: "We keep learning and apply it where it matters." },
  { title: "Excellence and Integrity", text: "We bring care, honesty, and high standards to our work." },
];

const valueIcons = [Handshake, Sparkles, Leaf, GraduationCap, ShieldCheck];

const growthIcons = [Target, Wrench, MessageCircle, TrendingUp];

const growthStages = [
  ["01", "Start", "Find your starting point, understand the field, and choose a direction that feels possible."],
  ["02", "Practise", "Turn ideas into working habits through projects, challenge, and repetition."],
  ["03", "Share", "Use feedback from mentors and peers to make the work clearer and stronger."],
  ["04", "Advance", "Leave with evidence of what you can do and a more confident next step."],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />

      <main>
        <section className="bg-[#f6eef9] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid items-stretch gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
              <div className="flex flex-col justify-center py-4 lg:py-8">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">About LEA Labs</p>
                <h1 className="mt-5 max-w-[660px] text-[clamp(2.25rem,4.3vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.07em] text-[#151116]">A learning ecosystem built for <span className="text-[#f47945]">forward motion.</span></h1>
                <p className="mt-6 max-w-[560px] text-base leading-7 text-[#6e6072]">LEA Labs connects practical learning, human guidance, and opportunity so people can build the skills and confidence to move into the digital economy.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="#story" className="inline-flex items-center gap-3 bg-[#f47945] px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#4d176e] hover:text-white">Read our story <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="#mission" className="inline-flex items-center border-b border-[#4d176e]/45 pb-1 text-xs font-medium text-[#4d176e] transition hover:border-[#f47945] hover:text-[#f47945]">Our mission <span className="ml-2">↗</span></Link>
                </div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden bg-[#4d176e] sm:min-h-[390px]"><img src={COMMUNITY_IMAGE} alt="Learners connecting at LEA Labs" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#351039]/75 via-[#4d176e]/15 to-[#f47945]/25" /><div className="absolute bottom-5 left-5 border border-white/40 bg-[#351039]/40 px-4 py-3 text-white backdrop-blur-sm"><p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f7c2aa]">Learn. Evolve. Advance.</p><p className="mt-1 text-sm">Progress starts with a place to practise.</p></div></div>
            </div>
          </div>
        </section>

        <section id="story" className="scroll-mt-20 px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative min-h-[280px] overflow-hidden bg-[#4d176e] sm:min-h-[360px]"><img src={COLLABORATION_IMAGE} alt="Learners working together at LEA Labs" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#351039]/70 via-[#4d176e]/15 to-[#f47945]/20" /><div className="absolute bottom-4 left-4 border border-white/35 bg-[#351039]/45 px-3 py-2 text-white backdrop-blur-sm"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#f7c2aa]">Our story</p><p className="mt-1 text-xs text-white/80">From learning to something real.</p></div></div>
            <div className="max-w-[650px]"><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">01 · Our story</p><h2 className="mt-4 max-w-[500px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em] text-[#151116]">Learning should lead to <span className="text-[#4d176e]">something real.</span></h2><div className="mt-6 text-sm leading-7 text-[#6e6072]"><p>The world is moving quickly. People need more than information; they need the confidence to use what they know.</p><p className="mt-5">LEA Labs exists to close the distance between learning and doing. We create room for people to practise, make mistakes, receive guidance, and leave with work they can show.</p><p className="mt-5">That work is the beginning of a wider journey: learning can fuel innovation, innovation can create solutions, and enterprise can turn those solutions into lasting impact.</p></div></div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-20 bg-[#fff7ef] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#4d176e]">02 · How we work</p><h2 className="mt-4 max-w-[600px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.98] tracking-[-0.06em] text-[#151116]">How progress grows at <span className="text-[#f47945]">LEA.</span></h2></div><p className="max-w-[380px] text-sm leading-7 text-[#6e6072]">A clear sequence keeps learning connected to practice, feedback, and the next opportunity.</p></div><div className="relative mt-9"><div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-[#d8c8bc] lg:block" /><div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{growthStages.map(([number, title, text], index) => { const Icon = growthIcons[index]; return <article key={number} className="relative flex flex-col items-center text-center lg:items-start lg:text-left"><div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 ${index % 2 === 0 ? "border-[#f47945] bg-[#fffdfb] text-[#4d176e]" : "border-[#4d176e] bg-[#f6eef9] text-[#f47945]"}`}><Icon className="h-6 w-6" strokeWidth={1.5} /><span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#151116] text-[9px] font-medium text-white">{number}</span></div><h3 className="mt-4 text-lg font-medium tracking-[-0.03em] text-[#151116]">{title}</h3><p className="mt-2 max-w-[235px] text-xs leading-6 text-[#6e6072]">{text}</p></article>; })}</div></div></div>
        </section>

        <section id="mission" className="scroll-mt-20 bg-[#351039] px-5 py-10 text-white sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-4 border-b border-white/15 pb-6 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">03 · Our mission & vision</p><h2 className="mt-4 max-w-[620px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.98] tracking-[-0.06em]">The purpose behind the work, and the future we are building toward.</h2></div><span className="text-xs font-medium text-white/55">Learn → build → contribute</span></div><div className="mt-7 grid gap-5 md:grid-cols-2"><article className="relative overflow-hidden border border-white/15 bg-[#fffdfb] p-6 text-[#17131a] sm:p-8"><div className="absolute right-0 top-0 h-1.5 w-1/2 bg-[#f47945]" /><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f47945] text-[#351039]"><Compass className="h-5 w-5" /></div><span className="text-5xl font-medium leading-none tracking-[-0.08em] text-[#f6eef9]">01</span></div><p className="mt-8 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f47945]">Our mission</p><h3 className="mt-3 max-w-[430px] text-2xl font-medium leading-tight tracking-[-0.04em] text-[#151116]">Build an ecosystem where learning creates movement.</h3><p className="mt-4 max-w-[500px] text-sm leading-7 text-[#6e6072]">To build an ecosystem where learning fuels innovation, innovation creates solutions, and enterprise drives lasting impact.</p><div className="mt-7 h-px w-16 bg-[#4d176e]" /></article><article className="relative overflow-hidden border border-[#f7c2aa]/35 bg-[#f6eef9] p-6 text-[#17131a] sm:p-8"><div className="absolute right-0 top-0 h-1.5 w-1/2 bg-[#4d176e]" /><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4d176e] text-[#f7c2aa]"><Lightbulb className="h-5 w-5" /></div><span className="text-5xl font-medium leading-none tracking-[-0.08em] text-white">02</span></div><p className="mt-8 text-[10px] font-medium uppercase tracking-[0.18em] text-[#4d176e]">Our vision</p><h3 className="mt-3 max-w-[430px] text-2xl font-medium leading-tight tracking-[-0.04em] text-[#151116]">Make LEA a launchpad for digital possibility.</h3><p className="mt-4 max-w-[500px] text-sm leading-7 text-[#6e6072]">To be the ultimate global launchpad for digital talent and sustainable tech enterprises.</p><div className="mt-7 h-px w-16 bg-[#f47945]" /></article></div></div>
        </section>

        <section id="values" className="scroll-mt-20 bg-[#fffdfb] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16">
          <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">04 · What guides us</p><h2 className="mt-4 max-w-[560px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.98] tracking-[-0.06em]">The principles behind the <span className="text-[#4d176e]">work.</span></h2></div><p className="max-w-[380px] text-sm leading-7 text-[#6e6072]">Our values shape the way we learn, build, collaborate, and contribute.</p></div><div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">{values.map((value, index) => { const Icon = valueIcons[index]; return <article key={value.title} className="flex flex-col items-center text-center"><div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${index % 2 === 0 ? "border-[#f47945] bg-[#fff7ef] text-[#4d176e]" : "border-[#4d176e] bg-[#f6eef9] text-[#f47945]"}`}><Icon className="h-7 w-7" strokeWidth={1.5} /></div><span className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a788f]">0{index + 1}</span><h3 className="mt-2 max-w-[180px] text-base font-medium leading-tight tracking-[-0.02em] text-[#151116]">{value.title}</h3><p className="mt-2 max-w-[190px] text-xs leading-6 text-[#6e6072]">{value.text}</p></article>; })}</div></div>
        </section>

        <section id="team" className="scroll-mt-20 bg-[#151116] text-white"><div className="mx-auto grid max-w-[1600px] lg:grid-cols-[0.95fr_1.05fr]"><div className="relative min-h-[330px] overflow-hidden sm:min-h-[420px]"><img src={MENTOR_IMAGE} alt="A mentor supporting a learner at LEA Labs" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#151116]/80 via-[#4d176e]/25 to-[#f47945]/15" /></div><div className="flex items-center px-5 py-10 sm:px-10 sm:py-12 lg:px-16"><div className="max-w-[570px]"><div className="flex items-center gap-3 text-[#f7c2aa]"><Users className="h-5 w-5" /><p className="text-xs font-medium uppercase tracking-[0.18em]">05 · The team</p></div><h2 className="mt-5 text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em]">Progress is personal. It should never happen <span className="text-[#f47945]">alone.</span></h2><p className="mt-6 text-sm leading-7 text-white/65 sm:text-base">LEA brings together educators, mentors, builders, and community connectors to create the conditions for people and ideas to grow.</p><Link href="/corporate" className="mt-7 inline-flex items-center gap-3 border-b border-[#f47945] pb-2 text-xs font-medium text-[#f7c2aa] transition hover:text-white">Work with LEA <ArrowRight className="h-4 w-4" /></Link></div></div></div></section>

        <section className="bg-[#f6eef9] px-5 py-10 sm:px-10 sm:py-12 lg:px-[7vw] lg:py-16"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-[#f47945]">Next step</p><h2 className="mt-5 max-w-[680px] text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em]">Your next chapter can begin with a <span className="text-[#4d176e]">conversation.</span></h2><p className="mt-5 max-w-[620px] text-sm leading-7 text-[#6e6072]">Visit us at Applewood Adams, 13th Floor, Nairobi, or start online by exploring a programme that fits your next move.</p></div><div className="flex flex-col items-start gap-4 lg:items-end"><Link href="mailto:hello@lealabs.africa" className="inline-flex items-center gap-3 bg-[#f47945] px-6 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#4d176e] hover:text-white">Start a conversation <ArrowRight className="h-4 w-4" /></Link><span className="inline-flex items-center gap-2 text-xs font-medium text-[#4d176e]"><MapPin className="h-4 w-4 text-[#f47945]" /> Applewood Adams, 13th Floor</span></div></div></section>
      </main>

      <LandingFooter />
    </div>
  );
}

export const metadata = {
  title: "About LEA Labs",
  description: "Learn about LEA Labs, our story, mission, vision, values, team, and learning ecosystem.",
};
