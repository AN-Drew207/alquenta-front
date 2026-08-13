"use client";

import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/messaging";

const DATE_FNS_LOCALES = { en: enUS, es };

export function MessageThread({ messages }: { messages: Message[] }) {
  const t = useTranslations("conversations");
  const locale = useLocale();
  const { data: user } = useCurrentUser();

  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        {t("noMessagesYet")}
      </p>
    );
  }

  const lastOwnMessageId = [...messages]
    .reverse()
    .find((message) => message.authorId === user?.id)?.id;

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isMine = message.authorId === user?.id;
        return (
          <div
            key={message.id}
            className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
          >
            {!isMine && (
              <span className="mb-0.5 px-1 text-xs font-medium text-muted-foreground">
                {message.authorName}
              </span>
            )}
            <div
              className={cn(
                "max-w-md rounded-lg px-3 py-2 text-sm",
                isMine
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              <p>{message.content}</p>
            </div>
            <span className="mt-1 text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "MMM d, HH:mm", {
                locale: DATE_FNS_LOCALES[locale as keyof typeof DATE_FNS_LOCALES],
              })}
              {isMine && message.id === lastOwnMessageId && (
                <> · {message.read ? t("read") : t("sent")}</>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
