import { motion, AnimatePresence } from 'framer-motion';
import type { BossRequirement } from '@/sampleData/bossQuestData';

interface AutoChecklistProps {
  requirements: BossRequirement[];
  metIds: string[];
  showProgress?: boolean;
}

export default function AutoChecklist({ requirements, metIds, showProgress = true }: AutoChecklistProps) {
  const metCount = requirements.filter((r) => metIds.includes(r.id)).length;
  const progressPct = requirements.length > 0 ? Math.round((metCount / requirements.length) * 100) : 0;
  const allValidated = metCount === requirements.length;

  return (
    <div>
      {showProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-quest-textMuted">Auto-Validated Requirements</span>
            <span className={allValidated ? 'text-emerald-400 font-semibold' : 'text-quest-textDim'}>
              {metCount}/{requirements.length} validated
            </span>
          </div>
          <div className="h-2 rounded-full bg-quest-bg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                allValidated
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : progressPct >= 50
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-rose-500 to-rose-400'
              }`}
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {requirements.map((req, index) => {
            const isValidated = metIds.includes(req.id);
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all text-xs ${
                  isValidated
                    ? 'bg-emerald-500/5 border border-emerald-500/20'
                    : 'bg-quest-bg/50 border border-quest-border'
                }`}
              >
                {/* Auto-validation icon */}
                <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                  isValidated
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-quest-bg border border-quest-border text-quest-textDim'
                }`}>
                  {isValidated ? (
                    <i className="ri-check-line text-sm" />
                  ) : (
                    <i className="ri-loader-4-line text-xs animate-spin-slow" />
                  )}
                </span>

                {/* Requirement text */}
                <div className="flex-1 min-w-0">
                  <span className={`leading-relaxed ${isValidated ? 'text-quest-textMuted' : 'text-quest-text'}`}>
                    {req.description}
                  </span>

                  {/* Validation type badge */}
                  <span className="inline-block ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-quest-bg/50 border border-quest-border text-quest-textDim">
                    {req.validationType}
                  </span>

                  {/* Auto-validated indicator */}
                  {isValidated && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="block mt-1 text-[10px] text-emerald-400/70 flex items-center gap-1"
                    >
                      <i className="ri-shield-check-line text-[9px]" />
                      Auto-detected
                    </motion.span>
                  )}

                  {/* Pending indicator */}
                  {!isValidated && (
                    <span className="block mt-1 text-[10px] text-quest-textDim/60 flex items-center gap-1">
                      <i className="ri-time-line text-[9px]" />
                      Validating as you code...
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* All validated celebration */}
      {allValidated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center"
        >
          <i className="ri-check-double-line text-emerald-400 text-lg block mb-1" />
          <span className="text-xs text-emerald-400 font-semibold">All requirements auto-validated!</span>
          <p className="text-[10px] text-quest-textDim mt-0.5">Your code meets all the specified criteria. Ready to submit!</p>
        </motion.div>
      )}
    </div>
  );
}