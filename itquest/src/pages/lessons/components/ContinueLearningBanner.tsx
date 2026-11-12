import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Lesson } from '@/services/api';

export interface UserProgress {
  lessonId: string | number;
  isCompleted?: boolean;
}

interface ContinueLearningBannerProps {
  lessons: Lesson[];
  progress: UserProgress[];
  onCategorySwitch: (category: string) => void;
}

export default function ContinueLearningBanner({
  lessons = [],
  progress = [],
  onCategorySwitch,
}: ContinueLearningBannerProps) {
  const nextLesson = (() => {
    if (!lessons.length) return null;

    const sorted = [...lessons].sort((a: any, b: any) => {
      const catOrder = ['frontend', 'backend', 'fullstack', 'cybersecurity', 'database', 'uiux'];
      const catDiff = catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
      if (catDiff !== 0) return catDiff;
      return (a.orderIndex || 0) - (b.orderIndex || 0);
    });

    const startedCategories = new Set(
      progress
        .filter((p) => p.isCompleted)
        .map((p) => {
          const l = lessons.find((ls: any) => String(ls.id) === String(p.lessonId));
          return (l as any)?.category ?? '';
        })
    );

    for (const lesson of sorted as any[]) {
      if (!startedCategories.has(lesson.category)) continue;
      const prog = progress.find((p) => String(p.lessonId) === String(lesson.id));
      if (!prog?.isCompleted) return lesson;
    }

    for (const lesson of sorted as any[]) {
      const prog = progress.find((p) => String(p.lessonId) === String(lesson.id));
      if (!prog?.isCompleted) return lesson;
    }

    return null;
  })();

  if (!nextLesson) return null;

  const categoryColorMap: Record<string, { accent: string; bg: string; icon: string }> = {
    frontend:      { accent: 'from-emerald-500 to-cyan-500',  bg: 'bg-emerald-500/10', icon: 'text-emerald-400' },
    backend:       { accent: 'from-cyan-500 to-blue-500',     bg: 'bg-cyan-500/10',    icon: 'text-cyan-400' },
    fullstack:     { accent: 'from-amber-500 to-orange-500',  bg: 'bg-amber-500/10',   icon: 'text-amber-400' },
    cybersecurity: { accent: 'from-rose-500 to-pink-500',     bg: 'bg-rose-500/10',    icon: 'text-rose-400' },
    database:      { accent: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10',  icon: 'text-violet-400' },
    uiux:          { accent: 'from-fuchsia-500 to-pink-500',  bg: 'bg-fuchsia-500/10', icon: 'text-fuchsia-400' },
  };

  const catStyle = categoryColorMap[nextLesson.category] ?? categoryColorMap.frontend;
  const dotColor = catStyle.accent.split(' ')[0].replace('from-', 'bg-');

  const completedInCat = progress.filter((p) => {
    const l = lessons.find((ls: any) => String(ls.id) === String(p.lessonId));
    return (l as any)?.category === nextLesson.category && p.isCompleted;
  }).length;
  
  const totalInCat = lessons.filter((l: any) => l.category === nextLesson.category).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-1.5 h-4 rounded-full bg-gradient-to-b ${catStyle.accent}`} />
        <span className="text-xs font-semibold text-quest-textMuted uppercase tracking-widest">
          Continue Learning
        </span>
      </div>

      <Link
        to={`/lessons/${nextLesson.id}`}
        onClick={() => onCategorySwitch(nextLesson.category)}
        className="group block rounded-2xl border border-quest-border bg-quest-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-quest-textDim"
      >
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${dotColor}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
              </span>
              <span className="text-xs text-quest-textMuted font-medium">Next up</span>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${catStyle.bg} ${catStyle.icon}`}>
              <i className="ri-bookmark-3-line" />
              {nextLesson.categoryName || nextLesson.category}
              <span className="opacity-50">•</span>
              Lesson {nextLesson.orderIndex || 1}
            </span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-quest-text leading-snug mb-1.5 group-hover:text-quest-primary transition-colors line-clamp-2">
            {nextLesson.title}
          </h2>
          <p className="text-sm text-quest-textMuted leading-relaxed line-clamp-2 mb-4">
            {nextLesson.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-quest-textDim">
              <i className="ri-time-line" />
              <span>{nextLesson.estimatedMinutes || 15} min</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <i
                  key={i}
                  className={`ri-star-fill text-xs ${i < (nextLesson.difficulty || 1) ? 'text-amber-400' : 'text-quest-textDim'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-quest-gold font-semibold">
              <i className="ri-sparkling-2-line" />
              <span>+{nextLesson.xpReward || 50} XP</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-quest-textDim">
                  {nextLesson.categoryName || nextLesson.category} progress
                </span>
                <span className="text-xs font-semibold text-quest-textMuted">
                  {completedInCat}/{totalInCat}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalInCat > 0 ? (completedInCat / totalInCat) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${catStyle.accent}`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r ${catStyle.accent}
                transition-all duration-300 group-hover:shadow-lg group-hover:shadow-current/20
              `}>
                <i className="ri-play-fill" />
                Start Lesson
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}