import { api } from "@/lib/api-client";

export type NotificationType =
  | "class"
  | "assignment"
  | "grade"
  | "payment"
  | "certificate"
  | "message"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationList {
  data: AppNotification[];
  unread_count: number;
}

/** Notifications API service (module: notifications). */
export const notificationService = {
  list: () => api.get<NotificationList>("/notifications"),
  markAsRead: (id: string) => api.post<void>(`/notifications/${id}/read`),
  markAllAsRead: () => api.post<void>("/notifications/read-all"),
};
