import { motion } from 'framer-motion';
import type { ActivityFeedItem } from '@/sampleData/dashboardData';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
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

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="p-5 md:p-6 rounded-xl bg-quest-card border border-quest-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-quest-text flex items-center gap-2">
          <i className="ri-history-line text-quest-primary" />
          Recent Activity
        </h2>
        <span className="text-xs text-quest-textDim">Last 7 days</span>
      </div>

      <div className="space-y-1">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.65 + idx * 0.04 }}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-quest-bg transition-colors group"
          >
            <div className={`w-8 h-8 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <i className={`${activity.icon} ${activity.color} text-sm`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-quest-text">{activity.title}</span>
                {activity.xpEarned && (
                  <span className="text-xs text-quest-gold font-semibold whitespace-nowrap">+{activity.xpEarned} XP</span>
                )}
              </div>
              <p className="text-xs text-quest-textMuted truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-quest-textDim whitespace-nowrap flex-shrink-0 mt-1">
              {timeAgo(activity.timestamp)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}