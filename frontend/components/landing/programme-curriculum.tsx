import { ChevronDown, Clock3, GitBranch } from "lucide-react";
import type { CurriculumItem } from "@/lib/programmes";

type ProgrammeCurriculumProps = {
  items: CurriculumItem[];
};

export function ProgrammeCurriculum({ items }: ProgrammeCurriculumProps) {
  return (
    <div className="mt-10">
      <div className="relative -mx-5 overflow-x-auto px-5 pb-4 sm:-mx-10 sm:px-10 lg:mx-0 lg:overflow-visible lg:px-0">
        <div className="relative flex min-w-max gap-3 lg:grid lg:min-w-0 lg:grid-cols-7 lg:gap-0">
          <div aria-hidden="true" className="absolute left-6 right-6 top-6 hidden h-px bg-[#d9cbdc] lg:block" />
          {items.map((item, index) => {
            const isBreak = item.type === "break";
            return (
              <article
                key={`${item.number}-${item.title}`}
                className={`relative w-[178px] shrink-0 rounded-[18px] border p-4 lg:w-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pr-3 ${
                  isBreak
                    ? "border-dashed border-[#f47945]/60 bg-[#fff7ef] lg:bg-transparent"
                    : "border-[#d9cbdc] bg-white shadow-[0_12px_30px_rgba(77,23,110,0.06)] lg:shadow-none"
                }`}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      isBreak ? "border border-dashed border-[#f47945] bg-[#fff7ef] text-[#f06d36]" : "bg-[#f47945] text-[#351039]"
                    }`}
                  >
                    {isBreak ? "BREAK" : item.number}
                  </span>
                  {index < items.length - 1 && <GitBranch className="h-3.5 w-3.5 text-[#d2c0d6] lg:hidden" />}
                </div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#8a748e]">{item.weeks}</p>
                <h3 className={`mt-2 text-base font-bold leading-[1.08] tracking-[-0.03em] ${isBreak ? "text-[#f06d36]" : "text-[#4d176e]"}`}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6e6072]">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 divide-y divide-[#eadfe9] border-y border-[#eadfe9]">
        {items.map((item) => {
          const isBreak = item.type === "break";
          return (
            <details key={`detail-${item.number}-${item.title}`} className="group py-1" open={!isBreak && item.number === items[0]?.number}>
              <summary className="flex cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    isBreak ? "border border-dashed border-[#f47945] bg-[#fff7ef] text-[#f06d36]" : "bg-[#4d176e] text-white"
                  }`}
                >
                  {isBreak ? "BREAK" : item.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-base font-bold tracking-[-0.02em] ${isBreak ? "text-[#f06d36]" : "text-[#17131a]"}`}>{item.title}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#8a748e]"><Clock3 className="h-3 w-3" /> {item.weeks}</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#4d176e] transition group-open:rotate-180" />
              </summary>
              <div className="ml-[52px] max-w-[760px] pb-5 pr-2">
                <p className="text-base leading-7 text-[#6e6072]">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.topics.map((topic) => (
                    <span key={topic} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${isBreak ? "border-[#f47945]/35 bg-[#fff7ef] text-[#f06d36]" : "border-[#4d176e]/20 bg-[#f6eef9] text-[#4d176e]"}`}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
