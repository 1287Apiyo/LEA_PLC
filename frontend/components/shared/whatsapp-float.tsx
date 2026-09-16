const WHATSAPP_URL =
  "https://wa.me/254729929101?text=Hello%20LEA%20Labs%2C%20I%27d%20like%20to%20learn%20more.";

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with LEA Labs on WhatsApp"
      title="Chat with LEA Labs on WhatsApp"
      className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[0_14px_34px_rgba(37,211,102,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 focus-visible:ring-offset-2 sm:bottom-7 sm:right-7"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.92L.1 24l6.34-1.66a11.84 11.84 0 0 0 5.64 1.43h.01c6.54 0 11.87-5.33 11.87-11.88 0-3.17-1.23-6.14-3.44-8.41ZM12.09 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.98 1-3.66-.24-.38a9.87 9.87 0 0 1-1.52-5.27C2.17 6.42 6.62 1.98 12.08 1.98c2.64 0 5.12 1.03 6.99 2.9a9.85 9.85 0 0 1 2.89 7.01c0 5.47-4.44 9.91-9.87 9.91Zm5.43-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
      <span className="sr-only">Chat with LEA Labs on WhatsApp</span>
    </a>
  );
}
