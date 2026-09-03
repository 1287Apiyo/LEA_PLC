type BrandMarkProps = { className?: string };

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <img
      src="/lea-logo.png"
      alt="LEA Learn Explore Achieve logo"
      className={`aspect-square rounded-full object-contain ${className ?? ""}`}
      loading="eager"
      draggable={false}
    />
  );
}
