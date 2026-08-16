/**
 * LEA Labs brand mark — the official circular logo, presented as a circle.
 * Rendered from the original artwork so the mark stays exactly as designed.
 */
const LOGO_URL = "https://sc02.alicdn.com/kf/Ab1bbeb6220d049ba88182a1f54ec4df6a.png";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="LEA Labs logo"
      className={`rounded-full object-contain ${className ?? ""}`}
      loading="lazy"
      draggable={false}
    />
  );
}
