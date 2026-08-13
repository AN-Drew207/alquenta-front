"use client";

import { useTranslations } from "next-intl";
import { AlquentaLogo } from "@/components/layout/alquenta-logo";
import { useReveal } from "@/hooks/use-reveal";

export function ContactHero() {
  const t = useTranslations("contact");
  useReveal();

  return (
    <div className="text-center">
      <AlquentaLogo className="mx-auto h-9 w-auto" />

      <h1
        data-rv
        className="nos-grad-text mt-4 text-[clamp(28px,4.5vw,42px)] leading-[1.05] font-extrabold tracking-[-.03em]"
      >
        {t("title")}
      </h1>
      <p data-rv className="mx-auto mt-3 max-w-md text-muted-foreground">
        {t("subtitle")}
      </p>
    </div>
  );
}
