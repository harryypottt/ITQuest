import { useState } from 'react';
import type { BossQuestData } from '@/sampleData/bossQuestData';
import { getBossQuestStatus } from '@/sampleData/bossQuestData';
import AutoChecklist from './AutoChecklist';

interface BriefPanelProps {
  quest: BossQuestData;
  metRequirements: string[];
  onStartQuest: () => void;
  onSubmit: () => void;
}

const difficultyColors: Record<number, string> = {
  1: 'text-emerald-400',
  2: 'text-cyan-400',
  3: 'text-amber-400',
  4: 'text-rose-400',
  5: 'text-purple-400',
};

export default function BriefPanel({
  quest,
  metRequirements,
  onStartQuest,
  onSubmit,
}: BriefPanelProps) {
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const status = getBossQuestStatus(quest.id);

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const metCount = metRequirements.length;
  const allMet = metCount >= quest.requirements.filter(r => r.isAutoValidated).length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-quest-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <i className="ri-fire-line text-quest-danger text-lg" />
          <h2 className="text-sm font-bold text-quest-text leading-tight">{quest.title}</h2>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className={difficultyColors[quest.difficulty]}>
            {Array.from({ length: quest.difficulty }, () => '◆').join('')} Tier {quest.difficulty}
          </span>
          <span className="text-quest-textDim">•</span>
          <span className="text-quest-textDim">{quest.estimatedMinutes} min</span>
          <span className="text-quest-textDim">•</span>
          <span className="text-quest-textDim">{quest.deadlineDays} days deadline</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Story */}
        <div>
          <h4 className="text-[11px] font-semibold text-quest-textDim uppercase tracking-wider mb-2">Mission Brief</h4>
          <p className="text-xs text-quest-textMuted leading-relaxed">{quest.storyText}</p>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-quest-bg border border-quest-border">
          <div className="flex items-center gap-1.5 text-quest-gold">
            <i className="ri-flashlight-line" />
            <span className="text-xs font-bold">{quest.xpReward} XP</span>
          </div>
          {quest.badgeReward && (
            <>
              <span className="text-quest-textDim text-xs">•</span>
              <div className="flex items-center gap-1.5 text-quest-textMuted">
                <i className="ri-medal-line text-quest-gold" />
                <span className="text-[11px]">{quest.badgeReward.name}</span>
                <span className="text-[10px] text-quest-textDim">({quest.badgeReward.rarity})</span>
              </div>
            </>
          )}
          <span className="text-quest-textDim text-xs">•</span>
          <span className="text-[10px] text-quest-textDim">{quest.bossType === 'legendary-boss' ? 'Legendary' : quest.bossType === 'elite-boss' ? 'Elite' : 'Region'} Boss</span>
        </div>

        {/* Auto-Validated Requirements */}
        <AutoChecklist
          requirements={quest.requirements}
          metIds={metRequirements}
        />

        {/* Hints */}
        <div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-[11px] text-quest-textDim hover:text-quest-textMuted transition-colors cursor-pointer"
          >
            <i className={`ri-lightbulb-line ${showHints ? 'text-quest-gold' : ''}`} />
            <span>Hints ({quest.hints.length})</span>
            <i className={`${showHints ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-[10px]`} />
          </button>
          {showHints && (
            <div className="mt-2 space-y-1.5">
              {quest.hints.map((hint, i) => (
                <div key={i} className="relative">
                  {revealedHints.includes(i) ? (
                    <p className="text-[11px] text-quest-textMuted bg-quest-bg/60 rounded-lg p-2.5 border border-quest-border">
                      {hint}
                    </p>
                  ) : (
                    <button
                      onClick={() => revealHint(i)}
                      className="w-full text-left text-[11px] text-quest-textDim bg-quest-bg/30 rounded-lg p-2.5 border border-quest-border/50 hover:border-quest-border transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <i className="ri-eye-off-line" />
                        Hint {i + 1} — Click to reveal
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solution hint */}
        <div>
          <button
            onClick={() => revealHint(-1)}
            className="text-[10px] text-quest-textDim/60 hover:text-quest-textDim transition-colors cursor-pointer"
          >
            {revealedHints.includes(-1) ? quest.solutionHint : 'Reveal solution approach...'}
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-4 py-3 border-t border-quest-border flex-shrink-0 space-y-2">
        {status === 'available' && (
          <button
            onClick={onStartQuest}
            className="w-full px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="ri-fire-line" />
            Accept Boss Quest
          </button>
        )}
        {status === 'in_progress' && (
          <button
            onClick={onSubmit}
            className={`w-full px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer ${
              allMet
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-quest-bg border border-quest-border text-quest-textDim cursor-not-allowed'
            }`}
          >
            <i className="ri-send-plane-line" />
            {allMet ? 'Submit for Review' : `Complete all validations (${metCount}/${quest.requirements.filter(r => r.isAutoValidated).length})`}
          </button>
        )}
        {status === 'submitted' && (
          <div className="px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs text-center font-medium">
            <i className="ri-send-plane-line mr-1.5" />
            Submitted — Awaiting review
          </div>
        )}
        {status === 'under_review' && (
          <div className="px-4 py-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs text-center font-medium">
            <i className="ri-search-eye-line mr-1.5" />
            Under review by faculty
          </div>
        )}
        {status === 'needs_revision' && (
          <div className="px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs text-center font-medium">
            <i className="ri-close-circle-line mr-1.5" />
            Needs revision — Check feedback
          </div>
        )}
        {(status === 'approved' || status === 'completed') && (
          <div className="px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
            <i className="ri-check-double-line mr-1.5" />
            Boss Quest {status === 'approved' ? 'Approved!' : 'Completed!'}
          </div>
        )}
      </div>
    </div>
  );
}