"use client";

import type { PointerEvent } from "react";
import { Building2, Users } from "lucide-react";
import { useTranslations } from "next-intl";

function handleSpotlight(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--nos-mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--nos-my", `${event.clientY - rect.top}px`);
}

export function Audiences() {
  const t = useTranslations("about");

  const audiences = [
    {
      icon: Building2,
      title: t("forOwnersTitle"),
      description: t("forOwnersDescription"),
      tags: [t("ownersTag1"), t("ownersTag2"), t("ownersTag3")],
    },
    {
      icon: Users,
      title: t("forClientsTitle"),
      description: t("forClientsDescription"),
      tags: [t("clientsTag1"), t("clientsTag2"), t("clientsTag3")],
    },
  ];

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <p data-rv className="nos-eyebrow">
          {t("audiencesEyebrow")}
        </p>
        <h2
          data-rv
          className="mt-4 text-center text-[clamp(30px,4.4vw,46px)] leading-[1.1] font-extrabold tracking-[-.035em]"
        >
          {t("audiencesTitle")}
        </h2>
        <p data-rv className="mx-auto mt-3.5 max-w-[600px] text-center text-base text-nos-muted">
          {t("audiencesSub")}
        </p>

        <div className="mt-13 grid grid-cols-1 gap-[22px] sm:grid-cols-2">
          {audiences.map((audience) => (
            <article
              key={audience.title}
              data-rv
              onPointerMove={handleSpotlight}
              className="nos-card px-7 pt-8 pb-7 sm:px-8"
            >
              <div className="nos-card-icon mb-5">
                <audience.icon className="size-6" strokeWidth={1.8} />
              </div>
              <h3 className="mb-2.5 text-xl font-bold tracking-[-.02em]">{audience.title}</h3>
              <p className="text-[15px] leading-[1.68] text-nos-muted">{audience.description}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {audience.tags.map((tag) => (
                  <span key={tag} className="nos-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
