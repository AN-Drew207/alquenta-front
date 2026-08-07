import type { NotificationStatus, NotificationType } from "./enums";

export interface Notification {
  id: string;
  type: NotificationType;
  messageId: string | null;
  text: string;
  status: NotificationStatus;
  createdAt: string;
}
