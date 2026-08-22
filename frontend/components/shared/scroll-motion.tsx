"use client";

import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lea-motion-ready");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main > section, main > section article, main > section blockquote, footer",
      ),
    );

    targets.forEach((element, index) => {
      element.classList.add("lea-scroll-reveal");
      element.style.setProperty("--lea-reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return () => root.classList.remove("lea-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove("lea-motion-ready");
    };
  }, []);

  return null;
}

export default ScrollMotion;

