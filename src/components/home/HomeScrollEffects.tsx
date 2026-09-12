"use client";

import { useEffect } from "react";

/**
 * Same depth pop-in used on Event Planning & Niche Hobbies —
 * cards come forward from the background as you scroll.
 */
export function HomeScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reduce) {
      nodes.forEach((node) => node.classList.add("is-inview"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => {
      node.classList.add("scroll-reveal");
      io.observe(node);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
