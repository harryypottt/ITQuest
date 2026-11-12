// src/pages/lessons/components/InstructorSection.tsx

import { motion } from 'framer-motion';
import InstructorLessonCard, { type InstructorLessonData } from './InstructorLessonCard';

interface InstructorSectionProps {
  lessons: InstructorLessonData[];
  completedIds: (string | number)[];
  headingText?: string;
  headingSubtext?: string;
}

export default function InstructorSection({
  lessons = [],
  completedIds = [],
  headingText = 'From Your Instructor',
  headingSubtext = 'Lessons created and published by your teachers',
}: InstructorSectionProps) {
  if (lessons.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-12"
    >
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border bg-amber-500/15 border-amber-500/30 text-amber-400">
            <i className="ri-user-star-line" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-quest-text flex items-center gap-2">
              {headingText}
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
                {lessons.length}
              </span>
            </h2>
            <p className="text-xs text-quest-textDim">
              {headingSubtext}
            </p>
          </div>
        </div>
      </div>

      {/* Instructor lessons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson, idx) => (
          <InstructorLessonCard
            key={lesson.id}
            lesson={lesson}
            index={idx}
            isCompleted={completedIds.some((id) => String(id) === String(lesson.id))}
          />
        ))}
      </div>
    </motion.section>
  );
}