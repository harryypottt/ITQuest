// Central lesson aggregator.
//
// Each specialization's lessons live in their own file so content stays focused
// and easy to maintain. This module combines them into a single `lessons` list
// and re-exports the shared types and progress helpers used across the app.

import { frontendLessons } from './frontendLessonData';
import { backendLessons } from './backendLessonData';
import { fullstackLessons } from './fullstackLessonData';
import { cybersecurityLessons } from './cybersecurityLessonData';
import { databaseLessons } from './databaseLessonData';
import { uiuxLessons } from './uiuxLessonData';

export const lessonCategories = [
  { id: 'frontend', name: 'Frontend Developer', icon: 'ri-layout-4-line', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'backend', name: 'Backend Developer', icon: 'ri-server-line', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'fullstack', name: 'Full Stack Developer', icon: 'ri-stack-line', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: 'ri-shield-check-line', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { id: 'database', name: 'Database Administrator', icon: 'ri-database-2-line', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 'uiux', name: 'UI/UX Designer', icon: 'ri-palette-line', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
];

export const lessons = [
  ...frontendLessons,
  ...backendLessons,
  ...fullstackLessons,
  ...cybersecurityLessons,
  ...databaseLessons,
  ...uiuxLessons,
];

export interface LessonContentBlock {
  type: 'heading' | 'text' | 'code' | 'tip' | 'list' | 'video';
  content?: string;
  language?: string;
  items?: string[];
  videoUrl?: string;
  videoTitle?: string;
}

export interface Lesson {
  id: string;
  thumbnail?: string;
  title: string;
  category: string;
  categoryName: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
  orderIndex: number;
  prerequisites: string[];
  xpReward: number;
  icon: string;
  content: LessonContentBlock[];
}

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
}

export function getLessonProgress(): LessonProgress[] {
  try {
    const saved = localStorage.getItem('itquest_lesson_progress');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveLessonProgress(progress: LessonProgress[]) {
  localStorage.setItem('itquest_lesson_progress', JSON.stringify(progress));
}

export function isLessonUnlocked(lesson: Lesson, progress: LessonProgress[]) {
  if (lesson.prerequisites.length === 0) return true;
  return lesson.prerequisites.every((prereqId) =>
    progress.find((p) => p.lessonId === prereqId && p.isCompleted)
  );
}

export function getNextLesson(currentLesson: Lesson, categoryLessons: Lesson[]) {
  const sorted = categoryLessons.filter((l) => l.category === currentLesson.category).sort((a, b) => a.orderIndex - b.orderIndex);
  const currentIndex = sorted.findIndex((l) => l.id === currentLesson.id);
  if (currentIndex >= 0 && currentIndex < sorted.length - 1) {
    return sorted[currentIndex + 1];
  }
  return null;
}

export function getPreviousLesson(currentLesson: Lesson, categoryLessons: Lesson[]) {
  const sorted = categoryLessons.filter((l) => l.category === currentLesson.category).sort((a, b) => a.orderIndex - b.orderIndex);
  const currentIndex = sorted.findIndex((l) => l.id === currentLesson.id);
  if (currentIndex > 0) {
    return sorted[currentIndex - 1];
  }
  return null;
}