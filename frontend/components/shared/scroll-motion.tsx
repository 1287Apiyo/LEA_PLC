"use client";

import { useEffect } from "react";

export function ScrollMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lea-motion-ready");
    root.classList.add("has-scroll-reveal");

    const targets = Array.from(new Set(Array.from(
      document.querySelectorAll<HTMLElement>(
        ".lea-motion-page main > section, .lea-motion-page main > section article, .lea-motion-page main > section blockquote, .lea-motion-page footer, .lea-motion-page [data-scroll-reveal]",
      ),
    )));
    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>(".lea-motion-page [data-scroll-parallax]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollRoot = document.documentElement;
    let scrollFrame = 0;

    targets.forEach((element, index) => {
      element.classList.add("lea-scroll-reveal");
      element.style.setProperty("--lea-reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
    });

    const updateScrollMotion = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const maxScroll = scrollRoot.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        scrollRoot.style.setProperty("--page-scroll-progress", String(progress));

        if (reducedMotion) return;
        const viewportCenter = window.innerHeight / 2;
        parallaxTargets.forEach((target) => {
          const bounds = target.getBoundingClientRect();
          const range = Math.max(viewportCenter + bounds.height / 2, 1);
          const position = Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - viewportCenter) / range));
          target.style.setProperty("--scroll-offset", `${(-position * 16).toFixed(1)}px`);
        });
      });
    };

    window.addEventListener("scroll", updateScrollMotion, { passive: true });
    window.addEventListener("resize", updateScrollMotion);
    updateScrollMotion();

    if (reducedMotion) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return () => {
        root.classList.remove("lea-motion-ready", "has-scroll-reveal");
        scrollRoot.style.removeProperty("--page-scroll-progress");
        window.removeEventListener("scroll", updateScrollMotion);
        window.removeEventListener("resize", updateScrollMotion);
      };
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
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", updateScrollMotion);
      window.removeEventListener("resize", updateScrollMotion);
      root.classList.remove("lea-motion-ready", "has-scroll-reveal");
      scrollRoot.style.removeProperty("--page-scroll-progress");
      parallaxTargets.forEach((target) => target.style.removeProperty("--scroll-offset"));
    };
  }, []);

  return null;
}

export default ScrollMotion;
