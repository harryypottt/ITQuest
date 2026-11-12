import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  categories,
  getCategoryEntries,
  rankColors,
  positionMedals,
  type LeaderboardEntry,
} from '@/sampleData/leaderboardData';

type Period = 'weekly' | 'monthly' | 'all_time';

const periodTabs: { value: Period; label: string; icon: string }[] = [
  { value: 'weekly', label: 'Weekly', icon: 'ri-calendar-line' },
  { value: 'monthly', label: 'Monthly', icon: 'ri-calendar-2-line' },
  { value: 'all_time', label: 'All Time', icon: 'ri-history-line' },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePeriod, setActivePeriod] = useState<Period>('weekly');

  const entries = useMemo(
    () => getCategoryEntries(activePeriod, activeCategory),
    [activePeriod, activeCategory],
  );

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  const activeCategoryLabel = categories.find((c) => c.value === activeCategory)?.label || 'All Categories';
  const activePeriodLabel = periodTabs.find((p) => p.value === activePeriod)?.label || 'Weekly';

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <i className="ri-trophy-line text-xl text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text">Leaderboard</h1>
              <p className="text-sm text-quest-textMuted mt-0.5">
                {activeCategoryLabel} &middot; {activePeriodLabel}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
          <div className="flex items-center gap-1 bg-quest-card border border-quest-border rounded-full p-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.value
                    ? 'bg-quest-primary text-white shadow-lg shadow-emerald-500/20'
                    : 'text-quest-textDim hover:text-quest-text'
                }`}
              >
                <i className={`${cat.icon} text-xs`} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Period Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {periodTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActivePeriod(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activePeriod === tab.value
                  ? 'bg-quest-card border border-amber-500/30 text-amber-400'
                  : 'bg-quest-card border border-quest-border text-quest-textDim hover:text-quest-textMuted'
              }`}
            >
              <i className={`${tab.icon} text-sm`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <motion.div
          key={`${activePeriod}-${activeCategory}-podium`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {top3.length >= 3 ? (
            <>
              {/* 2nd Place */}
              <PodiumCard entry={top3[1]} position={2} />
              {/* 1st Place */}
              <PodiumCard entry={top3[0]} position={1} isFirst />
              {/* 3rd Place */}
              <PodiumCard entry={top3[2]} position={3} />
            </>
          ) : top3.length === 2 ? (
            <>
              <div />
              <PodiumCard entry={top3[0]} position={1} isFirst />
              <PodiumCard entry={top3[1]} position={2} />
            </>
          ) : top3.length === 1 ? (
            <>
              <div />
              <PodiumCard entry={top3[0]} position={1} isFirst />
              <div />
            </>
          ) : (
            <div className="col-span-3 p-12 rounded-xl bg-quest-card border border-quest-border text-center">
              <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
                <i className="ri-trophy-line text-2xl text-quest-textDim" />
              </div>
              <p className="text-sm text-quest-textMuted">No entries for this category and period.</p>
            </div>
          )}
        </motion.div>

        {/* Full Rankings Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activePeriod}-${activeCategory}-table`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl bg-quest-card border border-quest-border overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-quest-border text-xs text-quest-textDim font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Student</div>
              <div className="col-span-2 text-center">Level</div>
              <div className="col-span-2 text-center">XP Earned</div>
              <div className="col-span-3 text-center">Stats</div>
            </div>

            {/* Table body */}
            <div className="divide-y divide-quest-border">
              {restEntries.map((entry, i) => (
                <RankingRow
                  key={entry.id}
                  entry={entry}
                  isCurrentUser={entry.user.id === 'user-001'}
                />
              ))}
              {restEntries.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm text-quest-textDim">Only the podium ranks are filled for this view.</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Current User Rank Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 p-5 rounded-xl bg-quest-card border border-quest-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-quest-primary/20 border border-quest-primary/30 flex items-center justify-center">
                  <span className="text-quest-primary text-sm font-bold">
                    {user.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-quest-text">{user.full_name}</span>
                    <span className="text-xs text-quest-primary">You</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-quest-textDim">Level {user.current_level}</span>
                    <span className="text-xs text-quest-textDim">&middot;</span>
                    <span className="text-xs text-quest-textDim">{user.current_rank}</span>
                    <span className="text-xs text-quest-textDim">&middot;</span>
                    <span className="text-xs text-quest-textDim">{user.streak_days}-day streak</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-quest-textDim">Total XP</div>
                  <div className="text-lg font-bold text-amber-400">{user.total_xp?.toLocaleString() || 0}</div>
                </div>
                <div className="w-px h-10 bg-quest-border" />
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-quest-primary/10 border border-quest-primary/20">
                  <i className="ri-arrow-up-line text-sm text-quest-primary" />
                  <span className="text-xs font-semibold text-quest-primary whitespace-nowrap">Keep pushing!</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PodiumCard({
  entry,
  position,
  isFirst = false,
}: {
  entry: LeaderboardEntry;
  position: number;
  isFirst?: boolean;
}) {
  const medal = positionMedals[position as keyof typeof positionMedals];
  const rankCfg = rankColors[entry.user.rank as keyof typeof rankColors] || rankColors.Novice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: position * 0.1 }}
      className={`relative rounded-xl border p-5 flex flex-col items-center text-center ${
        isFirst
          ? 'bg-quest-card border-amber-500/30 shadow-lg shadow-amber-500/10'
          : 'bg-quest-card border-quest-border'
      }`}
    >
      {/* Medal icon */}
      <div className={`w-10 h-10 rounded-full ${medal.bg} border ${medal.bg.replace('/10', '/30')} flex items-center justify-center mb-3 ${isFirst ? 'animate-pulse-slow' : ''}`}>
        <i className={`${medal.icon} text-lg ${medal.color}`} />
      </div>

      {/* Position number */}
      <span className={`text-xs font-bold mb-2 ${isFirst ? 'text-amber-400' : 'text-quest-textDim'}`}>
        #{position}
      </span>

      {/* Avatar */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 border-2 ${
          isFirst
            ? 'border-amber-500 bg-amber-500/10'
            : position === 2
              ? 'border-slate-400 bg-slate-500/10'
              : 'border-amber-700 bg-amber-700/10'
        }`}
      >
        <span className={`text-lg font-bold ${isFirst ? 'text-amber-400' : 'text-quest-textMuted'}`}>
          {entry.user.avatarInitials}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-bold text-quest-text mb-1 whitespace-nowrap truncate w-full">
        {entry.user.fullName}
      </h3>

      {/* Rank badge */}
      <span className={`text-xs px-2 py-0.5 rounded-full ${rankCfg.bg} ${rankCfg.text} border ${rankCfg.border} mb-3`}>
        {entry.user.rank}
      </span>

      {/* Stats mini */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-quest-textDim">Level</span>
          <span className="text-quest-textMuted font-semibold">{entry.user.level}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-quest-textDim">XP</span>
          <span className="text-amber-400 font-semibold">{entry.xpEarned.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-quest-textDim">Streak</span>
          <span className="text-rose-400 font-semibold">{entry.user.streakDays}d</span>
        </div>
      </div>

      {/* First place glow ring */}
      {isFirst && (
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
}

function RankingRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  const rankCfg = rankColors[entry.user.rank as keyof typeof rankColors] || rankColors.Novice;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center transition-colors ${
        isCurrentUser ? 'bg-emerald-500/5' : 'hover:bg-quest-bg/50'
      }`}
    >
      {/* Position */}
      <div className="col-span-1">
        <span className="text-sm font-bold text-quest-textDim">#{entry.position}</span>
      </div>

      {/* Student */}
      <div className="col-span-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center">
          <span className="text-xs font-semibold text-quest-textDim">{entry.user.avatarInitials}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-quest-text truncate">
              {entry.user.fullName}
            </span>
            {isCurrentUser && (
              <span className="text-xs text-quest-primary font-medium whitespace-nowrap">You</span>
            )}
          </div>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${rankCfg.bg} ${rankCfg.text}`}>
            {entry.user.rank}
          </span>
        </div>
      </div>

      {/* Level */}
      <div className="col-span-2 text-center">
        <span className="text-sm font-semibold text-quest-textMuted">{entry.user.level}</span>
      </div>

      {/* XP */}
      <div className="col-span-2 text-center">
        <span className="text-sm font-bold text-amber-400">{entry.xpEarned.toLocaleString()}</span>
      </div>

      {/* Stats */}
      <div className="col-span-3 flex items-center justify-center gap-3 text-xs text-quest-textDim">
        <span title="Quests Completed">
          <i className="ri-sword-line mr-1" />{entry.questsCompleted}
        </span>
        <span title="Challenges Solved">
          <i className="ri-code-box-line mr-1" />{entry.challengesSolved}
        </span>
        <span title="Quiz Wins">
          <i className="ri-brain-line mr-1" />{entry.quizWins}
        </span>
        <span title="Boss Quests">
          <i className="ri-fire-line mr-1" />{entry.bossQuestsCleared}
        </span>
      </div>
    </motion.div>
  );
}