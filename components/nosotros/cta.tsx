"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function CTA() {
  const t = useTranslations("about");

  return (
    <section className="px-4 pt-0 pb-16 sm:pb-24">
      <div className="mx-auto max-w-4xl">
        <div
          data-rv
          className="nos-cta relative overflow-hidden rounded-[32px] px-6 py-14 text-center text-white sm:px-10 sm:py-16"
        >
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <span className="nos-blob absolute top-[-200px] right-[-140px] h-[460px] w-[460px] bg-[radial-gradient(circle_at_60%_40%,rgba(240,90,40,.40),transparent_66%)] opacity-50 [animation-delay:-7s]" />
            <span className="nos-blob absolute top-[60px] left-[-100px] h-[360px] w-[360px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,190,120,.55),transparent_70%)] opacity-50 [animation-delay:-13s]" />
          </div>

          <div className="relative z-[2]">
            <h2 className="text-[clamp(30px,4.4vw,46px)] leading-[1.1] font-extrabold tracking-[-.035em] text-white">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-3.5 mb-7 max-w-[470px] text-white/72 leading-[1.6]">
              {t("ctaSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/my-properties/new"
                className="nos-btn-primary inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-[15px] font-bold text-[#14100E]"
              >
                {t("ctaPrimary")}
                <ArrowRight className="nos-btn-arrow size-[17px]" />
              </Link>
              <Link
                href="/"
                className="nos-btn-secondary inline-flex items-center gap-2 rounded-2xl border border-white/22 bg-white/8 px-6 py-3.5 text-[15px] font-bold text-white"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
