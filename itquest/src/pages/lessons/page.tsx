import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import api, { fetchLessons, fetchUserProgress, Lesson } from '@/services/api';
import CategoryFilter from './components/CategoryFilter';
import ContinueLearningBanner from './components/ContinueLearningBanner';
import ModuleSection, { type LessonModule } from './components/ModuleSection';
import InstructorSection from './components/InstructorSection';
import InstructorFilterBar, { type InstructorOption } from './components/InstructorFilterBar';
import type { LessonProgress } from './components/LessonCard';
import type { InstructorLessonData } from './components/InstructorLessonCard';

const defaultCategories = [
  { id: 'frontend', name: 'Frontend Development', icon: 'ri-layout-4-line', bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
  { id: 'backend', name: 'Backend Development', icon: 'ri-server-line', bg: 'bg-cyan-500/10', color: 'text-cyan-400' },
  { id: 'fullstack', name: 'Fullstack Development', icon: 'ri-stack-line', bg: 'bg-amber-500/10', color: 'text-amber-400' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: 'ri-shield-keyhole-line', bg: 'bg-rose-500/10', color: 'text-rose-400' },
  { id: 'database', name: 'Database & SQL', icon: 'ri-database-2-line', bg: 'bg-violet-500/10', color: 'text-violet-400' },
  { id: 'uiux', name: 'UI/UX Design', icon: 'ri-palette-line', bg: 'bg-fuchsia-500/10', color: 'text-fuchsia-400' },
];

export default function Lessons() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [lessonsList, setLessonsList] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [instructorLessons, setInstructorLessons] = useState<InstructorLessonData[]>([]);
  const [instructorCompleted, setInstructorCompleted] = useState<(string | number)[]>([]);
  const [viewMode, setViewMode] = useState<'curriculum' | 'instructor'>('curriculum');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  // Helper function para malaman kung completed ang isang lesson
const isLessonCompleted = useCallback((lessonId: string | number) => {
  return progress.some(
    (p: any) => String(p.lessonId || p.lesson_id) === String(lessonId) && (p.isCompleted || p.is_completed)
  );
}, [progress]);

// Overall Progress calculation
const completedCount = useMemo(() => {
  return lessonsList.filter((l) => isLessonCompleted(l.id)).length;
}, [lessonsList, isLessonCompleted]);

// Category Progress calculation
const getCategoryProgress = useCallback((categoryKey: string) => {
  const catLessons = lessonsList.filter((l) => l.category === categoryKey);
  if (catLessons.length === 0) return { completed: 0, total: 0 };

  const completed = catLessons.filter((l) => isLessonCompleted(l.id)).length;
  return { completed, total: catLessons.length };
}, [lessonsList, isLessonCompleted]);
  
// Sa loob ng page.tsx useEffect:

// Sa loob ng page.tsx useEffect:

useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [lessonsData, progressData] = await Promise.all([
          fetchLessons(),
          fetchUserProgress(),
        ]);

        const fetchedLessons = Array.isArray(lessonsData) ? lessonsData : lessonsData?.data || [];
        const rawProgress = Array.isArray(progressData) ? progressData : progressData?.data || [];

        // Uniform mapping para kahit snake_case sa DB ay maging malinis at pantay
        const formattedProgress = rawProgress.map((p: any) => ({
          lessonId: String(p.lesson_id || p.lessonId),
          isCompleted: Boolean(p.is_completed ?? p.isCompleted),
        }));

        // Gagamitin dito ang tamang setter function name mo: setLessonsList
        setLessonsList(fetchedLessons);
        setProgress(formattedProgress);
      } catch (err: any) {
        console.error('Failed to load lessons or progress:', err);
        setError('Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const categoryLessons = useMemo(() => {
    let filtered = lessonsList.filter((l) => l.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [lessonsList, activeCategory, searchQuery]);

  const groupedModules = useMemo(() => {
    if (!categoryLessons.length) return [];

    const groupMap = new Map<string, Lesson[]>();
    categoryLessons.forEach((lesson: any) => {
      const moduleName = lesson.moduleTitle || 'Core Lessons';
      if (!groupMap.has(moduleName)) {
        groupMap.set(moduleName, []);
      }
      groupMap.get(moduleName)!.push(lesson);
    });

    let runningIndex = 0;
    const result: { module: LessonModule; lessons: Lesson[]; startIndex: number }[] = [];

    groupMap.forEach((lessonsInMod, title) => {
      const startIndex = runningIndex;
      runningIndex += lessonsInMod.length;

      result.push({
        module: {
          id: title.toLowerCase().replace(/\s+/g, '-'),
          title: title,
          description: `Master ${title} topics`,
        },
        lessons: lessonsInMod,
        startIndex,
      });
    });

    return result;
  }, [categoryLessons]);

  const instructors = useMemo<InstructorOption[]>(() => {
    const map = new Map<string, InstructorOption>();
    instructorLessons.forEach((l) => {
      const key = l.createdBy || 'unknown';
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { id: key, name: l.creatorName || 'Instructor', count: 1 });
      }
    });
    return Array.from(map.values());
  }, [instructorLessons]);

  const activeInstructorName =
    selectedInstructor === 'all'
      ? null
      : instructors.find((i) => i.id === selectedInstructor)?.name || null;

  const filteredInstructorLessons = useMemo(() => {
    let list = instructorLessons;
    if (selectedInstructor !== 'all') {
      list = list.filter((l) => l.createdBy === selectedInstructor);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.topic?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [instructorLessons, selectedInstructor, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    defaultCategories.forEach((cat) => {
      const catLessons = lessonsList.filter((l) => l.category === cat.id);
      counts[cat.id] = {
        total: catLessons.length,
        completed: catLessons.filter((l) =>
          progress.some((p) => String(p.lessonId) === String(l.id) && p.isCompleted)
        ).length,
      };
    });
    return counts;
  }, [lessonsList, progress]);

  const totalLessons = lessonsList.length;
  const totalCompleted = progress.filter((p) => p.isCompleted).length;
  const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <i className="ri-book-open-line text-xl text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-quest-text">Lessons</h1>
              <p className="text-xs text-quest-textMuted">Master new skills through structured learning paths</p>
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-quest-primary">
            <i className="ri-loader-4-line animate-spin text-4xl mr-3" />
            <span className="text-lg font-semibold">Loading lessons from database...</span>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
            <i className="ri-error-warning-line text-xl" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {viewMode === 'curriculum' && (
              <ContinueLearningBanner
                lessons={lessonsList}
                progress={progress}
                onCategorySwitch={setActiveCategory}
              />
            )}

            {viewMode === 'curriculum' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-4 rounded-xl bg-quest-card border border-quest-border mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-quest-text">Overall Progress</span>
                  <span className="text-xs text-quest-primary font-semibold">
                    {totalCompleted} / {totalLessons} lessons ({overallProgress}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-quest-bg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mb-6 space-y-4"
            >
              <div className="relative max-w-md">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-quest-textDim text-sm" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-quest-card border border-quest-border text-sm text-quest-text placeholder:text-quest-textDim focus:outline-none focus:border-quest-primary/50 focus:ring-1 focus:ring-quest-primary/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-quest-textDim hover:text-quest-text transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>

              {viewMode === 'curriculum' ? (
                <CategoryFilter
                  categories={defaultCategories}
                  activeCategory={activeCategory}
                  onSelect={setActiveCategory}
                  counts={categoryCounts}
                  instructorCount={instructorLessons.length}
                  onOpenInstructor={() => setViewMode('instructor')}
                />
              ) : (
                <InstructorFilterBar
                  instructors={instructors}
                  selectedInstructor={selectedInstructor}
                  onSelectInstructor={setSelectedInstructor}
                  onBack={() => setViewMode('curriculum')}
                  totalCount={instructorLessons.length}
                />
              )}
            </motion.div>

            {viewMode === 'instructor' ? (
              filteredInstructorLessons.length === 0 ? (
                <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
                  <div className="w-14 h-14 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-star-line text-2xl text-quest-textDim" />
                  </div>
                  <h3 className="text-lg font-semibold text-quest-text mb-1">No instructor lessons found</h3>
                  <p className="text-sm text-quest-textMuted">Try another instructor or clear your search.</p>
                </div>
              ) : (
                <InstructorSection
                  lessons={filteredInstructorLessons}
                  completedIds={instructorCompleted}
                  headingText={activeInstructorName ? `${activeInstructorName}'s Lessons` : 'From Your Instructor'}
                  headingSubtext={
                    activeInstructorName
                      ? 'Published lessons by this instructor across all tracks'
                      : 'Lessons created and published by your teachers'
                  }
                />
              )
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory + searchQuery}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {categoryLessons.length === 0 ? (
                      <div className="p-12 rounded-xl bg-quest-card border border-quest-border text-center">
                        <div className="w-14 h-14 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
                          <i className="ri-search-line text-2xl text-quest-textDim" />
                        </div>
                        <h3 className="text-lg font-semibold text-quest-text mb-1">No lessons found</h3>
                        <p className="text-sm text-quest-textMuted">Try a different search term or category filter.</p>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        {groupedModules.map((group, idx) => (
                          <ModuleSection
                            key={group.module.id || idx}
                            module={group.module}
                            moduleNumber={idx + 1}
                            lessons={group.lessons}
                            progress={progress}
                            startIndex={group.startIndex}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <InstructorSection
                  lessons={filteredInstructorLessons}
                  completedIds={instructorCompleted}
                />
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}