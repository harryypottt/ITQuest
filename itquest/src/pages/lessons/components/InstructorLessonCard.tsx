// src/pages/lessons/components/InstructorLessonCard.tsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface InstructorLessonData {
  id: string | number;
  title: string;
  description?: string;
  topic?: string;
  difficulty?: number;
  estimatedMinutes?: number;
  xpReward?: number;
  creatorName?: string;
  createdBy?: string;
}

interface InstructorLessonCardProps {
  lesson: InstructorLessonData;
  index: number;
  isCompleted: boolean;
}

export default function InstructorLessonCard({ lesson, index, isCompleted }: InstructorLessonCardProps) {
  const difficulty = lesson.difficulty || 1;
  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`group relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isCompleted
          ? 'bg-quest-card border-amber-500/30'
          : 'bg-quest-card border-quest-border hover:border-amber-500/40'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20">
          <i className="ri-user-star-line" />
          Instructor
        </span>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
            <i className="ri-check-line" />
            Completed
          </span>
        )}
      </div>

      <Link to={`/lessons/instructor/${lesson.id}`} className="block p-5 cursor-pointer">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <i className="ri-book-2-line text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-quest-textDim">{lesson.topic || 'General'}</span>
            <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-quest-text group-hover:text-amber-400 transition-colors">
              {lesson.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-quest-textMuted leading-relaxed line-clamp-2 mb-4">
          {lesson.description || 'No description available.'}
        </p>

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
              {lesson.estimatedMinutes || 15} min
            </span>
          </div>
          <span className="text-xs text-quest-gold font-semibold">+{lesson.xpReward || 50} XP</span>
        </div>

        <div className="mt-4 pt-3 border-t border-quest-border flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-quest-bg border border-quest-border flex items-center justify-center flex-shrink-0">
            <i className="ri-user-line text-quest-textDim text-xs" />
          </div>
          <span className="text-xs text-quest-textMuted truncate">By {lesson.creatorName || 'Instructor'}</span>
        </div>
      </Link>
    </motion.div>
  );
}