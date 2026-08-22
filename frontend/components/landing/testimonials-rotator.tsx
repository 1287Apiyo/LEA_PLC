"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote: "LEA gave me a place to start without making me feel behind. I built my first project and finally understood what I was capable of.",
    name: "Ama K.",
    detail: "Software Engineering learner",
  },
  {
    quote: "The practical work changed everything. I could see my progress in the projects I was making, not just in a certificate.",
    name: "Daniel O.",
    detail: "Applied AI learner",
  },
  {
    quote: "What stayed with me was the support. The feedback helped me keep going and connect my learning to the kind of work I want to do.",
    name: "Nia M.",
    detail: "Digital skills learner",
  },
];

export function TestimonialsRotator() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const testimonial = testimonials[activeIndex];

  return (
    <div className="relative mt-10 max-w-[650px]" aria-live="polite">
      <div className="border-l-2 border-[#f47945] pl-5 sm:pl-7">
        <p className="text-[clamp(1.25rem,2.2vw,2rem)] font-medium leading-[1.08] tracking-[-0.04em] text-white">
          “{testimonial.quote}”
        </p>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm font-bold text-[#f47945]">{testimonial.name}</span>
          <span className="text-xs text-[#ead9ed]">{testimonial.detail}</span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2" aria-label="Testimonial navigation">
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show testimonial ${index + 1}`}
            aria-pressed={activeIndex === index}
            className={`h-1.5 rounded-full transition-all ${activeIndex === index ? "w-8 bg-[#f47945]" : "w-2 bg-white/35 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialsRotator;

const _testimonials = testimonials;
void _testimonials;

