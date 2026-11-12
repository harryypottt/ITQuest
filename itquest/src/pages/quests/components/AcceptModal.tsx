import { motion, AnimatePresence } from 'framer-motion';
import type { Quest } from '@/sampleData/questData';
import { questTypeConfig } from '@/sampleData/questData';

interface AcceptModalProps {
  isOpen: boolean;
  quest: Quest | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function AcceptModal({ isOpen, quest, onConfirm, onClose }: AcceptModalProps) {
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative bg-quest-card border border-quest-border rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-${typeCfg.color.replace('text-', '')}/60 to-transparent`} />

              {/* Icon */}
              <div className="flex justify-center mb-4 mt-2">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-16 h-16 rounded-2xl ${typeCfg.bg} border ${typeCfg.border} flex items-center justify-center`}
                >
                  <i className={`${quest.icon} text-2xl ${typeCfg.color}`} />
                </motion.div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-quest-text text-center mb-1">Accept Quest?</h2>
              <p className="text-sm text-quest-textMuted text-center mb-1">{quest.title}</p>
              <span className={`block text-center text-xs ${typeCfg.color} font-medium mb-4`}>{typeCfg.label}</span>

              {/* Divider */}
              <div className="border-t border-quest-border my-4" />

              {/* Quest details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-quest-textDim">Difficulty</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${i < quest.difficulty ? 'bg-amber-500/60' : 'bg-quest-border'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-quest-textDim">Estimated Time</span>
                  <span className="text-xs text-quest-textMuted">{quest.estimatedMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-quest-textDim">Objectives</span>
                  <span className="text-xs text-quest-textMuted">{quest.objectives.length} tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-quest-textDim">XP Reward</span>
                  <span className="text-xs font-bold text-amber-400">+{quest.xpReward} XP</span>
                </div>
                {quest.badgeReward && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-quest-textDim">Badge</span>
                    <span className="text-xs text-quest-textMuted">{quest.badgeReward.name}</span>
                  </div>
                )}
              </div>

              {/* Objectives preview */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-quest-textDim uppercase tracking-wider mb-2">You will need to:</p>
                <ul className="space-y-1.5">
                  {quest.objectives.map((obj, i) => (
                    <li key={obj.id} className="flex items-start gap-2">
                      <span className="text-xs text-quest-textDim mt-0.5">{i + 1}.</span>
                      <span className="text-xs text-quest-textMuted">{obj.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Story teaser */}
              <div className="mb-6 p-3 rounded-lg bg-quest-bg/30 border border-quest-border italic text-xs text-quest-textDim leading-relaxed">
                &ldquo;{quest.storyText.slice(0, 120)}...&rdquo;
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onConfirm}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-quest-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-sword-line" />
                  Begin Quest
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-quest-bg border border-quest-border text-quest-textDim text-sm hover:text-quest-text hover:border-quest-textDim transition-all whitespace-nowrap cursor-pointer"
                >
                  Not Yet
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}