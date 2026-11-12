import { motion } from 'framer-motion';
import type { Quest } from '@/sampleData/questData';
import { questTypeConfig } from '@/sampleData/questData';
import type { ObjectiveProgress } from '@/hooks/useQuestProgressEngine';

const difficultyColors = [
  'bg-emerald-500/60',
  'bg-emerald-500/60',
  'bg-amber-500/60',
  'bg-amber-500/60',
  'bg-rose-500/60',
];

const objectiveTypeMeta: Record<string, { icon: string }> = {
  lesson: { icon: 'ri-book-open-line' },
  coding: { icon: 'ri-code-box-line' },
  quiz: { icon: 'ri-brain-line' },
  boss: { icon: 'ri-fire-line' },
  xp: { icon: 'ri-flashlight-line' },
  streak: { icon: 'ri-fire-line' },
};

interface QuestCardProps {
  quest: Quest;
  status: 'not_started' | 'active' | 'completed';
  objectiveProgress: ObjectiveProgress[];
  onViewDetail: () => void;
  onAccept: () => void;
}

export default function QuestCard({
  quest,
  status,
  objectiveProgress = [],
  onViewDetail,
  onAccept,
}: QuestCardProps) {
  // ✅ Safe Lookup gamit ang Record<string, any>
  const questType = quest.type || 'learning';
  const typeCfg = (questTypeConfig as Record<string, any>)[questType] || {
    label: 'Quest',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    color: 'text-emerald-400',
  };

  const xpReward = quest.xpReward ?? (quest as any).xp_reward ?? 0;
  const estimatedMinutes = quest.estimatedMinutes ?? (quest as any).estimated_minutes ?? 15;
  const storyText = quest.storyText ?? (quest as any).story_text ?? quest.description ?? '';
  const objectives = quest.objectives || [];
  const difficulty = Math.min(Math.max(Number(quest.difficulty) || 1, 1), 5);

  const completedCount = objectiveProgress.filter((o) => o.isCompleted).length;
  const totalCount = objectives.length || objectiveProgress.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-xl border p-5 transition-all cursor-pointer group ${
        isCompleted
          ? 'bg-quest-card border-emerald-500/20'
          : isActive
            ? `bg-quest-card ${typeCfg.border}`
            : 'bg-quest-card border-quest-border hover:border-quest-textDim/40'
      }`}
      onClick={isCompleted ? undefined : isActive ? onViewDetail : undefined}
    >
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${typeCfg.bg} border ${typeCfg.border} flex items-center justify-center`}>
            <i className={`${quest.icon || 'ri-sword-line'} text-lg ${typeCfg.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.color}`}>
                {typeCfg.label}
              </span>
              <span className="text-xs text-quest-textDim">{estimatedMinutes}min</span>
            </div>
            <h3 className="text-base font-bold text-quest-text mt-1">{quest.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-0.5 mt-1 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-3.5 rounded-sm ${i < difficulty ? difficultyColors[difficulty - 1] : 'bg-quest-border'}`}
            />
          ))}
        </div>
      </div>

      <p className="relative text-sm text-quest-textMuted leading-relaxed line-clamp-2 mb-4">
        {storyText}
      </p>

      <div className="relative mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-quest-textDim">Objectives</span>
          <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-quest-textMuted'}`}>
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          {objectives.map((obj, i) => {
            const meta = objectiveTypeMeta[obj.objectiveType] || objectiveTypeMeta.lesson;
            const done = objectiveProgress[i]?.isCompleted;
            return (
              <div
                key={obj.id}
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[8px] transition-all ${
                  done
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-quest-bg border border-quest-border text-quest-textDim/50'
                }`}
                title={`${obj.description}${done ? ' ✓' : ''}`}
              >
                {done ? <i className="ri-check-line text-[10px]" /> : <i className={`${meta.icon} text-[10px]`} />}
              </div>
            );
          })}
        </div>
        <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full rounded-full ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : 'bg-gradient-to-r from-quest-primary to-quest-accent'
            }`}
          />
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <i className="ri-flashlight-line text-xs text-amber-400" />
          <span className="text-xs font-bold text-amber-400">+{xpReward} XP</span>
        </div>

        <div>
          {isCompleted ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <i className="ri-check-double-line text-sm text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Completed</span>
            </div>
          ) : isActive ? (
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-primary/10 border border-quest-primary/20 text-xs font-semibold text-quest-primary hover:bg-quest-primary/20 cursor-pointer"
            >
              <i className="ri-eye-line text-sm" />
              View Progress
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAccept(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-quest-primary/10 border border-quest-primary/20 text-xs font-semibold text-quest-primary hover:bg-quest-primary/20 cursor-pointer"
            >
              <i className="ri-sword-line text-sm" />
              Accept Quest
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}