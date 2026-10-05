"use client";

import { useState } from "react";

const reasons = [
  { label: "People first", title: "Start with the people, not the platform.", text: "We listen to the people who will use, run, and grow with what we build. That keeps the work grounded in real needs and real context.", proof: "Better fit. Faster adoption." },
  { label: "Useful by design", title: "Make technology earn its place.", text: "Clear thinking and simple experiences turn complicated requirements into products and systems people can use with confidence.", proof: "Less friction. More momentum." },
  { label: "Built to last", title: "Choose foundations you can build on.", text: "We make sensible technical decisions, document the important parts, and leave your team with a stronger base for what comes next.", proof: "Strong foundations. Room to grow." },
  { label: "Real progress", title: "Move from conversation to something tangible.", text: "You see the work take shape through clear priorities, regular feedback, and delivery that keeps the outcome in view.", proof: "Visible progress. Useful outcomes." },
  { label: "LEA Labs", title: "A practical foundation for what comes next.", text: "The layers work together: people, design, strong systems, and visible progress, brought together by LEA Labs.", proof: "One partner. A stronger foundation." },
];

const layerFaces = [
  { top: "#22a9dc", front: "#0791c5", side: "#0a7fae" },
  { top: "#22baa1", front: "#079b83", side: "#0b8f7c" },
  { top: "#f6a218", front: "#e08308", side: "#ce7105" },
  { top: "#f14927", front: "#d93618", side: "#b92e15" },
  { top: "#444444", front: "#303030", side: "#252525" },
];

export function WhyLeaStack() {
  const [selected, setSelected] = useState(0);
  const current = reasons[selected];

  return (
    <section className="bg-white px-5 pb-10 pt-12 sm:px-10 sm:py-14 lg:px-[7vw]">
      <style jsx>{`@keyframes leaPanelIn { from { opacity: 0; transform: translateX(-22px) translateY(8px); } to { opacity: 1; transform: translateX(0) translateY(0); } }`}</style>
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="mx-auto w-full max-w-[540px] lg:mx-0">
            <div className="relative mx-auto h-[540px] w-[min(100%,360px)]">
              {reasons.slice(0, -1).map((_, index) => <span key={`separator-${index}`} aria-hidden="true" className="pointer-events-none absolute left-1/2 z-30 h-[18px] w-[6px] -translate-x-1/2" style={{ top: `${index * 100 + 82}px`, background: `linear-gradient(to bottom, ${layerFaces[index].front}, ${layerFaces[index + 1].top})` }} />)}
              {reasons.map((reason, index) => {
                const faces = layerFaces[index];
                const isSelected = selected === index;
                return <button key={reason.label} type="button" onClick={() => setSelected(index)} aria-pressed={isSelected} aria-label={`Select ${reason.label}`} className={`absolute left-1/2 h-[94px] w-[270px] -translate-x-1/2 text-left transition duration-300 focus-visible:z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-4 ${isSelected ? "z-20 drop-shadow-[0_18px_14px_rgba(31,29,26,.25)]" : "z-10 hover:z-40 hover:-translate-y-1 hover:drop-shadow-[0_12px_10px_rgba(31,29,26,.18)]"}`} style={{ top: `${index * 100}px` }}><span className="absolute inset-0" style={{ background: faces.front, clipPath: "polygon(0 45%, 50% 90%, 100% 45%, 100% 58%, 50% 100%, 0 58%)" }} /><span className="absolute inset-0" style={{ background: faces.side, clipPath: "polygon(50% 90%, 100% 45%, 100% 58%, 50% 100%)" }} /><span className="absolute inset-0 z-[1]" style={{ background: isSelected ? "#f47945" : faces.top, clipPath: "polygon(50% 0, 100% 45%, 50% 90%, 0 45%)" }} /><span className="absolute left-1/2 top-[25px] z-10 w-[72%] -translate-x-1/2 text-center text-[10px] font-bold uppercase tracking-[.1em] text-white">{reason.label}</span></button>;
              })}
            </div>
          </div>
          <div><div className="mb-6 max-w-[560px]"><h2 className="text-[clamp(1.75rem,2.8vw,3rem)] font-semibold leading-[.98] tracking-[-.055em] text-[#151116]">Good technology should make work <span className="text-[#1f0d2e]">feel clearer.</span></h2><p className="mt-4 text-sm leading-7 text-[#6e6072]">Select a layer to see how we approach the work behind every product, system, and decision.</p></div><div key={current.label} className="min-h-[270px] rounded-lg border border-[#d8d5cf] bg-white p-7 sm:p-10" style={{ animation: "leaPanelIn 420ms cubic-bezier(.2,.8,.2,1)" }}><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#f47945]">{current.label}</p><h3 className="mt-4 max-w-[560px] text-[clamp(1.75rem,2.8vw,2.9rem)] font-medium leading-[.95] tracking-[-.05em] text-[#211d1a]">{current.title}</h3><p className="mt-5 max-w-[560px] text-sm leading-7 text-[#6b6961]">{current.text}</p><div className="mt-7 border-t border-[#d8d5cf] pt-5 text-sm font-medium text-[#211d1a]">{current.proof}</div></div></div>
        </div>
      </div>
    </section>
  );
}
