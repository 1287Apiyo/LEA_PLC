"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { courseService, type CourseCatalogItem } from "@/services/courses";
import { resourceService, type ResourceRow } from "@/services/resources";
import { PROGRAMMES } from "@/lib/programmes";

interface ProgrammeSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  level: string;
  price: string;
  outcomes: string[];
  skills: string[];
  short: string;
  audience: string;
  bullets: string[];
  icon: string;
  image: string;
}

interface ProgrammeGroup {
  programme: ProgrammeSummary;
  courses: CourseCatalogItem[];
}

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const PROGRAMME_CARD_IMAGES: Record<string, string> = {
  "software-engineering": "/lea-home-program-software.png",
  "applied-ai": "/lea-home-program-ai.png",
  "basic-computer-knowledge": "/lea-home-program-computers.png",
};

const toProgramme = (row: ResourceRow): ProgrammeSummary => {
  const id = String(row.id ?? "programme");
  const sourceTitle = String(row.title ?? row.name ?? "Programme");
  const staticProgramme = PROGRAMMES.find((item) =>
    item.catalogueKeys?.includes(id) || item.title.toLowerCase() === sourceTitle.toLowerCase() || (item.slug === "basic-computer-knowledge" && sourceTitle.toLowerCase() === "basic computer knowledge")
  );
  const title = staticProgramme?.title ?? sourceTitle;

  return {
    id,
    slug: staticProgramme?.slug ?? slugify(title),
    title,
    description: staticProgramme?.short ?? String(row.description ?? "A practical pathway built around guided projects and evidence."),
    order: staticProgramme ? PROGRAMMES.indexOf(staticProgramme) : Number(row.order ?? 99),
    duration: staticProgramme?.duration ?? String(row.duration ?? "Self-paced"),
    level: String(row.level ?? "Applied"),
    price: staticProgramme?.price ?? String(row.price ?? ""),
    outcomes: toStringArray(row.outcomes),
    skills: toStringArray(row.skills),
    short: staticProgramme?.short ?? String(row.short ?? "A practical pathway built around guided projects and evidence."),
    audience: staticProgramme?.audience ?? String(row.audience ?? "For learners ready to take a practical next step."),
    bullets: staticProgramme?.bullets ?? (toStringArray(row.bullets).length > 0 ? toStringArray(row.bullets) : []),
    icon: staticProgramme?.icon ?? String(row.icon ?? "✦"),
    image: staticProgramme ? PROGRAMME_CARD_IMAGES[staticProgramme.slug] ?? staticProgramme.image : String(row.image ?? "/lea-hero-purple-orange.png"),
  };
};

/** Learner catalogue — choose a programme, then open its dedicated module page. */
export function CourseCatalog() {
  const [search, setSearch] = useState("");

  const coursesQuery = useQuery({
    queryKey: ["course-catalog"],
    queryFn: () => courseService.catalog(),
  });

  const programmesQuery = useQuery({
    queryKey: ["programme-catalog"],
    queryFn: () => resourceService.list("programmes", { page: 1, per_page: 50, sort: "order", order: "asc" }),
  });

  const courses = useMemo(() => coursesQuery.data?.data ?? [], [coursesQuery.data?.data]);
  const programmeRows = programmesQuery.data?.data;

  const groups = useMemo<ProgrammeGroup[]>(() => {
    const programmeMap = new Map<string, ProgrammeSummary>();
    (programmeRows ?? []).forEach((row) => {
      const programme = toProgramme(row);
      programmeMap.set(programme.id, programme);
    });

    courses.forEach((course) => {
      if (!programmeMap.has(course.programme_id)) {
        programmeMap.set(course.programme_id, {
          id: course.programme_id,
          slug: slugify(course.programme || course.programme_id),
          title: course.programme || "Programme",
          description: "A practical LEA Labs pathway built around guided practice and real work.",
          order: course.programme_order,
          duration: "Practical pathway",
          level: course.level,
          price: "",
          outcomes: [],
          skills: [],
          short: "A practical LEA Labs pathway built around guided practice and real work.",
          audience: "For learners ready to take a practical next step.",
          bullets: [],
          icon: "✦",
          image: "/lea-hero-purple-orange.png",
        });
      }
    });

    const query = search.trim().toLowerCase();
    return [...programmeMap.values()]
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      .map((programme) => {
        const programmeCourses = courses
          .filter((course) => course.programme_id === programme.id)
          .sort((a, b) => a.sequence - b.sequence || a.title.localeCompare(b.title));

        if (!query) return { programme, courses: programmeCourses };

        const programmeMatches = `${programme.title} ${programme.description} ${programme.skills.join(" ")}`
          .toLowerCase()
          .includes(query);

        return {
          programme,
          courses: programmeMatches
            ? programmeCourses
            : programmeCourses.filter((course) =>
                `${course.title} ${course.description} ${course.summary} ${course.skills.join(" ")}`
                  .toLowerCase()
                  .includes(query)
              ),
        };
      })
      .filter(({ programme, courses: programmeCourses }) => {
        if (!query) return true;
        return programmeCourses.length > 0 || `${programme.title} ${programme.description}`.toLowerCase().includes(query);
      });
  }, [courses, programmeRows, search]);

  const isLoading = coursesQuery.isLoading || programmesQuery.isLoading;
  const isError = coursesQuery.isError || programmesQuery.isError;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons_count, 0);
  const enrolledCourses = courses.filter((course) => course.enrolled).length;

  return (
    <div className="space-y-7 pb-8">
      <PageHeader
        title="Choose your programme"
        description="Three practical paths. Open a programme to see every module in sequence, then choose the course that feels right for your next step."
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search programmes…"
              aria-label="Search programmes and courses"
              className="w-52 rounded-xl bg-background pl-8 sm:w-64"
            />
          </div>
        }
      />

      <section className="relative overflow-hidden border-y border-[#eee7f2] bg-[#fffdfb] px-1 py-2 sm:py-3">
        <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full border border-[#4d176e]/10" aria-hidden />
        <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="max-w-xl text-xl font-semibold leading-[1] tracking-[-0.045em] text-[#151116] sm:text-2xl">Choose a practical path forward.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e6072]">Choose between <span className="font-semibold text-[#4d176e]">Software Engineering</span>, <span className="font-semibold text-[#4d176e]">Applied AI</span>, and <span className="font-semibold text-[#4d176e]">Digital Foundations</span>. Open a card to see the complete module sequence.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#6e6072]">
            <span>{groups.length} programmes</span><span>{courses.length} courses</span><span>{enrolledCourses} in progress</span>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="overflow-hidden rounded-[1.5rem]">
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-7 w-4/5" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="rounded-[1.5rem]">
          <CardContent className="flex items-start gap-3 p-5 text-sm text-muted-foreground">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#f47945]" aria-hidden />
            <div><p className="font-medium text-foreground">We could not load the programmes.</p><p className="mt-1">Refresh the page or sign in again if your session has expired.</p></div>
          </CardContent>
        </Card>
      ) : groups.length === 0 ? (
        <Card className="rounded-[1.5rem]"><CardContent className="p-6 text-sm text-muted-foreground">{search ? "No programmes or courses match your search." : "No programmes are available yet."}</CardContent></Card>
      ) : (
        <section aria-labelledby="programme-cards-title" className="space-y-4">
          <h2 id="programme-cards-title" className="sr-only">LEA Labs programmes</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {groups.map(({ programme, courses: programmeCourses }, index) => (
              <ProgrammeCard key={programme.id} programme={programme} courses={programmeCourses} index={index} />
            ))}
          </div>
          <p className="mt-1 text-xs font-semibold text-[#6e6072]">{totalLessons} lessons across the catalogue · open a programme to explore its modules</p>
        </section>
      )}
    </div>
  );
}

function ProgrammeCard({
  programme,
  courses,
  index,
}: {
  programme: ProgrammeSummary;
  courses: CourseCatalogItem[];
  index: number;
}) {
  const lessonCount = courses.reduce((sum, course) => sum + course.lessons_count, 0);
  const enrolledCount = courses.filter((course) => course.enrolled).length;

  return (
    <Link
      href={`/learner/programmes/${programme.slug}`}
      className="group block overflow-hidden rounded-[26px] border border-[#f47945]/65 bg-white text-left shadow-[0_18px_45px_rgba(77,23,110,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#f47945] hover:shadow-[0_26px_60px_rgba(77,23,110,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[1.45] overflow-hidden bg-[#1f0d2e]">
        <Image src={programme.image} alt={`${programme.title} programme`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241027]/80 via-[#351039]/15 to-transparent" />
        <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f47945] text-xs font-black text-[#351039]">{String(index + 1).padStart(2, "0")}</div>
        <span className="absolute bottom-5 right-5 text-4xl font-semibold text-white/90" aria-hidden>{programme.icon}</span>
      </div>
      <div className="flex min-h-[19rem] flex-col p-5 sm:p-6">
        <h3 className="max-w-[270px] text-[clamp(1.2rem,1.5vw,1.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#f06d36]">{programme.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#302434]">{programme.short}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6e6072]">{programme.audience}</p>
        {programme.bullets.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{programme.bullets.slice(0, 3).map((bullet) => <span key={bullet} className="rounded-full border border-[#4d176e]/35 px-3 py-1.5 text-[10px] font-semibold text-[#4d176e]">{bullet}</span>)}</div> : null}
        <div className="mt-4 flex items-center justify-between border-t border-[#efcfc1] pt-4"><span className="text-xs text-[#6e6072]">{programme.slug === "software-engineering" ? "Foundation Track fees" : "Full programme"}</span><span className="text-sm font-black text-[#4d176e]">{programme.price}</span></div>
        <div className="mt-4 flex items-center justify-between gap-3"><span className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#f47945] text-xs font-black text-[#351039] transition group-hover:bg-[#ff8f57]">View modules <ArrowRight className="h-4 w-4" /></span>{enrolledCount > 0 ? <span className="text-[11px] font-medium text-[#b94920]">{enrolledCount} in progress</span> : null}</div>
      </div>
    </Link>
  );
}
