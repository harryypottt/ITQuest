// src/pages/lessons/LessonViewer.tsx

import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import {
  fetchLessons,
  fetchLessonById,
  completeLesson,
  fetchUserProgress,
} from "@/services/api";
import LessonContent, {
  type LessonContentBlock,
} from "./components/LessonContent";
import LessonSidebar, { type LessonProgress } from "./components/LessonSidebar";

const lessonCategories = [
  {
    id: "frontend",
    name: "Frontend Development",
    icon: "ri-layout-line",
    color: "text-sky-400",
    bg: "bg-sky-500/15",
  },
  {
    id: "backend",
    name: "Backend Development",
    icon: "ri-server-line",
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
  },
  {
    id: "database",
    name: "Database Management",
    icon: "ri-database-2-line",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    id: "devops",
    name: "DevOps & Deployment",
    icon: "ri-cloud-line",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
];

function extractSections(
  blocks: LessonContentBlock[],
): { index: number; title: string }[] {
  const sections: { index: number; title: string }[] = [];
  if (!Array.isArray(blocks)) return sections;

  blocks.forEach((block, idx) => {
    if (block.type === "heading" && block.content) {
      sections.push({ index: idx, title: block.content });
    }
  });
  return sections;
}

export default function LessonViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams(); // <-- Dagdag ito
  const questId = searchParams.get("questId");

  // 1. ALL STATES AT THE TOP
  const [lesson, setLesson] = useState<any | null>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gainedXPAwarded, setGainedXPAwarded] = useState<number>(0);
  const [activeSection, setActiveSection] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  // 2. FETCH DATA EFFECT
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      setShowCompletion(false);
      try {
        const [singleData, listData, progressData] = await Promise.all([
          fetchLessonById(id),
          fetchLessons(),
          fetchUserProgress(),
        ]);

        const lessonObj = singleData?.data || singleData?.lesson || singleData;
        const listArr = Array.isArray(listData)
          ? listData
          : listData?.data || listData?.lessons || [];
        const rawProgress = Array.isArray(progressData)
          ? progressData
          : progressData?.data || [];

        const formattedProgress: LessonProgress[] = rawProgress.map(
          (p: any) => ({
            lessonId: String(p.lessonId || p.lesson_id),
            isCompleted: Boolean(p.isCompleted || p.is_completed),
            completedAt: p.completedAt || p.completed_at,
          }),
        );

        setLesson(lessonObj);
        setAllLessons(listArr);
        setProgress(formattedProgress);
      } catch (err) {
        console.error("Failed to load lesson from database:", err);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    setActiveSection(0);
    setReadingProgress(0);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [id]);

  // 3. ALL MEMOS AND CALLBACKS
  const contentBlocks: LessonContentBlock[] = useMemo(() => {
    if (!lesson?.content) return [];
    if (typeof lesson.content === "string") {
      try {
        return JSON.parse(lesson.content);
      } catch {
        return [{ type: "text", content: lesson.content }];
      }
    }
    return Array.isArray(lesson.content) ? lesson.content : [];
  }, [lesson]);

  const sections = useMemo(() => {
    return extractSections(contentBlocks);
  }, [contentBlocks]);

  const isUnlocked = useMemo(() => {
    if (!lesson) return false;

    let prereqs = lesson.prerequisites;
    if (typeof prereqs === "string") {
      try {
        prereqs = JSON.parse(prereqs);
      } catch {
        prereqs = [];
      }
    }

    if (!Array.isArray(prereqs) || prereqs.length === 0) return true;

    return prereqs.every((prereqId: any) =>
      progress.some(
        (p: any) =>
          String(p.lessonId || p.lesson_id) === String(prereqId) &&
          (p.isCompleted || p.is_completed),
      ),
    );
  }, [lesson, progress]);

  const categoryLessons = useMemo(() => {
    if (!lesson) return [];
    return allLessons
      .filter((l) => l.category === lesson.category)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [lesson, allLessons]);

  const currentIndex = categoryLessons.findIndex(
    (l) => String(l.id) === String(lesson?.id),
  );
  const prevLesson =
    currentIndex > 0 ? categoryLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < categoryLessons.length - 1
      ? categoryLessons[currentIndex + 1]
      : null;

  const currentProgress = progress.find(
    (p) => String(p.lessonId) === String(id),
  );
  const isCompleted = currentProgress?.isCompleted ?? false;

  const handleSectionClick = useCallback((sectionIndex: number) => {
    const el = document.getElementById(`section-${sectionIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionIndex);
    }
  }, []);

  const handleComplete = useCallback(async () => {
    if (!lesson || isCompleted) return;

    try {
      const res = await completeLesson(lesson.id);

      if (res?.success) {
        const newProgress = progress.filter(
          (p) => String(p.lessonId) !== String(lesson.id),
        );
        newProgress.push({
          lessonId: String(lesson.id),
          isCompleted: true,
          completedAt: new Date().toISOString(),
        });

        setProgress([...newProgress]);
        setGainedXPAwarded(
          res.gainedXP || lesson.xpReward || lesson.xp_reward || 50,
        );
        setShowCompletion(true);
      }
    } catch (err) {
      console.error("Failed to mark lesson as complete:", err);
      alert("May error sa pag-save ng progress sa database.");
    }
  }, [lesson, progress, isCompleted]);

  const handleNext = useCallback(() => {
    if (nextLesson) {
      setShowCompletion(false);
      navigate(`/lessons/${nextLesson.id}`);
    }
  }, [nextLesson, navigate]);

  // SCROLL TRACKING EFFECT
  useEffect(() => {
    if (!lesson || sections.length === 0) return;

    const handleScroll = () => {
      const mainContent = document.getElementById("lesson-main-content");
      if (!mainContent) return;

      const rect = mainContent.getBoundingClientRect();
      const contentTop = -rect.top;
      const contentHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = contentHeight - viewportHeight;

      if (scrollableHeight <= 0) {
        setReadingProgress(100);
        return;
      }

      const progressPct = Math.min(
        100,
        Math.max(0, Math.round((contentTop / scrollableHeight) * 100)),
      );
      setReadingProgress(progressPct);

      const headingElements = sections
        .map((s) => document.getElementById(`section-${s.index}`))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      let currentActive = 0;
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.getBoundingClientRect().top <= 120) {
          currentActive = sections[i].index;
          break;
        }
      }
      setActiveSection(currentActive);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lesson, sections]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 text-quest-textMuted">
            <i className="ri-loader-4-line animate-spin text-2xl text-quest-primary" />
            <span>Loading lesson data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-quest-bg border border-quest-border flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-3xl text-quest-textDim" />
            </div>
            <h2 className="text-xl font-bold text-quest-text mb-2">
              Lesson Not Found
            </h2>
            <p className="text-sm text-quest-textMuted mb-4">
              The lesson you are looking for does not exist in the database.
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

  if (!isUnlocked) {
    let prereqs = lesson.prerequisites;
    if (typeof prereqs === "string") {
      try {
        prereqs = JSON.parse(prereqs);
      } catch {
        prereqs = [];
      }
    }

    const prereqLessons = Array.isArray(prereqs)
      ? prereqs
          .map((pid: any) =>
            allLessons.find((l) => String(l.id) === String(pid)),
          )
          .filter(Boolean)
      : [];

    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-quest-bg border-2 border-quest-border flex items-center justify-center mx-auto mb-6">
              <i className="ri-lock-line text-4xl text-quest-textDim" />
            </div>
            <h2 className="text-2xl font-bold text-quest-text mb-3">
              Lesson Locked
            </h2>
            <p className="text-sm text-quest-textMuted mb-6 max-w-md mx-auto">
              Complete the following prerequisite lessons to unlock{" "}
              <strong className="text-quest-primary">{lesson.title}</strong>:
            </p>
            <div className="space-y-2 mb-6">
              {prereqLessons.map((prereq: any) => {
                const prereqDone = progress.some(
                  (p: any) =>
                    String(p.lessonId || p.lesson_id) === String(prereq.id) &&
                    (p.isCompleted || p.is_completed),
                );
                return (
                  <Link
                    key={prereq.id}
                    to={`/lessons/${prereq.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      prereqDone
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-quest-card border-quest-border"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        prereqDone
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-quest-bg border border-quest-border text-quest-textDim"
                      }`}
                    >
                      <i
                        className={`${prereqDone ? "ri-check-line" : "ri-book-open-line"} text-sm`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${prereqDone ? "text-emerald-400" : "text-quest-text"}`}
                    >
                      {prereq.title}
                    </span>
                    {prereqDone && (
                      <span className="text-xs text-emerald-400 ml-auto">
                        Completed
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
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

  const categoryInfo = lessonCategories.find((c) => c.id === lesson.category);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0" id="lesson-main-content">
            <div className="flex items-center gap-2 text-xs text-quest-textDim mb-4 flex-wrap">
              <Link
                to="/lessons"
                className="hover:text-quest-primary transition-colors cursor-pointer"
              >
                Lessons
              </Link>
              <i className="ri-arrow-right-s-line" />
              <Link
                to={`/lessons?category=${lesson.category}`}
                className="hover:text-quest-primary transition-colors cursor-pointer"
              >
                {lesson.categoryName || categoryInfo?.name || lesson.category}
              </Link>
              <i className="ri-arrow-right-s-line" />
              <span className="text-quest-textMuted">{lesson.title}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {categoryInfo && (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-lg ${categoryInfo.bg} flex items-center justify-center`}
                  >
                    <i
                      className={`${categoryInfo.icon} ${categoryInfo.color} text-sm`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${categoryInfo.color}`}>
                    {categoryInfo.name}
                  </span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-quest-text mb-2">
                {lesson.title}
              </h1>
              <p className="text-sm text-quest-textMuted leading-relaxed mb-4">
                {lesson.description}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`ri-star-fill text-xs ${i < (lesson.difficulty || 1) ? "text-amber-400" : "text-quest-textDim"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-quest-textDim flex items-center gap-1">
                  <i className="ri-time-line" />
                  {lesson.estimatedMinutes || 15} min read
                </span>
                <span className="text-xs text-quest-gold font-semibold">
                  +{lesson.xpReward || lesson.xp_reward || 50} XP
                </span>
                {contentBlocks.some((b) => b.type === "video") && (
                  <span className="text-xs text-quest-textDim flex items-center gap-1">
                    <i className="ri-play-circle-line" />
                    Includes video
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium flex items-center gap-1">
                    <i className="ri-check-line" />
                    Completed
                  </span>
                )}
              </div>
            </motion.div>

            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 md:p-8 rounded-xl bg-quest-card border border-quest-border"
            >
              <LessonContent blocks={contentBlocks} />

              <div className="mt-8 pt-6 border-t border-quest-border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    {prevLesson && (
                      <Link
                        to={`/lessons/${prevLesson.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-textMuted hover:text-quest-text hover:border-quest-textDim transition-all cursor-pointer"
                      >
                        <i className="ri-arrow-left-line" />
                        Previous
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!isCompleted ? (
                      <button
                        onClick={handleComplete}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-check-double-line" />
                        Mark as Complete
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                        <i className="ri-check-double-line" />
                        Lesson completed
                        {currentProgress?.completedAt && (
                          <span className="text-quest-textDim">
                            on{" "}
                            {new Date(
                              currentProgress.completedAt,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    )}

                    {nextLesson && (
                      <Link
                        to={`/lessons/${nextLesson.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-quest-bg border border-quest-border text-sm text-quest-textMuted hover:text-quest-text hover:border-quest-textDim transition-all cursor-pointer"
                      >
                        Next
                        <i className="ri-arrow-right-line" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-64 flex-shrink-0">
            <LessonSidebar
              sections={sections}
              activeSection={activeSection}
              categoryLessons={categoryLessons}
              currentLessonId={lesson.id}
              progress={progress}
              readingProgress={readingProgress}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>
      </div>

      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm w-full p-6 rounded-2xl bg-quest-card border border-emerald-500/20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4"
            >
              <i className="ri-check-double-line text-3xl text-emerald-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-quest-text mb-2">
              Lesson Complete!
            </h3>
            <p className="text-sm text-quest-textMuted mb-1">
              You just finished{" "}
              <strong className="text-quest-text">{lesson.title}</strong>
            </p>
            <p className="text-sm text-emerald-400 font-semibold mb-5">
              +{gainedXPAwarded} XP Earned
            </p>

            {nextLesson && (
              <div className="mb-4 p-3 rounded-lg bg-quest-bg border border-quest-border text-left">
                <span className="text-xs text-quest-textDim">
                  Next Lesson Unlocked:
                </span>
                <p className="text-sm font-semibold text-quest-text mt-0.5">
                  {nextLesson.title}
                </p>
              </div>
            )}

            {/* 🌟 ACTION BUTTONS (Kasama na ang Quests button) */}
            <div className="grid grid-cols-3 gap-2">
              <Link
                to={questId ? `/quests?openQuest=${questId}` : "/quests"}
                className="px-3 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => setShowCompletion(false)}
              >
                <i className="ri-sword-line" />
                Quests
              </Link>

              <Link
                to="/lessons"
                className="px-3 py-2.5 rounded-xl border border-quest-border bg-quest-bg text-quest-textMuted hover:text-quest-text text-xs font-semibold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => setShowCompletion(false)}
              >
                <i className="ri-book-open-line" />
                Lessons
              </Link>

              {nextLesson ? (
                <button
                  onClick={handleNext}
                  className="px-3 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                >
                  Next
                  <i className="ri-arrow-right-line" />
                </button>
              ) : (
                <button
                  onClick={() => setShowCompletion(false)}
                  className="px-3 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
