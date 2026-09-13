type BrandMarkProps = { className?: string };

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <img
      src="/lea-labs-plc-logo.jpeg"
      alt="LEA Labs PLC"
      className={`object-contain ${className ?? ""}`}
      loading="eager"
      draggable={false}
    />
  );
}
