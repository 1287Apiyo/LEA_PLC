"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SoftwareFormat = { format: string; schedule: string; price: string };
export type SoftwareLevel = {
  level: string;
  title: string;
  description: string;
  duration: string;
  formats: SoftwareFormat[];
};

type SoftwareLevelSelectorProps = {
  levels: SoftwareLevel[];
};

export function SoftwareLevelSelector({ levels }: SoftwareLevelSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLevel = levels[activeIndex];
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < levels.length - 1;

  if (!activeLevel) return null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Software Engineering levels">
          {levels.map((level, index) => (
            <button
              key={level.level}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full px-4 py-2 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] ${activeIndex === index ? "bg-[#4d176e] text-white" : "bg-white text-[#6e6072] hover:bg-[#fff0ea] hover:text-[#4d176e]"}`}
            >
              {level.level}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold text-[#6e6072]">Level {activeIndex + 1} of {levels.length}</p>
      </div>

      <div className="rounded-[22px] border border-[#4d176e]/15 bg-white p-5 shadow-[0_12px_30px_rgba(77,23,110,.06)] sm:p-7" role="tabpanel">
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="text-xl font-semibold text-[#17131a]">{activeLevel.title}</h3>
          <span className="text-sm text-[#6e6072]">· {activeLevel.duration}</span>
        </div>
        <p className="mt-4 max-w-[680px] text-sm leading-6 text-[#6e6072]">{activeLevel.description}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {activeLevel.formats.map((format) => (
            <article key={format.format} className="flex flex-col rounded-[18px] border border-[#4d176e]/15 bg-[#fffdfb] p-5 shadow-[0_8px_20px_rgba(77,23,110,.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(77,23,110,.1)]">
              <h4 className="text-sm font-semibold text-[#17131a]">{format.format}</h4>
              <p className="mt-2 text-xs leading-5 text-[#6e6072]">{format.schedule}</p>
              {format.format === "Full-time Hybrid" && <p className="mt-3 text-xs font-semibold leading-5 text-[#4d176e]">Physical classes: Applewood Adams, 13th Floor, Ngong Road, Nairobi.</p>}
              <div className="mt-auto border-t border-[#4d176e]/12 pt-4">
                <span className="text-xs text-[#6e6072]">Tuition</span>
                <p className="mt-1 text-lg font-black text-[#4d176e]">{format.price}</p>
              </div>
              <Link href="/register" className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#f47945] text-xs font-black text-[#351039] transition hover:bg-[#ff8f57]">Apply <ArrowRight className="ml-1.5 h-3 w-3" /></Link>
            </article>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-[#4d176e]/10 pt-5">
          <button type="button" disabled={!hasPrevious} onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} className="inline-flex items-center gap-2 rounded-full border border-[#4d176e]/20 px-4 py-2 text-xs font-bold text-[#4d176e] transition hover:bg-[#f8f3fa] disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft className="h-3.5 w-3.5" /> Previous level</button>
          <button type="button" disabled={!hasNext} onClick={() => setActiveIndex((index) => Math.min(levels.length - 1, index + 1))} className="inline-flex items-center gap-2 rounded-full bg-[#4d176e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#653086] disabled:cursor-not-allowed disabled:opacity-35">Next level <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
