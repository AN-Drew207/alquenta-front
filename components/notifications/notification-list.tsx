"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, MessageSquare, TrendingDown } from "lucide-react";
import { markNotificationAsRead } from "@/lib/api/notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

const DATE_FNS_LOCALES = { en: enUS, es };

function NotificationRow({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: (id: string) => void;
}) {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const isUnread = notification.status === "PENDING";
  const isAnalyticsAlert = notification.type === "ANALYTICS_ALERT";
  const href = isAnalyticsAlert
    ? notification.propertyId
      ? `/analytics/${notification.propertyId}`
      : null
    : notification.conversationId
      ? `/conversations/${notification.conversationId}`
      : null;

  const content = (
    <>
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
          isUnread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {isAnalyticsAlert ? (
          <TrendingDown className="size-4" />
        ) : (
          <MessageSquare className="size-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", isUnread && "font-medium")}>{notification.text}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: DATE_FNS_LOCALES[locale as keyof typeof DATE_FNS_LOCALES],
          })}
        </p>
      </div>

      {isUnread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
    </>
  );

  const rowClassName = cn(
    "flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0",
    isUnread && "bg-primary/5",
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={() => isUnread && onOpen(notification.id)}
        className={cn(rowClassName, "transition-colors hover:bg-muted/50")}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={rowClassName}>
      {content}
      {isUnread && (
        <Button variant="ghost" size="sm" onClick={() => onOpen(notification.id)}>
          <Bell className="size-3.5" />
          {t("markAsRead")}
        </Button>
      )}
    </div>
  );
}

export function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();
  const markAsRead = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BellOff className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {notifications.map((notification) => (
        <NotificationRow
          key={notification.id}
          notification={notification}
          onOpen={(id) => markAsRead.mutate(id)}
        />
      ))}
    </div>
  );
}
