import { motion } from 'framer-motion';
import type { BossRequirement } from '@/sampleData/bossQuestData';

interface RequirementsChecklistProps {
  requirements: BossRequirement[];
  metIds: string[];
  onToggle: (reqId: string) => void;
}

export default function RequirementsChecklist({ requirements, metIds, onToggle }: RequirementsChecklistProps) {
  const metCount = requirements.filter((r) => metIds.includes(r.id)).length;
  const progressPct = requirements.length > 0 ? Math.round((metCount / requirements.length) * 100) : 0;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-quest-textMuted">Requirements</span>
          <span className={metCount === requirements.length ? 'text-emerald-400 font-semibold' : 'text-quest-textDim'}>
            {metCount}/{requirements.length} met
          </span>
        </div>
        <div className="h-2 rounded-full bg-quest-bg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              progressPct === 100
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : progressPct >= 50
                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                : 'bg-gradient-to-r from-quest-primary to-quest-primaryGlow'
            }`}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
          const isMet = metIds.includes(req.id);
          return (
            <motion.button
              key={req.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onToggle(req.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all group text-xs ${
                isMet
                  ? 'bg-emerald-500/5 border border-emerald-500/20'
                  : 'bg-quest-bg/50 border border-quest-border hover:border-quest-textDim/30'
              }`}
            >
              <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                isMet
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-quest-bg border border-quest-border text-quest-textDim group-hover:border-quest-textDim/30'
              }`}>
                {isMet ? (
                  <i className="ri-check-line text-sm" />
                ) : (
                  <span className="text-[9px]">{index + 1}</span>
                )}
              </span>
              <span className={`flex-1 leading-relaxed ${isMet ? 'text-quest-textMuted line-through' : 'text-quest-text'}`}>
                {req.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}