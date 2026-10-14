import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { ProjectOutcome } from "@/lib/programmes";

type ProgrammeProjectsProps = {
  projects: ProjectOutcome[];
};

const PROJECT_POSTER_IMAGES: Record<string, string> = {
  "Community services directory": "/posters/projects/software-engineering-01.png",
  "Daraja payment simulator": "/posters/projects/software-engineering-02.png",
  "Google-connected operations tool": "/posters/projects/software-engineering-03.png",
  "AI-integrated learning portal": "/posters/projects/applied-ai-02.png",
  "Python data brief": "/posters/projects/applied-ai-01.png",
  "Customer-support AI assistant": "/posters/projects/applied-ai-02.png",
  "AI research and verification studio": "/posters/projects/applied-ai-03.png",
  "Vision or prediction prototype": "/posters/projects/applied-ai-04.png",
  "My digital workspace": "/posters/projects/digital-foundations-01.png",
  "Safer online choices guide": "/posters/projects/digital-foundations-02.png",
  "First helpful digital product": "/posters/projects/digital-foundations-04.png",
};

const PROJECT_LABELS: Record<string, string> = {
  "Community services directory": "WEB PRODUCT",
  "Daraja payment simulator": "PAYMENTS",
  "Google-connected operations tool": "OPERATIONS TOOL",
  "AI-integrated learning portal": "AI PRODUCT",
  "Python data brief": "DATA LAB",
  "Customer-support AI assistant": "AI WORKFLOW",
  "AI research and verification studio": "RESEARCH",
  "Vision or prediction prototype": "VISION & PREDICTION",
  "My digital workspace": "DIGITAL FOUNDATIONS",
  "Safer online choices guide": "ONLINE SAFETY",
  "First helpful digital product": "DIGITAL PROJECT",
};

export function ProgrammeProjects({ projects }: ProgrammeProjectsProps) {
  return (
    <section id="projects" className="scroll-mt-20 bg-white px-5 py-14 text-[#1f2933] sm:px-10 sm:py-16 lg:px-[7vw] lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-5 border-t border-[#eadfd7] pt-8 sm:flex-row sm:items-end">
          <div className="max-w-[820px]">
            <p className="text-[clamp(1.8rem,3vw,3rem)] font-normal leading-none tracking-[-.05em] text-[#151116]">What you will build</p>
            <h2 className="mt-2 text-sm font-medium leading-6 text-[#4b5563]">Leave with work people can see and use.</h2>
          </div>
          <p className="max-w-[300px] text-sm leading-6 text-[#1f2933]">Move your cursor over a poster to see the build, tools, and portfolio evidence.</p>
        </div>

        <div className="-mx-5 mt-8 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin] sm:-mx-10 sm:px-10 lg:-mx-[7vw] lg:px-[7vw]">
          <div className="flex w-max gap-5">
            {projects.map((project, index) => {
              const posterImage = PROJECT_POSTER_IMAGES[project.title] ?? "/posters/projects/software-engineering-01.png";
              return (
                <article key={project.title} tabIndex={0} aria-label={`${project.title}. Hover or focus to reveal project details.`} className="group relative h-[370px] w-[296px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-[#6d4388] bg-[#2d163b] text-white shadow-[0_12px_30px_rgba(31,13,46,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2">
                  <Image src={posterImage} alt="" fill sizes="296px" className="scale-110 object-cover blur-[4px] brightness-[0.42] saturate-[0.72] transition duration-700 group-hover:scale-[1.14]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-[#4d176e]/55" />
                  <div className="absolute inset-0 flex flex-col p-5">
                    <div className="flex items-center justify-between border-b border-white/30 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#ffad7f]">Project {String(index + 1).padStart(2, "0")}</span>
                      <ArrowUpRight className="h-5 w-5 text-white" aria-hidden />
                    </div>
                    <div className="mt-auto">
                      <p className="text-[10px] font-black tracking-[.2em] text-[#ffad7f]">{PROJECT_LABELS[project.title] ?? "PORTFOLIO BUILD"}</p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-[-.04em] text-white">{project.title}</h3>
                      <p className="mt-3 text-xs font-semibold text-white/90">Hover to explore</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex translate-y-full flex-col justify-end bg-[#1f0d2e]/95 p-5 text-white transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#ffad7f]">{PROJECT_LABELS[project.title] ?? "PROJECT DETAILS"}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-.04em] text-white">{project.title}</h3>
                    <p className="mt-3 text-xs leading-[1.55] text-white">{project.build}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.integrations.map((integration) => <span key={integration} className="rounded-full border border-white/45 bg-white/10 px-2.5 py-1 text-[9px] font-semibold leading-tight text-white">{integration}</span>)}
                    </div>
                    <div className="mt-4 flex items-start gap-2 border-t border-white/30 pt-3 text-[10px] leading-[1.5] text-white">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ffad7f]" aria-hidden />
                      <p><strong className="text-white">Evidence:</strong> {project.evidence}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <p className="mt-3 max-w-[980px] text-xs leading-6 text-[#4b5563]">API work starts with mocks and sandboxes. Daraja projects never handle real money in class. Google device-management examples use mock devices or read-only test data; learners do not lock, wipe, or change real devices.</p>
      </div>
    </section>
  );
}
