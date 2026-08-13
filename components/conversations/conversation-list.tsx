"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircleOff, MessagesSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProperty } from "@/hooks/use-properties";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/messaging";

const DATE_FNS_LOCALES = { en: enUS, es };

function ConversationRow({
  conversation,
  active,
}: {
  conversation: Conversation;
  active: boolean;
}) {
  const t = useTranslations("conversations");
  const locale = useLocale();
  const { data: currentUser } = useCurrentUser();
  const { data: property, isLoading } = useProperty(conversation.propertyId);
  const otherName =
    currentUser?.id === conversation.adminId
      ? conversation.clientName
      : conversation.adminName;

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50",
        active && "bg-muted",
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {property?.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <MessagesSquare className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {isLoading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <span className="truncate text-sm font-medium">
            {property?.title ?? t("propertyNoLongerAvailable")}
          </span>
        )}
        <span className="truncate text-xs text-muted-foreground">
          {otherName}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(conversation.createdAt), {
            addSuffix: true,
            locale: DATE_FNS_LOCALES[locale as keyof typeof DATE_FNS_LOCALES],
          })}
        </span>
      </div>
    </Link>
  );
}

export function ConversationList({
  conversations,
  activeId,
}: {
  conversations: Conversation[];
  activeId?: string;
}) {
  const t = useTranslations("conversations");
  const { data: user } = useCurrentUser();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <MessageCircleOff className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">{t("emptyStateTitle")}</p>
        <p className="text-sm text-muted-foreground">
          {user?.role === "CLIENT" ? t("emptyStateClient") : t("emptyStateAdmin")}
        </p>
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          active={conversation.id === activeId}
        />
      ))}
    </div>
  );
}
