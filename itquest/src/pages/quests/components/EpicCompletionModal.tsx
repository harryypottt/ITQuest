import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quest } from '@/sampleData/questData';
import { questTypeConfig, worldRegions, getNewlyUnlockedQuests } from '@/sampleData/questData';

interface EpicCompletionModalProps {
  isOpen: boolean;
  quest: Quest | null;
  newlyUnlockedQuests: Quest[];
  newlyUnlockedRegions: { id: string; name: string; icon: string; color: string }[];
  onClose: () => void;
  onViewUnlocked: (quest: Quest) => void;
}

export default function EpicCompletionModal({
  isOpen,
  quest,
  newlyUnlockedQuests,
  newlyUnlockedRegions,
  onClose,
  onViewUnlocked,
}: EpicCompletionModalProps) {
  const [showUnlocks, setShowUnlocks] = useState(false);
  const [step, setStep] = useState<'celebration' | 'summary' | 'unlocks'>('celebration');

  useEffect(() => {
    if (isOpen) {
      setStep('celebration');
      setShowUnlocks(false);
      const t1 = setTimeout(() => setStep('summary'), 2000);
      const t2 = setTimeout(() => {
        if (newlyUnlockedQuests.length > 0 || newlyUnlockedRegions.length > 0) {
          setStep('unlocks');
          setShowUnlocks(true);
        }
      }, 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isOpen]);

  if (!quest) return null;
  const typeCfg = questTypeConfig[quest.type];

  const hasUnlocks = newlyUnlockedQuests.length > 0 || newlyUnlockedRegions.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark cinematic backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50"
            onClick={step === 'unlocks' ? onClose : undefined}
          />

          {/* Particle burst overlay */}
          {step === 'celebration' && (
            <div className="fixed inset-0 z-50 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    x: '50vw',
                    y: '50vh',
                    scale: 0,
                  }}
                  animate={{
                    opacity: 0,
                    x: `${50 + (Math.random() - 0.5) * 80}vw`,
                    y: `${50 + (Math.random() - 0.5) * 80}vh`,
                    scale: Math.random() * 2 + 1,
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    delay: Math.random() * 0.3,
                    ease: 'easeOut',
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#f43f5e', '#d946ef'][i % 6],
                  }}
                />
              ))}
            </div>
          )}

          {/* Main modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative bg-quest-card border border-emerald-500/30 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: quest.rarity === 'legendary'
                  ? '0 0 60px rgba(245, 158, 11, 0.3), 0 0 120px rgba(245, 158, 11, 0.1)'
                  : '0 0 40px rgba(16, 185, 129, 0.2)',
              }}
            >
              {/* Golden edge glow for legendary */}
              {quest.rarity === 'legendary' && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 pointer-events-none animate-pulse" />
              )}

              {/* ===== STEP 1: CELEBRATION ===== */}
              <AnimatePresence mode="wait">
                {step === 'celebration' && (
                  <motion.div
                    key="celebration"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-2 ${
                        quest.rarity === 'legendary'
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40'
                          : 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/40'
                      }`}>
                        <i className={`${quest.icon} text-4xl ${quest.rarity === 'legendary' ? 'text-amber-400' : 'text-emerald-400'}`} />
                      </div>
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`text-3xl font-bold font-display tracking-wide mb-2 ${
                        quest.rarity === 'legendary' ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {quest.rarity === 'legendary' ? 'LEGENDARY QUEST COMPLETE!' : 'QUEST COMPLETE!'}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-quest-textMuted"
                    >
                      {quest.title}
                    </motion.p>
                  </motion.div>
                )}

                {/* ===== STEP 2: SUMMARY ===== */}
                {step === 'summary' && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border-2 ${
                      quest.rarity === 'legendary'
                        ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40'
                        : 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/40'
                    }`}>
                      <i className="ri-trophy-line text-3xl text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-quest-text mb-1">Quest Complete!</h2>
                    <p className="text-sm text-quest-textMuted mb-4">{quest.title}</p>

                    {/* Badge earned */}
                    {quest.badgeReward && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-3"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-quest-bg border border-quest-border">
                          <i className={`ri-medal-line ${
                            quest.badgeReward.rarity === 'Legendary' ? 'text-orange-400' :
                            quest.badgeReward.rarity === 'Epic' ? 'text-fuchsia-400' :
                            'text-amber-400'
                          }`} />
                          <div className="text-left">
                            <div className="text-xs text-quest-textDim">Badge Earned</div>
                            <div className="text-sm font-bold text-quest-text">{quest.badgeReward.name}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* XP earned */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="mb-4"
                    >
                      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <i className="ri-flashlight-line text-2xl text-amber-400" />
                        <div className="text-left">
                          <div className="text-xs text-amber-400/70">XP Earned</div>
                          <div className="text-xl font-bold text-amber-400">+{quest.xpReward} XP</div>
                        </div>
                      </div>
                    </motion.div>

                    {hasUnlocks && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xs text-quest-textDim animate-pulse"
                      >
                        Discovering new paths...
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* ===== STEP 3: UNLOCKS ===== */}
                {step === 'unlocks' && hasUnlocks && (
                  <motion.div
                    key="unlocks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-xl font-bold text-quest-text text-center mb-1 font-display">
                      NEW PATHS UNLOCKED!
                    </h2>
                    <p className="text-xs text-quest-textDim text-center mb-5">
                      Your victory has opened new horizons
                    </p>

                    {/* New regions */}
                    {newlyUnlockedRegions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-quest-textDim uppercase tracking-wider mb-2">
                          Regions Unlocked
                        </p>
                        <div className="space-y-2">
                          {newlyUnlockedRegions.map((r, i) => (
                            <motion.div
                              key={r.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.15 }}
                              className="flex items-center gap-3 p-3 rounded-xl border"
                              style={{
                                borderColor: `${r.color}30`,
                                background: `${r.color}08`,
                              }}
                            >
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                                style={{
                                  borderColor: `${r.color}30`,
                                  backgroundColor: `${r.color}15`,
                                }}
                              >
                                <i className={`${r.icon} text-lg`} style={{ color: r.color }} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-quest-text">{r.name}</p>
                                <p className="text-xs text-quest-textDim">New region available</p>
                              </div>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="ml-auto"
                              >
                                <i className="ri-sparkling-line text-lg text-amber-400" />
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New quests */}
                    {newlyUnlockedQuests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-quest-textDim uppercase tracking-wider mb-2">
                          Quests Unlocked
                        </p>
                        <div className="space-y-2">
                          {newlyUnlockedQuests.map((q, i) => {
                            const qt = questTypeConfig[q.type];
                            return (
                              <motion.button
                                key={q.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.15 }}
                                onClick={() => onViewUnlocked(q)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-quest-border bg-quest-card hover:border-quest-textDim/40 transition-all cursor-pointer group"
                              >
                                <div className={`w-10 h-10 rounded-xl ${qt.bg} border ${qt.border} flex items-center justify-center`}>
                                  <i className={`${q.icon} text-lg ${qt.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${qt.bg} ${qt.color}`}>
                                      {qt.label}
                                    </span>
                                    {q.rarity === 'legendary' && (
                                      <span className="text-xs font-bold text-orange-400">LEGENDARY</span>
                                    )}
                                  </div>
                                  <p className="text-sm font-bold text-quest-text truncate">{q.title}</p>
                                </div>
                                <i className="ri-arrow-right-line text-quest-textDim group-hover:text-quest-text transition-all" />
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Continue button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      onClick={onClose}
                      className="w-full mt-4 px-6 py-3 rounded-xl bg-quest-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Continue Adventure
                    </motion.button>
                  </motion.div>
                )}

                {/* No unlocks - just close button */}
                {step === 'summary' && !hasUnlocks && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={onClose}
                    className="mt-4 px-6 py-3 rounded-xl bg-quest-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Continue Adventure
                  </motion.button>
                )}

                {/* Close button during celebration */}
                {step === 'celebration' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    onClick={onClose}
                    className="mt-6 px-6 py-3 rounded-xl bg-quest-bg border border-quest-border text-quest-textDim text-sm hover:text-quest-text transition-all cursor-pointer whitespace-nowrap"
                  >
                    Skip
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}