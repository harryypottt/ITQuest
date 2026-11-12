import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useNotifications } from '@/context/NotificationContext';
import {
  notificationFilters,
  notificationTypeConfig,
} from '@/sampleData/notificationData';

// --- TypeScript Type Definitions ---
type NotificationType = 
  | 'quest' 
  | 'level_up' 
  | 'badge' 
  | 'streak' 
  | 'faculty' 
  | 'system' 
  | 'quiz' 
  | 'boss' 
  | 'coding' 
  | 'achievement';

interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon?: string;
  actionLabel?: string;
  actionPath?: string;
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (isNaN(diffMins) || diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTimeGroup(ts: string): 'Today' | 'Yesterday' | 'This Week' | 'Earlier' {
  const date = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  if (isNaN(date.getTime())) return 'Earlier';
  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'This Week';
  return 'Earlier';
}

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();

  const filtered = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    if (activeFilter === 'all') return notifications;
    return notifications.filter((n: NotificationItem) => n.type === activeFilter);
  }, [activeFilter, notifications]);

  const grouped = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };
    filtered.forEach((n: NotificationItem) => {
      const group = getTimeGroup(n.timestamp);
      groups[group].push(n);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filtered]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center relative">
              <i className="ri-notification-3-line text-xl text-cyan-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text">Notifications</h1>
              <p className="text-sm text-quest-textMuted mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-quest-card border border-quest-border text-sm text-quest-textDim hover:text-quest-textMuted hover:border-quest-textDim/30 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-check-double-line" />
              Mark all read
            </button>
          )}
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1"
        >
          <div className="flex items-center gap-1 bg-quest-card border border-quest-border rounded-full p-1">
            {notificationFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === filter.value
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                    : 'text-quest-textDim hover:text-quest-textMuted'
                }`}
              >
                <i className={`${filter.icon} text-xs`} />
                {filter.label}
                {filter.value === 'all' && unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notification list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="p-12 text-center text-quest-textMuted">Loading notifications...</div>
            ) : grouped.length === 0 ? (
              <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
                <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-double-line text-3xl text-quest-textDim" />
                </div>
                <h3 className="text-lg font-bold text-quest-text mb-1">No notifications</h3>
                <p className="text-sm text-quest-textMuted">
                  {activeFilter === 'all'
                    ? 'You are all caught up!'
                    : `No ${notificationTypeConfig[activeFilter as NotificationType]?.label.toLowerCase() || activeFilter} notifications.`}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {grouped.map(([groupName, items]) => (
                  <div key={groupName}>
                    <h3 className="text-xs font-semibold text-quest-textDim uppercase tracking-wider mb-3 px-1">
                      {groupName}
                    </h3>
                    <div className="space-y-2">
                      {items.map((notif: NotificationItem) => {
                        const cfg = notificationTypeConfig[notif.type] || {
                          label: notif.type,
                          icon: 'ri-notification-3-line',
                          color: 'text-cyan-400',
                          bg: 'bg-cyan-500/10',
                        };
                        return (
                          <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`relative p-4 rounded-xl border transition-colors group cursor-pointer ${
                              notif.isRead
                                ? 'bg-quest-card border-quest-border hover:border-quest-textDim/20'
                                : 'bg-quest-card border-cyan-500/20 hover:border-cyan-500/30'
                            }`}
                            onClick={() => {
                              markAsRead(notif.id);
                              setSelectedNotif(notif);
                            }}
                          >
                            {/* Unread dot */}
                            {!notif.isRead && (
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                            )}

                            <div className="flex items-start gap-4 pl-2">
                              {/* Icon */}
                              <div className={`w-10 h-10 rounded-lg ${cfg.bg} border border-quest-border flex items-center justify-center shrink-0`}>
                                <i className={`${notif.icon || 'ri-notification-3-line'} ${cfg.color} text-lg`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                                    {cfg.label}
                                  </span>
                                  <span className="text-xs text-quest-textDim whitespace-nowrap">
                                    {formatTimestamp(notif.timestamp)}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-quest-text mb-1">{notif.title}</h4>
                                <p className="text-xs text-quest-textMuted line-clamp-2">{notif.message}</p>

                                {/* Action */}
                                {notif.actionLabel && notif.actionPath && (
                                  <Link
                                    to={notif.actionPath}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
                                  >
                                    {notif.actionLabel} <i className="ri-arrow-right-line" />
                                  </Link>
                                )}
                              </div>

                              {/* Delete button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition-all cursor-pointer"
                              >
                                <i className="ri-close-line text-quest-textDim hover:text-rose-400 text-sm" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Detail modal */}
        <AnimatePresence>
          {selectedNotif && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedNotif(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-quest-card border border-quest-border rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const cfg = notificationTypeConfig[selectedNotif.type] || {
                    label: selectedNotif.type,
                    icon: 'ri-notification-3-line',
                    color: 'text-cyan-400',
                    bg: 'bg-cyan-500/10',
                  };
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg ${cfg.bg} border border-quest-border flex items-center justify-center`}>
                          <i className={`${selectedNotif.icon || cfg.icon} ${cfg.color} text-xl`} />
                        </div>
                        <div>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                          <p className="text-xs text-quest-textDim mt-1">
                            {new Date(selectedNotif.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-quest-text mb-2">{selectedNotif.title}</h3>
                      <p className="text-sm text-quest-textMuted leading-relaxed mb-5">{selectedNotif.message}</p>
                      <div className="flex items-center gap-3">
                        {selectedNotif.actionLabel && selectedNotif.actionPath && (
                          <Link
                            to={selectedNotif.actionPath}
                            onClick={() => setSelectedNotif(null)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors whitespace-nowrap"
                          >
                            {selectedNotif.actionLabel} <i className="ri-arrow-right-line" />
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            deleteNotification(selectedNotif.id);
                            setSelectedNotif(null);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-quest-bg border border-quest-border text-quest-textDim text-sm hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-delete-bin-line" /> Delete
                        </button>
                        <button
                          onClick={() => setSelectedNotif(null)}
                          className="ml-auto text-sm text-quest-textDim hover:text-quest-textMuted transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}