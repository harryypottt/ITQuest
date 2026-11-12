import { motion, AnimatePresence } from 'framer-motion';
import type { Quest } from '@/sampleData/questData';
import { questTypeConfig } from '@/sampleData/questData';

interface CompletionModalProps {
  isOpen: boolean;
  quest: Quest | null;
  onClose: () => void;
}

export default function CompletionModal({ isOpen, quest, onClose }: CompletionModalProps) {
  if (!quest) return null;
  const typeCfg = questTypeConfig[quest.type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative bg-quest-card border border-emerald-500/30 rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 pointer-events-none" />

              {/* Celebration particles */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
                  <i className="ri-trophy-line text-3xl text-amber-400" />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-quest-text mb-1">Quest Complete!</h2>
              <p className="text-sm text-quest-textMuted mb-2">{quest.title}</p>

              {/* Badge earned */}
              {quest.badgeReward && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-quest-bg border border-quest-border">
                    <i className="ri-medal-line text-amber-400" />
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
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <i className="ri-flashlight-line text-2xl text-amber-400" />
                  <div className="text-left">
                    <div className="text-xs text-amber-400/70">XP Earned</div>
                    <div className="text-xl font-bold text-amber-400">+{quest.xpReward} XP</div>
                  </div>
                </div>
              </motion.div>

              {/* Completion message */}
              <p className="text-xs text-quest-textDim mb-6">
                All {quest.objectives.length} objectives completed. Your journey continues, warrior.
              </p>

              {/* Close */}
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-quest-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all whitespace-nowrap cursor-pointer"
              >
                Continue Adventure
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}