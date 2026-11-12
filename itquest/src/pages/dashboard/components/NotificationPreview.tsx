import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Notification } from '@/sampleData/notificationData';
import { notificationTypeConfig } from '@/sampleData/notificationData';

interface NotificationPreviewProps {
  notifications: Notification[];
  unreadCount: number;
}

function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationPreview({ notifications, unreadCount }: NotificationPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-5 md:p-6 rounded-xl bg-quest-card border border-quest-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-quest-text flex items-center gap-2">
          <i className="ri-notification-3-line text-quest-primary" />
          Notifications
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold">
              {unreadCount} new
            </span>
          )}
        </h2>
        <Link
          to="/notifications"
          className="text-xs text-quest-primary hover:text-quest-primaryGlow transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
        >
          View All <i className="ri-arrow-right-line" />
        </Link>
      </div>

      <div className="space-y-2">
        {notifications.slice(0, 4).map((notif, idx) => {
          const config = notificationTypeConfig[notif.type];
          return (
            <Link
              key={notif.id}
              to={notif.actionPath || '/notifications'}
              className={`flex items-start gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                notif.isRead ? 'hover:bg-quest-bg' : 'bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <i className={`${config.icon} ${config.color} text-sm`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${notif.isRead ? 'text-quest-textMuted' : 'text-quest-text font-medium'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-quest-textDim truncate mt-0.5">{notif.message}</p>
              </div>
              <span className="text-xs text-quest-textDim whitespace-nowrap flex-shrink-0 mt-1">
                {timeAgo(notif.timestamp)}
              </span>
            </Link>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <p className="text-center text-sm text-quest-textDim py-4">All caught up!</p>
      )}
    </motion.div>
  );
}