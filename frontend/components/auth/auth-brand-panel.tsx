import { Star } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { APP_NAME } from "@/lib/constants";

/** Existing auth hero visual, kept static and free of extra overlays. */
const HERO_URL = "https://sc04.alicdn.com/kf/A6f2b031566e04faab49c31d733236971q.jpg";

/** Brand mark and wordmark shared by the desktop and mobile auth experiences. */
export function AuthBrand({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm">
        <BrandMark className="h-full w-full" />
      </span>
      <span className={`text-xl font-semibold uppercase tracking-[0.18em] ${light ? "text-white" : "text-primary"}`}>
        {APP_NAME}
      </span>
    </div>
  );
}

/** Static purple brand side panel shown on desktop auth screens. */
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-full overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
      <AuthBrand />

      <div className="relative mx-auto w-full max-w-md px-4">
        <div className="overflow-hidden rounded-3xl border-4 border-white/15 bg-[#E9E0F8] shadow-2xl">
          <img
            src={HERO_URL}
            alt="Learners building and exploring with LEA Labs"
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      </div>

      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight">
          Learn. Explore. <span className="text-primary">Achieve.</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-sidebar-foreground/80">
          Digital literacy, coding, corporate training and real certificates — one platform for every future-ready learner.
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm text-sidebar-foreground/85">
          <span className="flex items-center gap-0.5 text-yellow-300" aria-label="Five stars">
            {[0, 1, 2, 3, 4].map((star) => (
              <Star key={star} className="h-4 w-4 fill-current" aria-hidden />
            ))}
          </span>
          <span>Trusted by schools, parents and corporates across East Africa</span>
        </div>
      </div>
    </aside>
  );
}
