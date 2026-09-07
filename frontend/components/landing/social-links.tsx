import type { SVGProps } from "react";

const SOCIALS = [
  { label: "X", href: "https://x.com/LeaLabsyos5" },
  { label: "TikTok", href: "https://www.tiktok.com/@lea_labs_?_r=1&_t=ZS-99X7MP9krsj" },
  { label: "Instagram", href: "https://www.instagram.com/lea_labs_?stkn=ajRmdmk3NXhnN" },
];

function XIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.965 6.817H1.682l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>;
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M15.5 3c.26 1.75 1.24 2.98 3 3.55v2.74a8.5 8.5 0 0 1-3-.92v5.57a5.3 5.3 0 1 1-4.58-5.24v2.88a2.5 2.5 0 1 0 1.58 2.36V3h3Z" /></svg>;
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
}

export function SocialLinks() {
  return (
    <div className="flex items-center gap-2" aria-label="LEA Labs social links">
      {SOCIALS.map(({ label, href }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`LEA Labs on ${label}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[#d7c6df] transition hover:border-[#f47945] hover:bg-[#f47945] hover:text-[#351039] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f47945] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f0d2e]">
          {label === "X" ? <XIcon className="h-5 w-5" /> : label === "TikTok" ? <TikTokIcon className="h-5 w-5" /> : <InstagramIcon className="h-5 w-5" />}
        </a>
      ))}
    </div>
  );
}
