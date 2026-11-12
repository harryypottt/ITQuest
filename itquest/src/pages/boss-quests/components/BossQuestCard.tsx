import { motion } from 'framer-motion';
import type { BossQuestData, BossSubmissionStatus } from '@/sampleData/bossQuestData';
import { getBossQuestStatus, isBossQuestUnlocked, forceUnlockBossQuest } from '@/sampleData/bossQuestData';

interface BossQuestCardProps {
  quest: BossQuestData;
  onClick: (id: string) => void;
}

const difficultyColors: Record<number, string> = {
  1: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  2: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  3: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  4: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  5: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const regionIcons: Record<string, string> = {
  'frontend-kingdom': 'ri-html5-line',
  'server-citadel': 'ri-server-line',
  'data-vault': 'ri-database-2-line',
  'cyber-fortress': 'ri-shield-check-line',
  'networking-nexus': 'ri-global-line',
  'design-sanctum': 'ri-palette-line',
  'fullstack-forge': 'ri-stack-line',
};

const regionColors: Record<string, string> = {
  'frontend-kingdom': 'text-emerald-400',
  'server-citadel': 'text-cyan-400',
  'data-vault': 'text-violet-400',
  'cyber-fortress': 'text-rose-400',
  'networking-nexus': 'text-teal-400',
  'design-sanctum': 'text-fuchsia-400',
  'fullstack-forge': 'text-amber-400',
};

const bossTypeConfig: Record<string, { label: string; color: string; glow: string }> = {
  'region-boss': { label: 'Region Boss', color: 'text-rose-400', glow: 'shadow-rose-500/20' },
  'elite-boss': { label: 'Elite Boss', color: 'text-amber-400', glow: 'shadow-amber-500/20' },
  'legendary-boss': { label: 'Legendary Boss', color: 'text-yellow-400', glow: 'shadow-yellow-500/30' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  locked: { label: 'Locked', color: 'text-quest-textDim', bg: 'bg-quest-textDim/10', border: 'border-quest-textDim/30', icon: 'ri-lock-line' },
  available: { label: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'ri-play-circle-line' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'ri-loader-4-line' },
  submitted: { label: 'Submitted', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'ri-send-plane-line' },
  under_review: { label: 'Under Review', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', icon: 'ri-search-eye-line' },
  approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'ri-check-double-line' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'ri-check-double-line' },
  needs_revision: { label: 'Needs Revision', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: 'ri-close-circle-line' },
};

export default function BossQuestCard({ quest, onClick }: BossQuestCardProps) {
  const status = getBossQuestStatus(quest.id);
  const unlock = isBossQuestUnlocked(quest);
  const statusInfo = statusConfig[status] || statusConfig.locked;
  const isLocked = status === 'locked';
  const isActive = status === 'in_progress';
  const isLegendary = quest.bossType === 'legendary-boss';

  const totalPrereqs = unlock.questsRequired + (quest.requiresXP > 0 ? 1 : 0) + (quest.requiresLevel > 1 ? 1 : 0) + (quest.requiresStreak > 0 ? 1 : 0);
  const metPrereqs =
    unlock.questsCompleted +
    (unlock.xpCurrent >= unlock.xpRequired ? 1 : 0) +
    (unlock.levelCurrent >= unlock.levelRequired ? 1 : 0) +
    (unlock.streakCurrent >= unlock.streakRequired ? 1 : 0);
  const prereqPct = totalPrereqs > 0 ? Math.round((metPrereqs / totalPrereqs) * 100) : 100;

  return (
    <motion.div
      whileHover={!isLocked ? { y: -4 } : {}}
      onClick={() => !isLocked && onClick(quest.id)}
      className={`relative rounded-xl p-5 transition-all group overflow-hidden ${
        isLocked
          ? 'bg-quest-card/50 border border-quest-border/40 cursor-not-allowed opacity-60'
          : isLegendary
            ? 'bg-quest-card border border-yellow-500/30 cursor-pointer shadow-lg shadow-yellow-500/10'
            : isActive
              ? 'bg-quest-card border border-quest-primary/40 cursor-pointer shadow-lg shadow-quest-primary/5'
              : status === 'completed' || status === 'approved'
                ? 'bg-quest-card border border-emerald-500/20 cursor-pointer'
                : 'bg-quest-card border border-quest-border cursor-pointer hover:border-quest-textDim/30'
      }`}
    >
      {/* Legendary glow */}
      {isLegendary && !isLocked && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-yellow-500/10 pointer-events-none"
        />
      )}

      {/* Active shimmer */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-quest-primary/5 to-transparent animate-shimmer" />
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-quest-card/50 z-10 gap-3">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-quest-border/30 border-2 border-quest-border flex items-center justify-center mx-auto mb-2"
            >
              <i className="ri-lock-line text-xl text-quest-textDim" />
            </motion.div>
            <span className="text-xs text-quest-textDim font-semibold">Locked</span>
            {prereqPct > 0 && prereqPct < 100 && (
              <div className="mt-2 px-3">
                <div className="h-1 rounded-full bg-quest-border/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prereqPct}%` }}
                    className="h-full rounded-full bg-amber-500/50"
                  />
                </div>
                <p className="text-[10px] text-quest-textDim mt-1">{prereqPct}% prerequisites</p>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              forceUnlockBossQuest(quest.id);
              window.location.reload();
            }}
            className="text-[10px] px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-key-2-line text-[10px] mr-1" />
            Force Unlock
          </button>
        </div>
      )}

      {/* Boss type badge */}
      <div className="flex items-center justify-between mb-3 relative z-[1]">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${difficultyColors[quest.difficulty] || difficultyColors[1]}`}>
          {bossTypeConfig[quest.bossType]?.label || 'Boss'}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${statusInfo.color} ${statusInfo.bg} ${statusInfo.border}`}>
          <i className={`${statusInfo.icon} text-[10px] mr-1`} />
          {statusInfo.label}
        </span>
      </div>

      {/* Region pill */}
      <span className={`inline-flex items-center gap-1 text-[10px] mb-2 relative z-[1] ${regionColors[quest.regionId] || 'text-quest-textDim'}`}>
        <i className={`${regionIcons[quest.regionId] || 'ri-folder-line'}`} />
        {quest.regionName}
      </span>

      {/* Title */}
      <h3 className={`text-sm font-bold mb-2 leading-snug relative z-[1] ${isLocked ? 'text-quest-textDim' : 'text-quest-text'}`}>
        {quest.title}
      </h3>

      {/* Story snippet */}
      <p className={`text-[11px] leading-relaxed mb-4 line-clamp-2 relative z-[1] ${isLocked ? 'text-quest-textDim/60' : 'text-quest-textMuted'}`}>
        {quest.storyText}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between relative z-[1]">
        <div className="flex items-center gap-3 text-[10px] text-quest-textDim">
          <span className="flex items-center gap-1">
            <i className="ri-time-line" />
            {quest.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <i className="ri-calendar-line" />
            {quest.deadlineDays} days
          </span>
        </div>
        <div className="flex items-center gap-1 text-quest-gold">
          <i className="ri-flashlight-line text-[10px]" />
          <span className="text-[11px] font-bold">{quest.xpReward} XP</span>
        </div>
      </div>

      {/* Requirements + badge row */}
      <div className="mt-3 pt-3 border-t border-quest-border/50 flex items-center gap-1.5 relative z-[1]">
        <i className="ri-list-check-3 text-quest-textDim text-[10px]" />
        <span className="text-[10px] text-quest-textDim">{quest.requirements.length} requirements</span>
        {quest.badgeReward && (
          <span className="ml-auto text-[10px] text-quest-gold flex items-center gap-0.5">
            <i className="ri-medal-line" />
            {quest.badgeReward.name}
          </span>
        )}
      </div>

      {/* Prerequisite progress bar (only on locked quests with progress) */}
      {isLocked && prereqPct > 0 && (
        <div className="mt-3 pt-3 border-t border-quest-border/30 relative z-[1]">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-quest-textDim">Unlock Progress</span>
            <span className="text-amber-400/70">{metPrereqs}/{totalPrereqs}</span>
          </div>
          <div className="h-1.5 rounded-full bg-quest-border/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prereqPct}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {unlock.questsCompleted < unlock.questsRequired && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-quest-bg/50 border border-quest-border/50 text-quest-textDim">
                Quests: {unlock.questsCompleted}/{unlock.questsRequired}
              </span>
            )}
            {unlock.xpCurrent < unlock.xpRequired && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-quest-bg/50 border border-quest-border/50 text-quest-textDim">
                XP: {unlock.xpCurrent}/{unlock.xpRequired}
              </span>
            )}
            {unlock.levelCurrent < unlock.levelRequired && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-quest-bg/50 border border-quest-border/50 text-quest-textDim">
                Lv.{unlock.levelCurrent}→{unlock.levelRequired}
              </span>
            )}
            {unlock.streakCurrent < unlock.streakRequired && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-quest-bg/50 border border-quest-border/50 text-quest-textDim">
                Streak: {unlock.streakCurrent}/{unlock.streakRequired}d
              </span>
            )}
          </div>
        </div>
      )}

      {/* Completed badge */}
      {(status === 'completed' || status === 'approved') && (
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center z-20">
          <i className="ri-check-line text-emerald-400 text-sm" />
        </div>
      )}
    </motion.div>
  );
}