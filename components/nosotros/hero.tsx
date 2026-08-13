"use client";

import { useTranslations } from "next-intl";
import { AlquentaLogo } from "@/components/layout/alquenta-logo";
import { AuroraBackground } from "@/components/nosotros/aurora-background";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Hero() {
  const t = useTranslations("about");
  useReveal();

  const stats = [
    { value: t("heroStat1Value"), label: t("heroStat1Label") },
    { value: t("heroStat2Value"), label: t("heroStat2Label") },
    { value: t("heroStat3Value"), label: t("heroStat3Label") },
  ];

  return (
    <header className="relative isolate overflow-hidden py-20 pb-16 text-center sm:py-28 sm:pb-[76px]">
      <AuroraBackground />

      <div className="relative z-[2] mx-auto max-w-4xl px-4">
        <div className="mt-7 mb-3.5 flex justify-center">
          <AlquentaLogo
            priority
            className="h-[clamp(34px,5vw,52px)] w-auto animate-nos-mark-in"
          />
        </div>

        <h1 className="mx-0 mb-5 text-[clamp(42px,7.2vw,80px)] leading-[1.02] font-extrabold tracking-[-.045em]">
          <span className="block overflow-hidden">
            <span className="block animate-nos-rise-in">
              {t("heroTitleLine1")}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="nos-grad-text block animate-nos-rise-in [animation-delay:120ms]">
              Alquenta
            </span>
          </span>
        </h1>

        <p
          data-rv
          className="mx-auto max-w-[660px] text-[clamp(16px,1.7vw,19px)] leading-[1.65] text-nos-muted"
        >
          {t.rich("intro", {
            b: (chunks) => (
              <b className="font-semibold text-nos-ink">{chunks}</b>
            ),
          })}
        </p>

        <div data-rv className="mt-11 flex flex-wrap justify-center">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "relative px-8 text-center",
                index > 0 &&
                  "before:absolute before:top-[14%] before:left-0 before:h-[72%] before:w-px before:bg-nos-line",
              )}
            >
              <b className="nos-stat-number block text-3xl font-extrabold tracking-[-.03em]">
                {stat.value}
              </b>
              <span className="text-[12.5px] font-medium tracking-[.02em] text-nos-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
