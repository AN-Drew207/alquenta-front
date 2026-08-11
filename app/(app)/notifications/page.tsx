"use client";

import { useTranslations } from "next-intl";
import { useMyNotifications } from "@/hooks/use-notifications";
import { NotificationList } from "@/components/notifications/notification-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const { data: notifications, isLoading } = useMyNotifications();

  return (
    <main className="w-full flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <NotificationList notifications={notifications ?? []} />
      )}
    </main>
  );
}
