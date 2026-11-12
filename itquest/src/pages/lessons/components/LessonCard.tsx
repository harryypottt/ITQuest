import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Lesson } from '@/services/api';
import { isLessonUnlocked } from '@/utils/lessonUtils';

export interface LessonProgress {
  lessonId: string | number;
  isCompleted?: boolean;
}

interface LessonCardProps {
  lesson: Lesson & {
    thumbnail?: string;
    icon?: string;
    orderIndex?: number;
    order_index?: number;
    estimatedMinutes?: number;
    estimated_minutes?: number;
    xpReward?: number;
    xp_reward?: number;
  };
  progress: LessonProgress | null;
  allProgress?: LessonProgress[];
  index: number;
}

export default function LessonCard({ lesson, progress, allProgress = [], index }: LessonCardProps) {
  const isCompleted = progress?.isCompleted ?? false;
  const userProgress = allProgress.length > 0 ? allProgress : (progress ? [progress] : []);
  const isUnlocked = isLessonUnlocked(lesson, userProgress);

  // Normalization ng snake_case vs camelCase mula sa Database
  const orderIndex = lesson.orderIndex ?? lesson.order_index ?? (index + 1);
  const estimatedMinutes = lesson.estimatedMinutes ?? lesson.estimated_minutes ?? 15;
  const xpReward = lesson.xpReward ?? lesson.xp_reward ?? 50;

  const difficulty = lesson.difficulty ? Number(lesson.difficulty) : 1;
  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        group relative rounded-xl border transition-all duration-300 overflow-hidden
        ${isCompleted
          ? 'bg-quest-card border-emerald-500/20'
          : isUnlocked
            ? 'bg-quest-card border-quest-border hover:border-quest-textDim'
            : 'bg-quest-card/50 border-quest-border/50 opacity-60'
        }
      `}
    >
      {!isUnlocked && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center">
            <i className="ri-lock-line text-quest-textDim text-sm" />
          </div>
        </div>
      )}

      {/* Thumbnail */}
      {lesson.thumbnail && (
        <div className="relative w-full h-36 overflow-hidden bg-quest-bg flex-shrink-0">
          <img
            src={lesson.thumbnail}
            alt={lesson.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
          {isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <i className="ri-play-fill text-white text-lg" />
              </div>
            </div>
          )}
          {isCompleted && (
            <div className="absolute top-2 left-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/80 text-white font-medium backdrop-blur-sm">
                Completed
              </span>
            </div>
          )}
        </div>
      )}

      <Link
        to={isUnlocked ? `/lessons/${lesson.id}` : '#'}
        className={`block p-5 ${!isUnlocked ? 'pointer-events-none' : 'cursor-pointer'}`}
        onClick={(e) => { if (!isUnlocked) e.preventDefault(); }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
            ${isCompleted ? 'bg-emerald-500/15 text-emerald-400' : 'bg-quest-bg border border-quest-border text-quest-textDim'}
          `}>
            <i className={`${lesson.icon || 'ri-book-open-line'} text-lg`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isCompleted && !lesson.thumbnail && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                  Completed
                </span>
              )}
              <span className="text-xs text-quest-textDim">
                Lesson {orderIndex}
              </span>
            </div>
            <h3 className={`
              text-sm font-semibold leading-snug line-clamp-2
              ${isCompleted ? 'text-emerald-400' : 'text-quest-text group-hover:text-quest-primary transition-colors'}
            `}>
              {lesson.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-quest-textMuted leading-relaxed line-clamp-2 mb-4">
          {lesson.description || 'No description available.'}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {difficultyStars.map((filled, i) => (
                <i
                  key={i}
                  className={`ri-star-fill text-xs ${filled ? 'text-amber-400' : 'text-quest-textDim'}`}
                />
              ))}
            </div>
            <span className="text-xs text-quest-textDim flex items-center gap-1">
              <i className="ri-time-line" />
              {estimatedMinutes} min
            </span>
          </div>
          <span className="text-xs text-quest-gold font-semibold">+{xpReward} XP</span>
        </div>

        {/* Progress bar for completed */}
        {isCompleted && (
          <div className="mt-3 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>
        )}
      </Link>
    </motion.div>
  );
}