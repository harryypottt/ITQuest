import { motion } from 'framer-motion';

export interface BattleParticipant {
  id: string;
  name: string;
  score: number;
  combo: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  avgResponseTime: number;
  isCurrentUser?: boolean;
}

interface BattleRankingProps {
  participants: BattleParticipant[];
  totalQuestions: number;
}

export default function BattleRanking({ participants, totalQuestions }: BattleRankingProps) {
  const sorted = [...participants].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.avgResponseTime - b.avgResponseTime;
  });

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 0:
        return {
          bg: 'bg-quest-gold/10',
          border: 'border-quest-gold/40',
          text: 'text-quest-gold',
          badge: '1st',
          badgeBg: 'bg-quest-gold',
        };
      case 1:
        return {
          bg: 'bg-slate-300/10',
          border: 'border-slate-400/40',
          text: 'text-slate-300',
          badge: '2nd',
          badgeBg: 'bg-slate-400',
        };
      case 2:
        return {
          bg: 'bg-amber-700/10',
          border: 'border-amber-600/40',
          text: 'text-amber-500',
          badge: '3rd',
          badgeBg: 'bg-amber-600',
        };
      default:
        return {
          bg: 'bg-quest-card',
          border: 'border-quest-border',
          text: 'text-quest-textMuted',
          badge: `${rank + 1}th`,
          badgeBg: 'bg-quest-border',
        };
    }
  };

  return (
    <div className="bg-quest-card border border-quest-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-quest-border">
        <h3 className="text-sm font-bold text-quest-text flex items-center gap-2">
          <i className="ri-trophy-line text-quest-gold" />
          Live Rankings
        </h3>
        <p className="text-xs text-quest-textDim mt-0.5">
          {totalQuestions} questions • {participants.length} players
        </p>
      </div>

      {/* Rankings list */}
      <div className="divide-y divide-quest-border">
        {sorted.map((p, idx) => {
          const colors = getRankColors(idx);
          const accuracy = p.questionsAnswered > 0
            ? Math.round((p.correctAnswers / p.questionsAnswered) * 100)
            : 0;

          return (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 ${colors.bg} ${p.isCurrentUser ? 'border-l-2 border-l-quest-primary' : ''}`}
            >
              {/* Rank badge */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${colors.badgeBg}`}
              >
                {colors.badge}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center flex-shrink-0">
                <i className="ri-user-line text-quest-textDim text-sm" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-quest-text truncate">
                    {p.name}
                  </span>
                  {p.isCurrentUser && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-quest-primary/20 text-quest-primary font-semibold whitespace-nowrap">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-quest-textDim">
                  <span>{p.questionsAnswered}/{totalQuestions} answered</span>
                  <span className="text-quest-border">•</span>
                  <span>{accuracy}% accuracy</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <span className={`text-base font-bold font-mono tabular-nums ${colors.text}`}>
                  {p.score}
                </span>
                {p.combo >= 3 && (
                  <div className="text-[10px] text-quest-accent font-semibold animate-pulse">
                    x{p.combo} combo
                  </div>
                )}
                <div className="text-[10px] text-quest-textDim">
                  {p.avgResponseTime > 0 ? `${(p.avgResponseTime / 1000).toFixed(1)}s avg` : '—'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}