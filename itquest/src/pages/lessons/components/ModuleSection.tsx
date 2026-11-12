import { motion } from 'framer-motion';
import type { Lesson } from '@/services/api';
import LessonCard, { type LessonProgress } from './LessonCard';

export interface LessonModule {
  id?: string | number;
  title: string;
  description?: string;
}

interface ModuleSectionProps {
  module: LessonModule;
  moduleNumber: number;
  lessons: (Lesson & { thumbnail?: string })[];
  progress: LessonProgress[];
  startIndex: number;
}

export default function ModuleSection({
  module,
  moduleNumber,
  lessons = [],
  progress = [],
  startIndex,
}: ModuleSectionProps) {
  const completedCount = lessons.filter((l) =>
    progress.some((p) => String(p.lessonId) === String(l.id) && p.isCompleted)
  ).length;
  
  const total = lessons.length;
  const moduleProgress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const isModuleComplete = total > 0 && completedCount === total;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: moduleNumber * 0.05 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border
              ${isModuleComplete
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-quest-bg border-quest-border text-quest-textDim'
              }
            `}
          >
            {isModuleComplete ? (
              <i className="ri-check-line text-base" />
            ) : (
              <span className="text-xs font-bold">{String(moduleNumber).padStart(2, '0')}</span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-quest-text truncate">{module.title}</h2>
            <p className="text-xs text-quest-textDim truncate">{module.description || ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-52">
          <div className="flex-1 h-1.5 rounded-full bg-quest-bg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${moduleProgress}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`h-full rounded-full ${isModuleComplete ? 'bg-emerald-500' : 'bg-emerald-500/70'}`}
            />
          </div>
          <span className="text-xs font-medium text-quest-textMuted whitespace-nowrap">
            {completedCount}/{total}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson, idx) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={progress.find((p) => String(p.lessonId) === String(lesson.id)) || null}
            allProgress={progress}
            index={startIndex + idx}
          />
        ))}
      </div>
    </motion.section>
  );
}