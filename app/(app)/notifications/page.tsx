"use client";

import { useMyNotifications } from "@/hooks/use-notifications";
import { NotificationList } from "@/components/notifications/notification-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useMyNotifications();

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <NotificationList notifications={notifications ?? []} />
      )}
    </main>
  );
}
