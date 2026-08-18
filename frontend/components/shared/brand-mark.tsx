type BrandMarkProps = { className?: string };

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <img
      src="/lea-logo222.png"
      alt="LEA Learn Explore Achieve logo"
      className={`object-contain ${className ?? ""}`}
      loading="eager"
      draggable={false}
    />
  );
}
