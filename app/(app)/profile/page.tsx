"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyFullProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PublicProfileSection } from "@/components/profile/public-profile-section";
import { ContactSection } from "@/components/profile/contact-section";
import { NotificationsSection } from "@/components/profile/notifications-section";
import { PrivacySection } from "@/components/profile/privacy-section";
import { SecuritySection } from "@/components/profile/security-section";

const SECTIONS = [
  "publicProfile",
  "contact",
  "notifications",
  "privacy",
  "security",
] as const;
type Section = (typeof SECTIONS)[number];

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: profile, isLoading } = useMyFullProfile();
  const [section, setSection] = useState<Section>("publicProfile");

  if (isLoading || !profile) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      <nav className="mb-6 flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
        {SECTIONS.map((key) => (
          <Button
            key={key}
            type="button"
            variant={section === key ? "secondary" : "ghost"}
            size="sm"
            className={cn("flex-1")}
            onClick={() => setSection(key)}
          >
            {t(`section${key.charAt(0).toUpperCase()}${key.slice(1)}`)}
          </Button>
        ))}
      </nav>

      {section === "publicProfile" && <PublicProfileSection profile={profile} />}
      {section === "contact" && <ContactSection profile={profile} />}
      {section === "notifications" && <NotificationsSection profile={profile} />}
      {section === "privacy" && <PrivacySection profile={profile} />}
      {section === "security" && <SecuritySection profile={profile} />}
    </main>
  );
}
