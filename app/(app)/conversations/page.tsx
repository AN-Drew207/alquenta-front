"use client";

import { useTranslations } from "next-intl";
import { MessagesSquare } from "lucide-react";

export default function ConversationsPage() {
  const t = useTranslations("conversations");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <MessagesSquare className="size-7 text-muted-foreground" />
      </div>
      <p className="text-base font-medium">{t("selectConversationTitle")}</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t("selectConversationDescription")}
      </p>
    </div>
  );
}
