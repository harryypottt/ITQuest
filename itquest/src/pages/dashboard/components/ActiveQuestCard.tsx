import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface QuestObjective {
  id: string;
  description: string;
  isCompleted: boolean;
}

interface ActiveQuestCardProps {
  questId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  xpReward: number;
  progress: number;
  total: number;
  objectives: QuestObjective[];
  index: number;
}

export default function ActiveQuestCard({
  questId,
  title,
  description,
  icon,
  color,
  bg,
  xpReward,
  progress,
  total,
  objectives,
  index,
}: ActiveQuestCardProps) {
  const progressPct = Math.round((progress / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
      className="p-4 rounded-xl bg-quest-bg border border-quest-border hover:border-quest-textDim transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
            <i className={`${icon} ${color} text-lg`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-quest-text group-hover:text-quest-primary transition-colors">{title}</h4>
            <p className="text-xs text-quest-textMuted">{description}</p>
          </div>
        </div>
        <Link
          to={`/quests/${questId}`}
          className="flex-shrink-0 text-xs text-quest-primary hover:text-quest-primaryGlow transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
        >
          View <i className="ri-arrow-right-line" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-quest-textDim">
            {progress} of {total} objectives
          </span>
          <span className="text-xs text-quest-gold font-semibold">+{xpReward} XP</span>
        </div>
        <div className="h-1.5 rounded-full bg-quest-card overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.7, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500`}
          />
        </div>
      </div>

      {/* Objectives checklist */}
      <div className="space-y-1.5">
        {objectives.map((obj) => (
          <div key={obj.id} className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              obj.isCompleted
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-quest-card border border-quest-border text-quest-textDim'
            }`}>
              {obj.isCompleted ? (
                <i className="ri-check-line text-[10px]" />
              ) : (
                <span className="w-1 h-1 rounded-full bg-quest-textDim" />
              )}
            </div>
            <span className={`text-xs ${obj.isCompleted ? 'text-quest-textMuted line-through' : 'text-quest-text'}`}>
              {obj.description}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}