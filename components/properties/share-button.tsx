"use client";

import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/**
 * Uses the native share sheet when available (covers WhatsApp on mobile
 * among other apps); falls back to opening a pre-filled WhatsApp share link
 * on desktop, since WhatsApp is the dominant organic channel in this
 * market (see the roadmap's M-10).
 */
export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("propertyDetail");

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the native share sheet — nothing to do.
      }
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="size-4" />
      {t("share")}
    </Button>
  );
}
