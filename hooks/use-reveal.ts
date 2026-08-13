"use client";

import { useEffect } from "react";

const STAGGER_MS = 90;
const MAX_STAGGER_INDEX = 4;

export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-rv]");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          const siblings = [
            ...(target.parentElement?.querySelectorAll<HTMLElement>("[data-rv]") ?? []),
          ];
          const index = siblings.indexOf(target);
          target.style.transitionDelay = `${Math.min(index, MAX_STAGGER_INDEX) * STAGGER_MS}ms`;
          target.classList.add("in");
          observer.unobserve(target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
