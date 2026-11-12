import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  bossQuests,
  getBossQuestStatus,
  getRegionBossProgress,
  isBossQuestUnlocked,
  getBossPrerequisiteQuestNames,
  forceUnlockBossQuest,
  type BossQuestData,
} from '@/sampleData/bossQuestData';
import { worldRegions } from '@/sampleData/questExpandedData';

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
  'frontend-kingdom': '#10b981',
  'server-citadel': '#06b6d4',
  'data-vault': '#8b5cf6',
  'cyber-fortress': '#f43f5e',
  'networking-nexus': '#14b8a6',
  'design-sanctum': '#d946ef',
  'fullstack-forge': '#f59e0b',
};

const statusFilters: { value: string; label: string; icon: string }[] = [
  { value: 'all', label: 'All Quests', icon: 'ri-fire-line' },
  { value: 'locked', label: 'Locked', icon: 'ri-lock-line' },
  { value: 'available', label: 'Available', icon: 'ri-play-circle-line' },
  { value: 'in_progress', label: 'In Progress', icon: 'ri-loader-4-line' },
  { value: 'submitted', label: 'Submitted', icon: 'ri-send-plane-line' },
  { value: 'completed', label: 'Completed', icon: 'ri-check-double-line' },
];

export default function BossQuests() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  // Compute stats
  const stats = useMemo(() => {
    let locked = 0, available = 0, inProgress = 0, submitted = 0, completed = 0;
    let regionsCleared = 0;
    let totalXp = 0;

    bossQuests.forEach((q) => {
      totalXp += q.xpReward;
      const status = getBossQuestStatus(q.id);
      if (status === 'locked') locked++;
      else if (status === 'available') available++;
      else if (status === 'in_progress') inProgress++;
      else if (status === 'submitted' || status === 'under_review') submitted++;
      else if (status === 'completed' || status === 'approved') completed++;
    });

    worldRegions.forEach((r) => {
      const { isCompleted } = getRegionBossProgress(r.id);
      if (isCompleted) regionsCleared++;
    });

    return { locked, available, inProgress, submitted, completed, regionsCleared, totalRegions: worldRegions.length, totalXp };
  }, []);

  // Filtered regions — single boss per region by default, legendary only after clearance
  const regionData = useMemo(() => {
    return worldRegions.map((region) => {
      const { bossQuest, legendBossQuest, isUnlocked, isCompleted, isLegendUnlocked, unlockProgress } = getRegionBossProgress(region.id);

      // Main boss quest — always shown if region is accessible
      const mainBosses: BossQuestData[] = [];
      if (bossQuest) mainBosses.push(bossQuest);

      // Legendary boss — only shown after region boss is completed AND legendary is unlocked
      if (legendBossQuest && isCompleted && isLegendUnlocked) {
        mainBosses.push(legendBossQuest);
      }

      // Filter by status
      const filteredBosses = statusFilter === 'all'
        ? mainBosses
        : mainBosses.filter((q) => {
            const s = getBossQuestStatus(q.id);
            if (statusFilter === 'completed') return s === 'completed' || s === 'approved';
            if (statusFilter === 'submitted') return s === 'submitted' || s === 'under_review';
            return s === statusFilter;
          });

      return { region, bossQuest, legendBossQuest, isUnlocked, isCompleted, isLegendUnlocked, unlockProgress, filteredBosses };
    }).filter((d) => d.filteredBosses.length > 0 || (statusFilter === 'all' && (d.bossQuest !== null)));
  }, [statusFilter]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center"
            >
              <i className="ri-fire-line text-xl text-rose-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text">Boss Quests</h1>
              <p className="text-xs text-quest-textMuted mt-0.5">Region-clearing milestone challenges — prove your mastery</p>
            </div>
          </div>

          {/* Region cleared count */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-quest-card border border-quest-border">
            <i className="ri-flag-line text-amber-400" />
            <span className="text-xs text-quest-textDim">
              <span className="text-amber-400 font-bold">{stats.regionsCleared}</span>/{stats.totalRegions} regions cleared
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Locked', count: stats.locked, icon: 'ri-lock-line', color: 'text-quest-textDim', border: 'border-quest-border' },
            { label: 'Available', count: stats.available, icon: 'ri-play-circle-line', color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'In Progress', count: stats.inProgress, icon: 'ri-loader-4-line', color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Submitted', count: stats.submitted, icon: 'ri-send-plane-line', color: 'text-cyan-400', border: 'border-cyan-500/20' },
            { label: 'Completed', count: stats.completed, icon: 'ri-check-double-line', color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'Total XP', count: stats.totalXp, icon: 'ri-flashlight-line', color: 'text-amber-400', border: 'border-amber-500/20', suffix: ' XP' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-quest-card border ${stat.border} rounded-xl p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <i className={`${stat.icon} ${stat.color} text-xs`} />
                <span className="text-[10px] text-quest-textDim uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.count}{stat.suffix || ''}
              </div>
            </div>
          ))}
        </div>

        {/* Global progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-quest-textMuted">Region Progression</span>
            <span className="text-quest-textDim">{stats.regionsCleared}/{stats.totalRegions} regions conquered</span>
          </div>
          <div className="h-2 rounded-full bg-quest-card border border-quest-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((stats.regionsCleared / stats.totalRegions) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400"
            />
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 bg-quest-card border border-quest-border rounded-full p-1 mb-6 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === f.value
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'text-quest-textDim hover:text-quest-textMuted'
              }`}
            >
              <i className={f.icon} />
              {f.label}
            </button>
          ))}
        </div>

        {/* Region-organized Boss Quest Panels */}
        <div className="space-y-5">
          {regionData.map(({ region, bossQuest, legendBossQuest, isUnlocked, isCompleted, isLegendUnlocked, unlockProgress, filteredBosses }) => {
            const regionColor = regionColors[region.id] || '#10b981';
            const isExpanded = expandedRegion === region.id;

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isCompleted
                    ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-quest-card to-quest-card'
                    : isUnlocked
                      ? 'border-quest-border bg-quest-card'
                      : 'border-quest-border/50 bg-quest-card/50 opacity-70'
                }`}
              >
                {/* Region header */}
                <button
                  onClick={() => setExpandedRegion(isExpanded ? null : region.id)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-quest-bg/30 transition-colors cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${regionColor}15`, border: `1px solid ${regionColor}40` }}
                  >
                    <i className={`${regionIcons[region.id]} text-lg`} style={{ color: regionColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-quest-text">{region.name}</h3>
                      {isCompleted && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                        >
                          <i className="ri-check-line text-emerald-400 text-xs" />
                        </motion.span>
                      )}
                      {!isUnlocked && (
                        <span className="w-5 h-5 rounded-full bg-quest-border/30 border border-quest-border/50 flex items-center justify-center">
                          <i className="ri-lock-line text-quest-textDim text-xs" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-quest-textDim mt-0.5">{region.subtitle}</p>
                  </div>

                  {/* Region progress mini bar */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-quest-textDim">
                        {filteredBosses.filter((b) => {
                          const s = getBossQuestStatus(b.id);
                          return s === 'completed' || s === 'approved';
                        }).length}/{filteredBosses.length} bosses
                      </div>
                    </div>
                    <i className={`${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-quest-textDim`} />
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-5">
                        {/* Region description */}
                        <p className="text-xs text-quest-textMuted mb-4 leading-relaxed">{region.description}</p>

                        {/* Unlock info if locked */}
                        {!isUnlocked && unlockProgress && (
                          <div className="mb-4 p-4 rounded-xl bg-quest-bg/50 border border-quest-border">
                            <div className="flex items-center gap-2 mb-3">
                              <i className="ri-lock-line text-quest-textDim" />
                              <span className="text-xs font-semibold text-quest-textDim">Region Locked — Unlock Requirements</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className={`p-2 rounded-lg border text-center ${unlockProgress.questsCompleted >= unlockProgress.questsRequired ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/30'}`}>
                                <div className="text-lg font-bold" style={{ color: unlockProgress.questsCompleted >= unlockProgress.questsRequired ? '#34d399' : '#6b7280' }}>
                                  {unlockProgress.questsCompleted}/{unlockProgress.questsRequired}
                                </div>
                                <div className="text-[10px] text-quest-textDim">Quests</div>
                              </div>
                              <div className={`p-2 rounded-lg border text-center ${unlockProgress.xpCurrent >= unlockProgress.xpRequired ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/30'}`}>
                                <div className="text-lg font-bold" style={{ color: unlockProgress.xpCurrent >= unlockProgress.xpRequired ? '#34d399' : '#6b7280' }}>
                                  {unlockProgress.xpCurrent}/{unlockProgress.xpRequired}
                                </div>
                                <div className="text-[10px] text-quest-textDim">XP</div>
                              </div>
                              <div className={`p-2 rounded-lg border text-center ${unlockProgress.levelCurrent >= unlockProgress.levelRequired ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/30'}`}>
                                <div className="text-lg font-bold" style={{ color: unlockProgress.levelCurrent >= unlockProgress.levelRequired ? '#34d399' : '#6b7280' }}>
                                  Lv.{unlockProgress.levelCurrent}→{unlockProgress.levelRequired}
                                </div>
                                <div className="text-[10px] text-quest-textDim">Level</div>
                              </div>
                              <div className={`p-2 rounded-lg border text-center ${unlockProgress.streakCurrent >= unlockProgress.streakRequired ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-quest-border/50 bg-quest-bg/30'}`}>
                                <div className="text-lg font-bold" style={{ color: unlockProgress.streakCurrent >= unlockProgress.streakRequired ? '#34d399' : '#6b7280' }}>
                                  {unlockProgress.streakCurrent}/{unlockProgress.streakRequired}d
                                </div>
                                <div className="text-[10px] text-quest-textDim">Streak</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Region cleared banner */}
                        {isCompleted && (
                          <div className="mb-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                              className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                            >
                              <i className="ri-vip-crown-line text-emerald-400" />
                            </motion.div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-emerald-400">Region Cleared!</div>
                              <div className="text-xs text-quest-textDim">The region boss for {region.name} has been defeated.</div>
                            </div>
                            {legendBossQuest && !isLegendUnlocked && (
                              <span className="text-[10px] text-amber-400/70 bg-amber-500/5 border border-amber-500/15 rounded-full px-3 py-1 whitespace-nowrap">
                                Legendary locked
                              </span>
                            )}
                          </div>
                        )}

                        {/* Legendary unlocked banner */}
                        {isLegendUnlocked && legendBossQuest && (
                          <div className="mb-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-center gap-3">
                            <motion.div
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center"
                            >
                              <i className="ri-star-smile-line text-yellow-400" />
                            </motion.div>
                            <div>
                              <div className="text-sm font-bold text-yellow-400">Legendary Quest Available!</div>
                              <div className="text-xs text-quest-textDim">A legendary challenge awaits in the {region.name}.</div>
                            </div>
                          </div>
                        )}

                        {/* Progression flow visual */}
                        {filteredBosses.length > 0 && (
                          <div className="mb-5 p-4 rounded-xl bg-quest-bg/30 border border-quest-border/50">
                            <p className="text-[10px] text-quest-textDim uppercase tracking-wider mb-3">Progression Flow</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {filteredBosses.map((bq, i) => {
                                const bqStatus = getBossQuestStatus(bq.id);
                                const isBqCompleted = bqStatus === 'completed' || bqStatus === 'approved';
                                const isRegionBoss = bq.bossType === 'region-boss';
                                return (
                                  <div key={bq.id} className="flex items-center gap-2">
                                    {i > 0 && (
                                      <div className={`w-6 h-0.5 rounded-full ${isBqCompleted ? 'bg-emerald-500/50' : 'bg-quest-border/50'}`} />
                                    )}
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] whitespace-nowrap ${
                                      isBqCompleted
                                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                                        : isRegionBoss
                                          ? 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                                          : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400'
                                    }`}>
                                      <i className={isRegionBoss ? 'ri-fire-line' : 'ri-star-smile-line'} />
                                      {isRegionBoss ? 'Region Boss' : 'Legendary'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Boss quest cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredBosses.map((quest) => (
                            <BossQuestMiniCard
                              key={quest.id}
                              quest={quest}
                              regionColor={regionColor}
                              onClick={(id) => navigate(`/boss-quests/${id}`)}
                            />
                          ))}
                        </div>

                        {/* Prerequisite quest list for locked region boss */}
                        {!isUnlocked && bossQuest && unlockProgress && (
                          <div className="mt-4 p-4 rounded-xl bg-quest-bg/30 border border-quest-border/50">
                            <h4 className="text-xs font-semibold text-quest-textDim mb-3">Required Quests for Region Boss</h4>
                            <div className="space-y-1.5">
                              {bossQuest.requiresQuestIds.map((qid) => {
                                const isMet = !unlockProgress.missingQuestIds.includes(qid);
                                const questName = getBossPrerequisiteQuestNames(bossQuest)[bossQuest.requiresQuestIds.indexOf(qid)] || qid;
                                return (
                                  <div key={qid} className="flex items-center gap-2 text-xs">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-quest-border/30 text-quest-textDim'}`}>
                                      {isMet ? <i className="ri-check-line text-[8px]" /> : <span className="text-[8px]">-</span>}
                                    </span>
                                    <span className={isMet ? 'text-quest-textMuted' : 'text-quest-textDim'}>{questName}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {regionData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-quest-card border border-quest-border flex items-center justify-center mx-auto mb-4">
              <i className="ri-fire-line text-3xl text-quest-textDim" />
            </div>
            <p className="text-sm text-quest-textMuted">No boss quests match your filters.</p>
            <button
              onClick={() => setStatusFilter('all')}
              className="mt-3 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================
// MINI BOSS CARD (inside region panels)
// ============================================================
function BossQuestMiniCard({ quest, regionColor, onClick }: { quest: BossQuestData; regionColor: string; onClick: (id: string) => void }) {
  const status = getBossQuestStatus(quest.id);
  const unlock = isBossQuestUnlocked(quest);
  const isLocked = status === 'locked';
  const isLegendary = quest.bossType === 'legendary-boss';

  const totalPrereqs = unlock.questsRequired + (quest.requiresXP > 0 ? 1 : 0) + (quest.requiresLevel > 1 ? 1 : 0) + (quest.requiresStreak > 0 ? 1 : 0);
  const metPrereqs = unlock.questsCompleted + (unlock.xpCurrent >= unlock.xpRequired ? 1 : 0) + (unlock.levelCurrent >= unlock.levelRequired ? 1 : 0) + (unlock.streakCurrent >= unlock.streakRequired ? 1 : 0);
  const prereqPct = totalPrereqs > 0 ? Math.round((metPrereqs / totalPrereqs) * 100) : 100;

  const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
    locked: { label: 'Locked', color: 'text-quest-textDim', icon: 'ri-lock-line' },
    available: { label: 'Available', color: 'text-emerald-400', icon: 'ri-play-circle-line' },
    in_progress: { label: 'In Progress', color: 'text-amber-400', icon: 'ri-loader-4-line' },
    submitted: { label: 'Submitted', color: 'text-cyan-400', icon: 'ri-send-plane-line' },
    under_review: { label: 'Under Review', color: 'text-violet-400', icon: 'ri-search-eye-line' },
    approved: { label: 'Approved', color: 'text-emerald-400', icon: 'ri-check-double-line' },
    completed: { label: 'Completed', color: 'text-emerald-400', icon: 'ri-check-double-line' },
    needs_revision: { label: 'Needs Revision', color: 'text-rose-400', icon: 'ri-close-circle-line' },
  };

  const sl = statusLabels[status] || statusLabels.locked;

  return (
    <motion.div
      whileHover={!isLocked ? { y: -2, scale: 1.02 } : {}}
      onClick={() => !isLocked && onClick(quest.id)}
      className={`relative p-4 rounded-xl border transition-all ${
        isLocked
          ? 'bg-quest-card/50 border-quest-border/30 cursor-not-allowed opacity-60'
          : isLegendary
            ? 'bg-quest-card border-yellow-500/30 cursor-pointer hover:border-yellow-500/50'
            : 'bg-quest-bg/50 border-quest-border cursor-pointer hover:border-quest-textDim/40'
      }`}
    >
      {/* Lock overlay for locked cards */}
      {isLocked && (
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-quest-card/50 z-10 gap-2">
          <div className="text-center">
            <i className="ri-lock-line text-lg text-quest-textDim block mb-1" />
            <span className="text-[10px] text-quest-textDim">{prereqPct}%</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              forceUnlockBossQuest(quest.id);
              window.location.reload();
            }}
            className="text-[10px] px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-key-2-line text-[10px] mr-1" />
            Force Unlock
          </button>
        </div>
      )}

      {/* Legendary shimmer */}
      {isLegendary && !isLocked && (
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 pointer-events-none"
        />
      )}

      <div className="flex items-start gap-3 relative z-[1]">
        {/* Boss type icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${regionColor}15`, border: `1px solid ${regionColor}30` }}
        >
          <i className={isLegendary ? 'ri-star-smile-line text-base' : 'ri-fire-line text-base'} style={{ color: regionColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-xs font-bold text-quest-text truncate">{quest.title}</h4>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${sl.color} flex-shrink-0`}>
              <i className={`${sl.icon} text-[8px] mr-0.5`} />
              {sl.label}
            </span>
          </div>
          <p className="text-[10px] text-quest-textDim mb-2 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <i className="ri-flashlight-line text-quest-gold" />
              {quest.xpReward} XP
            </span>
            <span>•</span>
            <span>{quest.difficulty}◆</span>
          </p>
          {/* Mini progress for locked */}
          {isLocked && prereqPct < 100 && (
            <div className="h-1 rounded-full bg-quest-border/30 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500/40" style={{ width: `${prereqPct}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* Complete check */}
      {(status === 'completed' || status === 'approved') && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center z-20">
          <i className="ri-check-line text-emerald-400 text-[10px]" />
        </div>
      )}
    </motion.div>
  );
}