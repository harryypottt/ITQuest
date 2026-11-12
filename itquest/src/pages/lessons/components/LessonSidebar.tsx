// src/pages/lessons/components/LessonSidebar.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Lesson } from '@/services/api';
import { isLessonUnlocked } from '@/utils/lessonUtils';

export interface LessonProgress {
  lessonId: string | number;
  isCompleted?: boolean;
  completedAt?: string;
}

interface TocSection {
  index: number;
  title: string;
}

interface LessonSidebarProps {
  sections: TocSection[];
  activeSection: number;
  categoryLessons: Lesson[];
  currentLessonId: string | number;
  progress: LessonProgress[];
  readingProgress: number;
  onSectionClick: (index: number) => void;
}

export default function LessonSidebar({
  sections = [],
  activeSection,
  categoryLessons = [],
  currentLessonId,
  progress = [],
  readingProgress = 0,
  onSectionClick,
}: LessonSidebarProps) {
  return (
    <div className="lg:sticky lg:top-20 space-y-4">
      <div className="p-4 rounded-xl bg-quest-card border border-quest-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-quest-text flex items-center gap-1.5">
            <i className="ri-article-line text-quest-primary" />
            Reading Progress
          </span>
          <span className="text-xs font-semibold text-quest-primary tabular-nums">{readingProgress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-quest-bg overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {sections.length > 0 && (
        <div className="p-4 rounded-xl bg-quest-card border border-quest-border">
          <h4 className="text-xs font-semibold text-quest-text mb-3 flex items-center gap-2 uppercase tracking-wider">
            <i className="ri-list-unordered text-quest-primary" />
            Table of Contents
          </h4>
          <nav className="space-y-0.5">
            {sections.map((section) => {
              const isActive = section.index === activeSection;
              return (
                <button
                  key={section.index}
                  onClick={() => onSectionClick(section.index)}
                  className={`
                    w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap
                    flex items-center gap-2
                    ${isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium'
                      : 'text-quest-textMuted hover:text-quest-text hover:bg-quest-bg'
                    }
                  `}
                >
                  <span className={`
                    w-1.5 h-1.5 rounded-full flex-shrink-0
                    ${isActive ? 'bg-emerald-400 scale-125' : 'bg-quest-textDim'}
                    transition-all duration-200
                  `} />
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <div className="p-4 rounded-xl bg-quest-card border border-quest-border">
        <h4 className="text-xs font-semibold text-quest-text mb-3 flex items-center gap-2 uppercase tracking-wider">
          <i className="ri-book-open-line text-quest-primary" />
          Course Lessons
        </h4>
        <div className="space-y-1">
          {categoryLessons.map((cl) => {
            const clProgress = progress.find((p) => String(p.lessonId) === String(cl.id));
            const clCompleted = clProgress?.isCompleted ?? false;
            const clUnlocked = isLessonUnlocked(cl, progress);
            const isCurrent = String(cl.id) === String(currentLessonId);

            return (
              <Link
                key={cl.id}
                to={clUnlocked ? `/lessons/${cl.id}` : '#'}
                onClick={(e) => {
                  if (!clUnlocked) e.preventDefault();
                }}
                className={`
                  flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all
                  ${isCurrent
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : clCompleted
                      ? 'bg-quest-bg text-emerald-400'
                      : clUnlocked
                        ? 'text-quest-textMuted hover:text-quest-text hover:bg-quest-bg'
                        : 'text-quest-textDim opacity-50'
                  }
                  ${!clUnlocked ? 'pointer-events-none' : 'cursor-pointer'}
                `}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  clCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                  isCurrent ? 'text-emerald-400' : 'text-quest-textDim'
                }`}>
                  {clCompleted ? (
                    <i className="ri-check-fill text-xs" />
                  ) : clUnlocked ? (
                    <i className={`ri-circle-fill text-[8px] ${isCurrent ? 'text-emerald-400' : 'text-quest-textDim'}`} />
                  ) : (
                    <i className="ri-lock-line text-[10px]" />
                  )}
                </div>
                <span className="truncate">{cl.title}</span>
                {clCompleted && (
                  <span className="ml-auto text-emerald-400 flex-shrink-0">
                    <i className="ri-check-fill text-xs" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}