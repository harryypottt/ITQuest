import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  getFacultyLessonById,
  getFacultyLessonProgress,
  completeFacultyLesson,
} from '@/sampleData/facultyContentData';
import type { FacultyLesson } from '@/sampleData/facultyContentData';
import type { LessonContentBlock } from '@/sampleData/lessonData';
import LessonContent from './components/LessonContent';

function buildBlocks(lesson: FacultyLesson): LessonContentBlock[] {
  const blocks: any[] = [];
  lesson.sections.forEach((section) => {
    blocks.push({ type: 'heading', content: section.title });
    if (section.contentType === 'code') {
      blocks.push({ type: 'code', language: section.language || 'javascript', content: section.content });
    } else if (section.contentType === 'tip') {
      blocks.push({ type: 'tip', content: section.content });
    } else if (section.contentType === 'video') {
      blocks.push({ type: 'video', videoUrl: section.content });
    } else {
      blocks.push({ type: 'text', content: section.content });
    }
  });
  return blocks as LessonContentBlock[];
}

export default function InstructorLessonViewer() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<FacultyLesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const found = id ? getFacultyLessonById(id) : undefined;
    setLesson(found && found.status === 'published' ? found : null);

    const progress = getFacultyLessonProgress();
    setIsCompleted(progress.some((p: any) => p.lessonId === id && p.isCompleted));

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  const blocks = useMemo(() => (lesson ? buildBlocks(lesson) : []), [lesson]);

  const handleComplete = () => {
    if (!lesson || isCompleted) return;
    completeFacultyLesson(lesson.id);
    setIsCompleted(true);
  };

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-3xl text-quest-textDim" />
            </div>
            <h2 className="text-xl font-bold text-quest-text mb-2">Lesson Not Found</h2>
            <p className="text-sm text-quest-textMuted mb-4">
              This instructor lesson does not exist or is not published yet.
            </p>
            <Link
              to="/lessons"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-text hover:border-quest-textDim transition-all cursor-pointer"
            >
              <i className="ri-arrow-left-line" />
              Back to Lessons
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-quest-textDim mb-4 flex-wrap">
            <Link to="/lessons" className="hover:text-quest-primary transition-colors cursor-pointer">
              Lessons
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-quest-textMuted">From Your Instructor</span>
            <i className="ri-arrow-right-s-line" />
            <span className="text-quest-textMuted">{lesson.title}</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20">
                <i className="ri-user-star-line" />
                Instructor Lesson
              </span>
              <span className="text-xs text-quest-textDim">{lesson.topic}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-quest-text mb-2">{lesson.title}</h1>
            <p className="text-sm text-quest-textMuted leading-relaxed mb-4">{lesson.description}</p>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={`ri-star-fill text-xs ${i < lesson.difficulty ? 'text-amber-400' : 'text-quest-textDim'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-quest-textDim flex items-center gap-1">
                <i className="ri-time-line" />
                {lesson.estimatedMinutes} min read
              </span>
              <span className="text-xs text-quest-gold font-semibold">+{lesson.xpReward} XP</span>
              <span className="text-xs text-quest-textMuted flex items-center gap-1">
                <i className="ri-user-line" />
                By {lesson.creatorName}
              </span>
              {isCompleted && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium flex items-center gap-1">
                  <i className="ri-check-line" />
                  Completed
                </span>
              )}
            </div>
          </motion.div>

          {/* Learning objectives */}
          {lesson.learningObjectives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/15 mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <i className="ri-flag-line text-amber-400 text-sm" />
                </div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  What You&apos;ll Learn
                </span>
              </div>
              <ul className="space-y-2">
                {lesson.learningObjectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-quest-textMuted leading-relaxed">
                    <i className="ri-checkbox-circle-line text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Lesson content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 md:p-8 rounded-xl bg-quest-card border border-quest-border"
          >
            {blocks.length > 0 ? (
              <LessonContent blocks={blocks} />
            ) : (
              <p className="text-sm text-quest-textMuted">No content has been added to this lesson yet.</p>
            )}

            {/* Complete action */}
            <div className="mt-8 pt-6 border-t border-quest-border flex items-center justify-between flex-wrap gap-4">
              <Link
                to="/lessons"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-textMuted hover:text-quest-text hover:border-quest-textDim transition-all cursor-pointer"
              >
                <i className="ri-arrow-left-line" />
                All Lessons
              </Link>

              {!isCompleted ? (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-sm font-semibold text-amber-400 hover:bg-amber-500/25 hover:border-amber-500/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-check-double-line" />
                  Mark as Complete
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <i className="ri-check-double-line" />
                  Lesson completed
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}