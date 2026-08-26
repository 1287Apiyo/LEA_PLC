"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type MobileCarouselProps = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  header?: ReactNode;
  showControls?: boolean;
  showHeadingNextControl?: boolean;
};

export function MobileCarousel({ children, ariaLabel, className = "", header, showControls = true, showHeadingNextControl = false }: MobileCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {header ? <div className={`relative ${showHeadingNextControl ? "pr-14 md:pr-0" : ""}`}>
        {header}
        {showHeadingNextControl ? <button type="button" aria-label={`Next ${ariaLabel}`} onClick={() => move(1)} className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#f47945] bg-white text-[#4d176e] shadow-sm transition hover:bg-[#f47945] hover:text-[#351039] md:hidden"><ChevronRight className="h-6 w-6" strokeWidth={2.5} /></button> : null}
      </div> : null}
      {showControls ? <>
        <button
          type="button"
          aria-label={`Previous ${ariaLabel}`}
          onClick={() => move(-1)}
          className="absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#4d176e]/20 bg-white/95 text-[#4d176e] shadow-md transition hover:bg-[#4d176e] hover:text-white md:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={`Next ${ariaLabel}`}
          onClick={() => move(1)}
          className="absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#4d176e]/20 bg-white/95 text-[#4d176e] shadow-md transition hover:bg-[#4d176e] hover:text-white md:hidden"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </> : null}
      <div
        ref={trackRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}

export default MobileCarousel;
