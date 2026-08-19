import type { NotificationStatus, NotificationType } from "./enums";

export interface Notification {
  id: string;
  type: NotificationType;
  messageId: string | null;
  conversationId: string | null;
  // Populated on ANALYTICS_ALERT, null on every other NotificationType.
  propertyId: string | null;
  text: string;
  status: NotificationStatus;
  createdAt: string;
}
