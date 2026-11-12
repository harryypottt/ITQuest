import { motion } from 'framer-motion';
import type { BossQuestData } from '@/sampleData/bossQuestData';

interface SubmissionModalProps {
  quest: BossQuestData;
  metCount: number;
  totalReqs: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SubmissionModal({ quest, metCount, totalReqs, onConfirm, onCancel }: SubmissionModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-quest-card border border-quest-border rounded-2xl p-8 max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-quest-danger/10 border border-quest-danger/30 flex items-center justify-center mx-auto mb-5"
        >
          <i className="ri-fire-line text-3xl text-quest-danger" />
        </motion.div>

        <h2 className="text-lg font-bold text-quest-text text-center mb-2">Submit Boss Quest?</h2>
        <p className="text-xs text-quest-textMuted text-center mb-5">
          You are about to submit <strong className="text-quest-text">{quest.title}</strong> for review. This action cannot be undone. A faculty member will evaluate your work.
        </p>

        {/* Summary */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-quest-bg border border-quest-border">
            <span className="text-xs text-quest-textMuted">Requirements Met</span>
            <span className="text-xs font-semibold text-emerald-400">{metCount}/{totalReqs}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-quest-bg border border-quest-border">
            <span className="text-xs text-quest-textMuted">XP Reward</span>
            <span className="text-xs font-semibold text-quest-gold flex items-center gap-1">
              <i className="ri-flashlight-line" />
              +{quest.xpReward} XP
            </span>
          </div>
          {quest.badgeReward && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-quest-bg border border-quest-border">
              <span className="text-xs text-quest-textMuted">Badge</span>
              <span className="text-xs font-semibold text-quest-text flex items-center gap-1">
                <i className="ri-medal-line text-quest-gold" />
                {quest.badgeReward.name}
              </span>
            </div>
          )}
        </div>

        {/* Current status note */}
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mb-6">
          <p className="text-[11px] text-amber-400 flex items-start gap-2">
            <i className="ri-information-line mt-0.5 flex-shrink-0" />
            <span>Your submission will be auto-validated and reviewed by faculty. You will receive a notification when the review is complete.</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg bg-quest-bg border border-quest-border text-quest-text text-sm font-medium hover:bg-quest-cardHover transition-colors whitespace-nowrap"
          >
            Keep Working
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-quest-danger hover:bg-quest-dangerGlow text-white text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <i className="ri-send-plane-line" />
            Submit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}