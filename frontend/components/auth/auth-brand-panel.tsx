import { Star } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Claymation-style hero — the brand's creative, playful illustration. */
const HERO_URL = "https://sc04.alicdn.com/kf/A6f2b031566e04faab49c31d733236971q.jpg";

/** Small floating "window" panel that echoes the hero's floating UI. */
function FloatingWindow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute z-10 rounded-xl bg-white/95 p-2 shadow-lg ring-1 ring-black/5 backdrop-blur",
        className
      )}
    >
      <div className="flex gap-1 pb-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-rose-400" />
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
      {children}
    </div>
  );
}

/** Audio waveform + playhead (echoes the hero's audio editor panel). */
function AudioWave() {
  const bars = [6, 12, 9, 16, 8, 14, 10, 18, 12, 8, 14, 9, 16, 10, 13];
  return (
    <div className="relative flex h-10 w-28 items-end gap-[3px] px-2">
      {bars.map((h, i) => (
        <span
          key={i}
          aria-hidden
          className="w-[3px] rounded-sm bg-violet-500"
          style={{ height: `${h}px` }}
        />
      ))}
      <span aria-hidden className="absolute bottom-0 left-1/2 top-0 w-px bg-slate-400" />
    </div>
  );
}

/** Mini timeline tracks (echoes the hero's timeline panel). */
function MiniTimeline() {
  return (
    <div className="space-y-1.5 px-2 pb-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} aria-hidden className="h-4 w-5 rounded-sm bg-violet-400/70" />
        ))}
      </div>
      <div aria-hidden className="h-1.5 w-28 rounded-full bg-emerald-400" />
      <div aria-hidden className="h-1.5 w-24 rounded-full bg-violet-400" />
    </div>
  );
}

/** Brand mark + LEA LABS wordmark (orange caps), used on auth screens. */
export function AuthBrand() {
  return (
    <div className="flex items-center gap-3">
      <BrandMark className="h-9 w-9 shrink-0 drop-shadow-sm" />
      <span className="text-xl font-semibold uppercase tracking-wider text-primary">
        {APP_NAME}
      </span>
    </div>
  );
}

/** The purple brand side panel shown on desktop auth screens. */
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* soft floating shapes */}
      <div aria-hidden className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-white/10" />
      <div aria-hidden className="lea-anim-float-slow absolute -left-14 bottom-24 h-32 w-32 rounded-full bg-violet-400/20" />
      <div aria-hidden className="lea-anim-float absolute right-24 top-1/3 h-4 w-4 rotate-12 rounded-md bg-yellow-300/80" />
      <div aria-hidden className="lea-anim-float-slow absolute left-16 top-24 h-3 w-3 rounded-full bg-sky-300/70" />
      <div aria-hidden className="lea-anim-float absolute right-40 bottom-16 h-5 w-5 rotate-45 rounded-md bg-rose-400/60" />

      <AuthBrand />

      {/* hero illustration framed like the reference art */}
      <div className="lea-anim-fade-up relative mx-auto w-full max-w-md px-4">
        <FloatingWindow className="lea-anim-float -left-1 top-8 hidden sm:block">
          <AudioWave />
        </FloatingWindow>
        <div className="overflow-hidden rounded-3xl border-4 border-white/15 bg-[#E9E0F8] shadow-2xl">
          <img
            src={HERO_URL}
            alt="Learning with LEA Labs"
            className="h-auto w-full"
            loading="lazy"
          />
        </div>
        <FloatingWindow className="lea-anim-float-slow -right-2 bottom-10 hidden sm:block">
          <MiniTimeline />
        </FloatingWindow>
      </div>

      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight">
          Learn. Explore.{" "}
          <span className="text-primary">Achieve.</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-sidebar-foreground/80">
          Digital literacy, coding, corporate training and real certificates —
          one platform for every future-ready learner.
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm text-sidebar-foreground/85">
          <span className="flex items-center gap-0.5 text-yellow-300">
            <Star className="h-4 w-4 fill-current" aria-hidden />
            <Star className="h-4 w-4 fill-current" aria-hidden />
            <Star className="h-4 w-4 fill-current" aria-hidden />
            <Star className="h-4 w-4 fill-current" aria-hidden />
            <Star className="h-4 w-4 fill-current" aria-hidden />
          </span>
          <span>Trusted by schools, parents and corporates across East Africa</span>
        </div>
      </div>
    </aside>
  );
}
