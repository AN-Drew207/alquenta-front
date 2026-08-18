"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useRevealContactMutation } from "@/hooks/use-reveal-contact";
import { translateApiError } from "@/lib/api/client";

/**
 * The token issued alongside the property page is single-use-window
 * (60-90s TTL, see api/CLAUDE.md's contact-reveal note) — it's only ever
 * sent once, on click, never stored beyond this component's lifetime.
 */
export function WhatsappRevealCard({
  propertyId,
  contactRevealToken,
}: {
  propertyId: string;
  contactRevealToken: string;
}) {
  const t = useTranslations("propertyDetail");
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const revealMutation = useRevealContactMutation();

  function handleReveal() {
    revealMutation.mutate(
      { propertyId, token: contactRevealToken },
      {
        onSuccess: setWhatsapp,
        onError: (error) =>
          toast.error(translateApiError(error, t("couldNotRevealWhatsapp"))),
      },
    );
  }

  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs text-muted-foreground">WhatsApp</p>
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-2.5 hover:underline"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-green-600">
              <WhatsAppIcon className="size-4.5" />
            </span>
            <span className="font-medium">{whatsapp}</span>
          </a>
        ) : (
          <Button
            variant="ghost"
            className="mt-1 h-auto w-full justify-start gap-2.5 px-0 hover:bg-transparent"
            onClick={handleReveal}
            disabled={revealMutation.isPending}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-green-600">
              <WhatsAppIcon className="size-4.5" />
            </span>
            <span className="font-medium">{t("showWhatsapp")}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
