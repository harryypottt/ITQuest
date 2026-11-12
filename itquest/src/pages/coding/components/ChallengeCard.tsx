import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { CodingChallenge } from '@/sampleData/codingChallengeData';

interface ChallengeSubmission {
  status?: string;
  attempts?: number;
  best_score?: number;
  tests_passed?: number;
  tests_total?: number;
}

interface ChallengeCardProps {
  challenge: CodingChallenge & { submission?: ChallengeSubmission };
  isCompleted: boolean;
}

const difficultyColors: Record<number, string> = {
  1: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  2: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  3: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  4: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  5: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

const difficultyLabels: Record<number, string> = {
  1: 'Easy',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Expert',
};

export default function ChallengeCard({ challenge, isCompleted }: ChallengeCardProps) {
  const navigate = useNavigate();

  // Progress calculations from submission data
  const submission = challenge.submission;
  const testsPassed = submission?.tests_passed ?? (isCompleted ? 100 : 0);
  const testsTotal = submission?.tests_total ?? 100;
  const progressPercent = testsTotal > 0 ? Math.min(100, Math.round((testsPassed / testsTotal) * 100)) : (isCompleted ? 100 : 0);
  const attempts = submission?.attempts ?? 0;
  const isInProgress = !isCompleted && attempts > 0;

  const handleCardClick = () => {
    // Kapag tapos na (isCompleted), pumunta sa workspace sa View-Only Mode
    if (isCompleted) {
      navigate(`/coding/${challenge.id}?viewOnly=true`);
    } else {
      navigate(`/coding/${challenge.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`relative bg-quest-card border rounded-xl p-5 cursor-pointer transition-all group flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50'
          : isInProgress
          ? 'border-amber-500/30 hover:border-amber-500/50'
          : 'border-quest-border hover:border-quest-primary/40'
      }`}
    >
      {/* Upper Section */}
      <div>
        {/* Status Badge Top Right */}
        {isCompleted ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
            <i className="ri-checkbox-circle-fill text-xs" />
            <span>Completed</span>
          </div>
        ) : isInProgress ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-medium">
            <i className="ri-time-line text-xs" />
            <span>In Progress</span>
          </div>
        ) : null}

        {/* Category & Difficulty Tags */}
        <div className="flex items-center gap-2 mb-3 pr-24">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-quest-primary/10 text-quest-primary border border-quest-primary/20">
            {challenge.category}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
            {difficultyLabels[challenge.difficulty]}
          </span>
        </div>

        {/* Difficulty Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <i
              key={i}
              className={`text-xs ${i < challenge.difficulty ? 'ri-star-fill text-amber-400' : 'ri-star-line text-quest-textDim'}`}
            />
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-quest-text mb-2 group-hover:text-quest-primary transition-colors">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-quest-textMuted leading-relaxed mb-4 line-clamp-2">
          {challenge.description}
        </p>
      </div>

      {/* Progress & Footer Section */}
      <div className="mt-2 pt-3 border-t border-quest-border/50">
        {/* Progress Bar (Visible if completed or in progress) */}
        {(isCompleted || isInProgress) && (
          <div className="mb-3">
            <div className="flex justify-between items-center text-[11px] text-quest-textDim mb-1">
              <span>Test Cases</span>
              <span className={isCompleted ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isCompleted ? '100%' : submission?.tests_passed !== undefined ? `${testsPassed}/${testsTotal}` : `${progressPercent}%`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-quest-bg rounded-full overflow-hidden border border-quest-border/40">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-quest-textDim">
            <span className="flex items-center gap-1">
              <i className="ri-time-line" />
              {challenge.estimated_minutes}m
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-flashlight-line text-quest-gold" />
              {challenge.xp_reward} XP
            </span>
          </div>

          <div className={`flex items-center gap-1 text-xs font-medium ${
            isCompleted 
              ? 'text-emerald-400 font-semibold group-hover:text-emerald-300' 
              : 'text-quest-primary opacity-80 group-hover:opacity-100 transition-opacity'
          }`}>
            <span>{isCompleted ? 'View Solution' : isInProgress ? 'Continue' : 'Solve'}</span>
            <i className="ri-arrow-right-line" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
