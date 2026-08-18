import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffdfb] text-[#17131a] selection:bg-[#f47945]/25">
      <LandingNav />
      <main>
        <section className="bg-[#f6eef9] px-5 py-14 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#4d176e]">About LEA Labs</p>
              <h1 className="mt-5 max-w-[690px] text-[clamp(2.7rem,5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.07em] text-[#151116]">Learn, <span className="text-[#4d176e]">evolve,</span> and advance.</h1>
              <p className="mt-6 max-w-[560px] text-base leading-8 text-[#6e6072]">LEA Labs is a practical learning ecosystem where people build skills, explore ideas, and create a path toward meaningful digital work.</p>
              <Link href="#story" className="mt-7 inline-flex items-center gap-3 bg-[#f47945] px-5 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#4d176e] hover:text-white">Our story <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="relative min-h-[350px] overflow-hidden bg-[#4d176e] sm:min-h-[440px]"><img src={COMMUNITY_IMAGE} alt="People learning and connecting at LEA Labs" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#351039]/75 via-[#4d176e]/20 to-[#f47945]/20" /></div>
          </div>
        </section>

        <section id="story" className="scroll-mt-20 px-5 py-14 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="mx-auto max-w-[1440px]"><div className="max-w-[860px]"><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#f47945]">Our Story</p><h2 className="mt-5 max-w-[750px] text-[clamp(2rem,3.6vw,4rem)] font-medium leading-[0.95] tracking-[-0.065em] text-[#151116]">Learning should lead to <span className="text-[#4d176e]">something real.</span></h2><p className="mt-6 max-w-[680px] text-base leading-8 text-[#6e6072]">The world is changing quickly, but learning is often separated from the confidence to use it. LEA Labs was created to close that distance. We give learners room to practise, make mistakes, receive guidance, and leave with work they can show.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3"><div className="bg-[#f6eef9] p-6"><div className="text-3xl font-medium text-[#f47945]">01</div><h3 className="mt-6 text-xl font-medium tracking-[-0.03em]">Understand</h3><p className="mt-3 text-sm leading-7 text-[#6e6072]">Find your starting point and understand the direction you want to take.</p></div><div className="bg-[#fff0e8] p-6"><div className="text-3xl font-medium text-[#4d176e]">02</div><h3 className="mt-6 text-xl font-medium tracking-[-0.03em]">Practise</h3><p className="mt-3 text-sm leading-7 text-[#6e6072]">Turn concepts into working habits through projects and focused challenge.</p></div><div className="bg-[#4d176e] p-6 text-white"><div className="text-3xl font-medium text-[#f7c2aa]">03</div><h3 className="mt-6 text-xl font-medium tracking-[-0.03em]">Advance</h3><p className="mt-3 text-sm leading-7 text-white/70">Leave with stronger evidence, clearer confidence, and a next step.</p></div></div></div>
        </section>

        <section id="different" className="scroll-mt-20 bg-[#fff7ef] px-5 py-14 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-18"><div className="relative min-h-[380px] overflow-hidden bg-[#4d176e] sm:min-h-[480px]"><img src={COLLABORATION_IMAGE} alt="LEA learners collaborating on a practical project" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#351039]/75 via-[#4d176e]/15 to-[#f47945]/20" /></div><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#f47945]">What Makes Us Different</p><h2 className="mt-5 max-w-[540px] text-[clamp(2rem,3.5vw,3.8rem)] font-medium leading-[0.95] tracking-[-0.06em] text-[#151116]">We make learning <span className="text-[#4d176e]">practical.</span></h2><p className="mt-6 max-w-[520px] text-base leading-8 text-[#6e6072]">LEA is built around doing. Our programmes connect learning with projects, mentors, peers, and the realities of work.</p><div className="mt-8 space-y-5 border-t border-[#e0d1d9] pt-6"><div><h3 className="text-lg font-medium">Practice over performance</h3><p className="mt-2 text-sm leading-7 text-[#6e6072]">You do not have to arrive ready. You build readiness through useful work.</p></div><div><h3 className="text-lg font-medium">People in the process</h3><p className="mt-2 text-sm leading-7 text-[#6e6072]">Mentors, peers, and practitioners make the next step clearer.</p></div><div><h3 className="text-lg font-medium">A path beyond the classroom</h3><p className="mt-2 text-sm leading-7 text-[#6e6072]">Capability connects to opportunity, innovation, and enterprise.</p></div></div></div></div>
        </section>

        <section id="mission" className="scroll-mt-20 bg-[#4d176e] px-5 py-14 text-white sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="mx-auto max-w-[1440px]"><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#f7c2aa]">Mission and Vision</p><div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-18"><div><h2 className="text-2xl font-medium text-[#f7c2aa]">Our Mission</h2><p className="mt-5 max-w-[560px] text-2xl leading-9 text-white sm:text-3xl">To build an ecosystem where learning fuels innovation, innovation creates solutions, and enterprise drives lasting impact.</p></div><div><h2 className="text-2xl font-medium text-[#f7c2aa]">Our Vision</h2><p className="mt-5 max-w-[560px] text-2xl leading-9 text-[#fff0e8] sm:text-3xl">To be the ultimate global launchpad for digital talent and sustainable tech enterprises.</p></div></div></div>
        </section>

        <section id="values" className="scroll-mt-20 px-5 py-14 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-18"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#4d176e]">Our Core Values</p><h2 className="mt-5 max-w-[470px] text-[clamp(2rem,3.5vw,3.8rem)] font-medium leading-[0.95] tracking-[-0.06em]">How we choose to <span className="text-[#f47945]">work.</span></h2><p className="mt-6 max-w-[410px] text-sm leading-7 text-[#6e6072]">These values shape the way we learn, build, collaborate, and contribute.</p></div><div className="grid gap-0 border-t border-[#ded3df] sm:grid-cols-2">{values.map((value, index) => <div key={value.title} className="border-b border-[#ded3df] py-5 sm:px-5"><div className={`mb-4 h-2.5 w-2.5 rounded-full ${index % 2 === 0 ? "bg-[#f47945]" : "bg-[#4d176e]"}`} /><h3 className="text-lg font-medium tracking-[-0.03em]">{value.title}</h3><p className="mt-2 text-sm leading-7 text-[#6e6072]">{value.text}</p></div>)}</div></div>
        </section>

        <section id="team" className="scroll-mt-20 bg-[#151116] text-white"><div className="mx-auto grid max-w-[1600px] lg:grid-cols-[0.95fr_1.05fr]"><div className="relative min-h-[390px] overflow-hidden sm:min-h-[500px]"><img src={MENTOR_IMAGE} alt="LEA mentor supporting a learner" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#151116]/80 via-[#4d176e]/25 to-[#f47945]/15" /></div><div className="flex items-center px-5 py-14 sm:px-10 sm:py-18 lg:px-16"><div className="max-w-[570px]"><div className="flex items-center gap-3 text-[#f7c2aa]"><Users className="h-5 w-5" /><p className="text-xs font-medium uppercase tracking-[0.2em]">The Team</p></div><h2 className="mt-5 text-[clamp(2rem,3.5vw,3.8rem)] font-medium leading-[0.95] tracking-[-0.06em]">Progress is personal. It should never happen <span className="text-[#f47945]">alone.</span></h2><p className="mt-6 text-sm leading-7 text-white/65 sm:text-base">LEA Labs brings together educators, mentors, builders, and community connectors to create the conditions for people and ideas to grow.</p></div></div></div></section>

        <section id="location" className="scroll-mt-20 bg-[#f6eef9] px-5 py-14 sm:px-10 sm:py-18 lg:px-[7vw] lg:py-22"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#f47945]">Find us</p><h2 className="mt-5 max-w-[650px] text-[clamp(2.1rem,3.7vw,4rem)] font-medium leading-[0.95] tracking-[-0.065em]">Your next chapter can begin with a <span className="text-[#4d176e]">conversation.</span></h2><p className="mt-5 max-w-[610px] text-sm leading-7 text-[#6e6072] sm:text-base">Visit us at Applewood Adams, 13th Floor, Nairobi, Kenya. Ask a question, explore a programme, or tell us what you are trying to build.</p></div><div className="flex flex-col items-start gap-4 lg:items-end"><Link href="mailto:hello@lealabs.africa" className="inline-flex items-center gap-3 bg-[#f47945] px-6 py-3 text-xs font-medium text-[#351039] transition hover:bg-[#4d176e] hover:text-white">Start a conversation <ArrowRight className="h-4 w-4" /></Link><span className="inline-flex items-center gap-2 text-xs font-medium text-[#4d176e]"><MapPin className="h-4 w-4 text-[#f47945]" /> Applewood Adams, 13th Floor</span></div></div></section>
      </main>
      <LandingFooter />
    </div>
  );
}

export const metadata = {
  title: "About LEA Labs",
  description: "Learn about LEA Labs, our story, mission, vision, values, team, and learning ecosystem.",
};
