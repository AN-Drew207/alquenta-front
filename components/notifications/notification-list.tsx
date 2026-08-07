"use client";

import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/lib/api/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/constants";
import type { Notification } from "@/types/notification";

export function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const queryClient = useQueryClient();
  const markAsRead = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (notifications.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        You have no notifications yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={notification.status === "PENDING" ? "border-primary" : ""}
        >
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {NOTIFICATION_TYPE_LABELS[notification.type]}
                </Badge>
                {notification.status === "PENDING" && (
                  <Badge>New</Badge>
                )}
              </div>
              <p className="mt-1 text-sm">{notification.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {notification.status === "PENDING" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsRead.mutate(notification.id)}
                disabled={markAsRead.isPending}
              >
                Mark as read
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
