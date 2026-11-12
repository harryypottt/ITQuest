import { notificationRepository } from "../../repositories/notification.repository.js";

export const notificationService = {
  async getUserNotifications(userId: string) {
    const rawNotifs = await notificationRepository.findByUserId(userId);
    const unreadCount = await notificationRepository.countUnread(userId);

    // I-map ang database format patungong frontend-friendly format (isRead boolean)
    const notifications = rawNotifs.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp,
      isRead: Boolean(n.is_read),
      icon: n.icon,
      actionLabel: n.action_label,
      actionPath: n.action_path,
    }));

    return { notifications, unreadCount };
  },

  async markAsRead(notificationId: string, userId: string) {
    return await notificationRepository.markAsRead(notificationId, userId);
  },

  async markAllAsRead(userId: string) {
    return await notificationRepository.markAllAsRead(userId);
  },

  async deleteNotification(notificationId: string, userId: string) {
    return await notificationRepository.delete(notificationId, userId);
  },
};