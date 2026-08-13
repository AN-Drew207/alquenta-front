"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEP_NUMBERS = ["01", "02", "03", "04"] as const;
const LIT_VIEWPORT_RATIO = 0.62;

export function HowItWorks() {
  const t = useTranslations("about");
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    function onScroll() {
      const rail = railRef.current;
      const fill = fillRef.current;
      if (!rail || !fill) return;

      const railRect = rail.getBoundingClientRect();
      const mid = window.innerHeight * LIT_VIEWPORT_RATIO;
      const progress = Math.max(0, Math.min(1, (mid - railRect.top) / railRect.height));
      fill.style.height = `${progress * 100}%`;

      dotRefs.current.forEach((dot, index) => {
        if (!dot) return;
        const dotRect = dot.getBoundingClientRect();
        const lit = dotRect.top + dotRect.height / 2 < mid;
        stepRefs.current[index]?.classList.toggle("nos-step-lit", lit);
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const steps = STEP_NUMBERS.map((number, index) => ({
    number,
    title: t(`step${index + 1}Title`),
    description: t(`step${index + 1}Description`),
  }));

  return (
    <section className="relative border-y border-nos-line bg-nos-bg-soft py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <p data-rv className="nos-eyebrow">
          {t("howItWorksEyebrow")}
        </p>
        <h2
          data-rv
          className="mt-4 text-center text-[clamp(30px,4.4vw,46px)] leading-[1.1] font-extrabold tracking-[-.035em]"
        >
          {t("howItWorksTitle")}
        </h2>
        <p data-rv className="mx-auto mt-3.5 max-w-[600px] text-center text-base text-nos-muted">
          {t("howItWorksSub")}
        </p>

        <div className="relative mx-auto mt-15 max-w-[880px] pl-14 sm:pl-[76px]">
          <div ref={railRef} className="nos-rail">
            <div ref={fillRef} className="nos-rail-fill" />
          </div>

          {steps.map((step, index) => (
            <article
              key={step.number}
              data-rv
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              className="nos-step mb-4 px-5 py-6 sm:px-[30px]"
            >
              <div
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                className={cn(
                  "nos-dot absolute top-6 -left-14 size-10 rounded-[13px] text-sm",
                  "sm:-left-[76px] sm:size-14 sm:rounded-[18px] sm:text-[17px]",
                )}
              >
                {step.number}
              </div>
              <span className="nos-ghost hidden text-[78px] sm:block">{step.number}</span>

              <h3 className="mb-2 flex items-center gap-2.5 text-lg font-bold tracking-[-.02em] sm:text-[19px]">
                {step.title}
                <ArrowRight className="nos-step-arrow size-[19px] text-nos-accent" />
              </h3>
              <p className="max-w-[62ch] text-[15px] leading-[1.68] text-nos-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
