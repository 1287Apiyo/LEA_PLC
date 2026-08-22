"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function CorporateContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/v1/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Unable to send");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") return <div className="flex min-h-[390px] flex-col justify-center border border-white/15 bg-white/10 p-7"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f47945] text-[#351039]"><Check className="h-6 w-6" /></span><h3 className="mt-7 text-3xl font-medium tracking-[-.04em]">Message received.</h3><p className="mt-4 max-w-md text-sm leading-7 text-white/70">Thank you for reaching out. The LEA Labs team will review your goals and get back to you shortly.</p></div>;

  return <form onSubmit={submit} className="grid gap-5 border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm text-white/75">Your name<input required name="name" className="border-b border-white/25 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#f47945]" placeholder="Jane Apiyo" /></label><label className="grid gap-2 text-sm text-white/75">Work email<input required type="email" name="email" className="border-b border-white/25 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#f47945]" placeholder="jane@organisation.com" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm text-white/75">Organisation<input required name="organisation" className="border-b border-white/25 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#f47945]" placeholder="Your organisation" /></label><label className="grid gap-2 text-sm text-white/75">Team size<select name="teamSize" className="border-b border-white/25 bg-[#1f0d2e] px-0 py-3 text-white outline-none focus:border-[#f47945]"><option>1–10</option><option>11–50</option><option>51–200</option><option>201+</option></select></label></div><label className="grid gap-2 text-sm text-white/75">What would you like to explore?<textarea required name="message" rows={4} className="resize-none border-b border-white/25 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#f47945]" placeholder="Tell us about your team, goals, or capability challenge..." /></label><button disabled={status === "sending"} className="inline-flex w-fit items-center gap-3 bg-[#f47945] px-6 py-4 text-sm font-semibold text-[#351039] transition hover:bg-[#ff9562] disabled:cursor-wait disabled:opacity-60">{status === "sending" ? "Sending..." : "Send enquiry"}<ArrowRight className="h-4 w-4" /></button>{status === "error" && <p className="text-sm text-[#f7c2aa]">We could not send your enquiry. Please try again or email hello@lealabs.africa.</p>}<p className="text-xs leading-5 text-white/45">We’ll only use these details to respond to your enquiry.</p></form>;
}
