import Link from "next/link";
import {
  ArrowRight,
  Award,
  Blocks,
  BookOpen,
  CheckCircle2,
  Code2,
  Globe,
  GraduationCap,
  ListChecks,
  MonitorSmartphone,
  PenLine,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/shared/brand-mark";
import { LandingNav } from "@/components/landing/landing-nav";
import { APP_NAME } from "@/lib/constants";

/** Brand claymation hero art + AI-generated course/community art (same CDN). */
const HERO_URL = "https://sc04.alicdn.com/kf/A6f2b031566e04faab49c31d733236971q.jpg";
const IMG_WEB = "https://sc02.alicdn.com/kf/Af0f4eea109874a74b6cef7516f9b765cG.png";
const IMG_SCRATCH = "https://sc02.alicdn.com/kf/A1ee46010362d4c82bb21cbc25870b03aM.png";
const IMG_APP = "https://sc02.alicdn.com/kf/A71df04c861b94427a9cb953f16ee791ay.png";
const IMG_COMPUTER = "https://sc02.alicdn.com/kf/A4c8cf89f9b81412081543ca0191be0e0a.png";
const IMG_COMMUNITY = "https://sc02.alicdn.com/kf/Acbe00248eab8454595dfb91e3c9b5f0bq.png";
const IMG_CODING_PROG = "https://sc02.alicdn.com/kf/Af7fbfa169a714620ba84a5881d21c91f5.png";
const IMG_LITERACY_PROG = "https://sc02.alicdn.com/kf/A2f6683eace5848b29db7e16e1bd228baW.png";

const COURSES = [
  {
    icon: Globe,
    image: IMG_WEB,
    title: "Web Development",
    description:
      "Build your own web pages with HTML and CSS — from your first heading to a published site.",
    meta: "6 lessons · HTML & CSS",
    tag: "Coding",
    accent: "text-primary",
  },
  {
    icon: Blocks,
    image: IMG_SCRATCH,
    title: "Scratch Programming",
    description:
      "Learn to code by snapping blocks together — create animations, stories and games.",
    meta: "6 lessons · Ages 8+",
    tag: "Coding",
    accent: "text-primary",
  },
  {
    icon: MonitorSmartphone,
    image: IMG_APP,
    title: "App Development",
    description:
      "Design and build mobile apps — screens, buttons, data and publishing.",
    meta: "6 lessons · JavaScript",
    tag: "Coding",
    accent: "text-primary",
  },
  {
    icon: ShieldCheck,
    image: IMG_COMPUTER,
    title: "Basic Computer Skills",
    description:
      "Everything a first-time computer user needs — hardware, files, email and online safety.",
    meta: "6 lessons · All ages",
    tag: "Digital Literacy",
    accent: "text-violet-500",
  },
];

const FEATURES = [
  {
    icon: Video,
    title: "Video lessons, built in",
    description:
      "Every lesson opens with a hand-picked YouTube video — watch, pause and replay right inside the player.",
  },
  {
    icon: ListChecks,
    title: "Bite-size steps",
    description:
      "No walls of text. Each lesson is split into steps: watch, learn, try it, challenge, assignment.",
  },
  {
    icon: Code2,
    title: "Live coding workspace",
    description:
      "A real HTML, CSS and JavaScript editor is connected to every coding course — type code, run it, see it work.",
  },
  {
    icon: Blocks,
    title: "Built-in Scratch studio",
    description:
      "A mini Scratch editor with all 9 block categories — motion, looks, sound, events, operators and more.",
  },
  {
    icon: PenLine,
    title: "Assignments that stick",
    description:
      "Every lesson ends with a hands-on mission: build a page, direct a story, hunt a bug, stay safe online.",
  },
  {
    icon: Award,
    title: "Progress you can see",
    description:
      "Track your course progress lesson by lesson, complete your assignments and earn your certificate.",
  },
];

const STEPS = [
  {
    icon: Rocket,
    title: "Create your account",
    description: "Sign up as a learner in under a minute — all you need is a name and an email.",
  },
  {
    icon: BookOpen,
    title: "Pick a course and enrol",
    description: "Choose from coding or digital literacy courses and unlock all lessons instantly.",
  },
  {
    icon: Award,
    title: "Learn step by step",
    description: "Watch, read, practise in the workspace, finish your assignment — and earn your certificate.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle,var(--color-border) 1px,transparent 1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
          />
          <div
            aria-hidden
            className="absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                Built for young learners, schools and teams
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Learn. Explore. <span className="text-primary">Achieve.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {APP_NAME} brings coding, digital literacy and real certificates to the next
                generation — with guided video lessons, hands-on coding workspaces and progress
                you can actually see.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get started — it&apos;s free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Log in to the system</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Already enrolled?{" "}
                <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Log in
                </Link>{" "}
                and continue your journey.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="lea-anim-float-slow absolute -left-4 -top-4 -z-10 h-24 w-24 rounded-2xl bg-primary/15" aria-hidden />
              <div className="lea-anim-float absolute -bottom-5 -right-4 -z-10 h-20 w-20 rounded-full bg-violet-500/15" aria-hidden />
              <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">
                <img
                  src={HERO_URL}
                  alt="A young learner exploring with LEA Labs"
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
              <div className="lea-anim-float absolute -left-5 top-8 hidden rounded-xl border bg-card/95 px-3 py-2 text-xs font-medium shadow-md backdrop-blur sm:block">
                <span className="flex items-center gap-1.5">
                  <PlayCircle className="h-3.5 w-3.5 text-primary" aria-hidden />
                  24 guided lessons
                </span>
              </div>
              <div className="lea-anim-float-slow absolute -right-4 bottom-10 hidden rounded-xl border bg-card/95 px-3 py-2 text-xs font-medium shadow-md backdrop-blur sm:block">
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" aria-hidden />
                  Certificates included
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="border-y bg-muted/40">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:px-6 lg:grid-cols-4">
            {[
              { value: "4", label: "Beginner-friendly courses" },
              { value: "24", label: "Guided lessons with videos" },
              { value: "2", label: "Programmes to grow into" },
              { value: "100%", label: "Hands-on learning" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Programmes ───────────────────────────────────────── */}
        <section id="programmes" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Programmes
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Two programmes, one goal</h2>
            <p className="mt-3 text-muted-foreground">
              Every learner starts somewhere. Our programmes meet them there — and take them further.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={IMG_CODING_PROG}
                  alt="Children building with code blocks — the Coding Programme"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" aria-hidden />
                  <h3 className="text-lg font-semibold">Coding Programme</h3>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  Programming courses for young and future-ready coders — web pages, Scratch
                  stories and mobile apps.
                </p>
                <p className="mt-4 flex flex-wrap gap-2">
                  {["Web Development", "Scratch", "App Development"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={IMG_LITERACY_PROG}
                  alt="A child learning digital skills at a computer — the Digital Literacy programme"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-violet-500" aria-hidden />
                  <h3 className="text-lg font-semibold">Digital Literacy</h3>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  Foundational computer and digital skills for everyone — from first clicks to
                  staying safe online.
                </p>
                <p className="mt-4 flex flex-wrap gap-2">
                  {["Basic Computer Skills", "Online Safety", "Email & Files"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Courses ──────────────────────────────────────────── */}
        <section id="courses" className="border-t bg-muted/40 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Courses
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Courses for every curious mind
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Six lessons per course — video first, then bite-size steps, a hands-on
                  assignment and a coding workspace to practise in.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/register">
                  Start a course
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {COURSES.map((course) => (
                <div
                  key={course.title}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={course.image}
                      alt={`${course.title} course illustration`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur ${
                        course.accent === "text-primary"
                          ? "text-primary"
                          : "text-violet-500"
                      }`}
                    >
                      {course.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <course.icon className={`h-4 w-4 ${course.accent}`} aria-hidden />
                      <h3 className="text-base font-semibold">{course.title}</h3>
                    </div>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {course.description}
                    </p>
                    <p className="mt-4 text-xs font-medium text-muted-foreground">
                      {course.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────── */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Why LEA Labs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Everything a young learner needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              From curious to confident — in one place.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <feature.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-3.5 text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section id="how-it-works" className="border-t bg-muted/40 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                From first visit to first certificate
              </h2>
              <p className="mt-3 text-muted-foreground">
                Three simple steps.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.title} className="relative rounded-2xl border bg-card p-6">
                  <span className="absolute right-5 top-4 text-5xl font-bold text-muted-foreground/15">
                    {index + 1}
                  </span>
                  <step.icon className="h-8 w-8 text-primary" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid overflow-hidden rounded-3xl border bg-primary lg:grid-cols-2">
            <div className="relative px-6 py-12 text-primary-foreground sm:px-12 lg:py-16">
              <div
                aria-hidden
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10"
              />
              <h2 className="relative text-3xl font-bold tracking-tight">
                Ready to start your learning journey?
              </h2>
              <p className="relative mt-3 max-w-xl text-primary-foreground/90">
                Create your free account, pick a course and take your first step today. Your
                certificate is waiting.
              </p>
              <div className="relative mt-7 flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Create a free account
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  asChild
                >
                  <Link href="/login">I already have an account</Link>
                </Button>
              </div>
            </div>
            <div className="relative min-h-56">
              <img
                src={IMG_COMMUNITY}
                alt="Happy learners celebrating in an LEA Labs classroom"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <BrandMark className="h-8 w-8" />
                <span className="text-base font-semibold uppercase tracking-wider text-primary">
                  {APP_NAME}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Learn. Explore. Achieve. — digital literacy, coding and real certificates for
                the next generation of creators.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Explore
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><a href="#programmes" className="text-muted-foreground hover:text-foreground">Programmes</a></li>
                  <li><a href="#courses" className="text-muted-foreground hover:text-foreground">Courses</a></li>
                  <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground">How it works</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Access
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link href="/login" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Create account
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-5 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. Learning for every future-ready learner.
          </div>
        </div>
      </footer>
    </div>
  );
}
