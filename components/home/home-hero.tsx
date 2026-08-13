"use client";

import { useTranslations } from "next-intl";
import { AuroraBackground } from "@/components/about/aurora-background";
import { useReveal } from "@/hooks/use-reveal";

export function HomeHero() {
  const t = useTranslations("home");
  useReveal();

  return (
    <div className="relative isolate overflow-hidden py-14 text-center sm:py-20">
      <AuroraBackground />

      <div className="relative z-[2] mx-auto max-w-3xl px-4">
        <h1
          data-rv
          className="nos-grad-text text-[clamp(30px,5vw,52px)] leading-[1.05] font-extrabold tracking-[-.03em]"
        >
          {t("title")}
        </h1>
        <p data-rv className="mx-auto mt-3 max-w-xl text-base text-nos-muted">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
}
