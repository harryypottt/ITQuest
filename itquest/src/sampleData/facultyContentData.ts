// ============================================================
// Faculty Content Data Layer — Lessons, Quizzes, Quests
// ============================================================

// ─── Types ───

export type FacultyLessonSection = {
  id: string;
  title: string;
  contentType: 'text' | 'video' | 'image' | 'code' | 'tip';
  content: string;
  language?: string; // for code blocks
};

export type FacultyLesson = {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: number;
  estimatedMinutes: number;
  contentType: 'structured' | 'file';
  sections: FacultyLessonSection[];
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  learningObjectives: string[];
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  source: 'faculty';
  xpReward: number;
};

export type FacultyQuizQuestion = {
  id: string;
  type: 'mcq';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
};

export type FacultyQuiz = {
  id: string;
  title: string;
  description: string;
  topic: string;
  passingScore: number;
  timeLimit: number;
  attemptsAllowed: number;
  questions: FacultyQuizQuestion[];
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  source: 'faculty';
  xpReward: number;
};

export type FacultyQuestObjective = {
  id: string;
  type: 'lesson' | 'quiz' | 'coding' | 'xp' | 'streak' | 'boss' | 'prerequisite_quest';
  contentId?: string;
  title: string;
  description: string;
  minScore?: number;
  targetCount?: number;
};

export type FacultyQuest = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
  xpReward: number;
  objectives: FacultyQuestObjective[];
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  source: 'faculty';
  badgeReward?: string;
  prerequisites: string[];
};

export type FacultyStudentProgress = {
  studentId: string;
  studentName: string;
  questId: string;
  objectivesCompleted: number;
  totalObjectives: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
};

// ─── Default Sample Data ───

const defaultFacultyLessons: FacultyLesson[] = [
  {
    id: 'faculty-lesson-dom-1',
    title: 'Introduction to DOM',
    description: 'Learn the basics of Document Object Model manipulation in JavaScript.',
    topic: 'JavaScript',
    difficulty: 2,
    estimatedMinutes: 25,
    contentType: 'structured',
    sections: [
      { id: 's1', title: 'What is the DOM?', contentType: 'text', content: 'The Document Object Model (DOM) is a programming interface for HTML documents. It represents the page as a tree of nodes where each node is an object representing a part of the document.' },
      { id: 's2', title: 'Selecting Elements', contentType: 'code', content: 'const element = document.getElementById("myId");\nconst elements = document.querySelectorAll(".myClass");\nconst first = document.querySelector(".myClass");', language: 'javascript' },
      { id: 's3', title: 'Modifying Content', contentType: 'text', content: 'Once you have selected an element, you can change its text content, HTML content, attributes, and styles using JavaScript properties and methods.' },
    ],
    learningObjectives: ['Understand DOM structure', 'Select elements using querySelector', 'Modify element content'],
    status: 'published',
    createdBy: 'faculty-1',
    creatorName: 'Master Lamac',
    createdAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z',
    source: 'faculty',
    xpReward: 50,
  },
  {
    id: 'faculty-lesson-dom-2',
    title: 'DOM Selectors Deep Dive',
    description: 'Advanced DOM selection techniques and traversal methods.',
    topic: 'JavaScript',
    difficulty: 3,
    estimatedMinutes: 35,
    contentType: 'structured',
    sections: [
      { id: 's1', title: 'Advanced Selectors', contentType: 'text', content: 'Beyond basic selectors, you can use complex CSS-style selectors to target specific elements with precision.' },
      { id: 's2', title: 'DOM Traversal', contentType: 'code', content: 'const parent = element.parentElement;\nconst children = element.children;\nconst next = element.nextElementSibling;\nconst previous = element.previousElementSibling;', language: 'javascript' },
      { id: 's3', title: 'Live vs Static Collections', contentType: 'tip', content: 'querySelectorAll returns a static NodeList. getElementsByClassName returns a live HTMLCollection that updates automatically when the DOM changes.' },
    ],
    learningObjectives: ['Use advanced CSS selectors', 'Traverse the DOM tree', 'Understand live vs static collections'],
    status: 'published',
    createdBy: 'faculty-1',
    creatorName: 'Master Lamac',
    createdAt: '2026-08-16T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z',
    source: 'faculty',
    xpReward: 75,
  },
  {
    id: 'faculty-lesson-async-1',
    title: 'Async JavaScript Basics',
    description: 'Understanding callbacks, promises, and async/await in JavaScript.',
    topic: 'JavaScript',
    difficulty: 3,
    estimatedMinutes: 40,
    contentType: 'structured',
    sections: [
      { id: 's1', title: 'The Event Loop', contentType: 'text', content: 'JavaScript is single-threaded, but it can handle asynchronous operations through the event loop mechanism. Understanding the event loop is crucial for writing efficient async code.' },
      { id: 's2', title: 'Promises', contentType: 'code', content: 'const fetchData = () => {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve("Data loaded"), 1000);\n  });\n};\n\nfetchData().then(data => console.log(data));', language: 'javascript' },
      { id: 's3', title: 'Async/Await', contentType: 'code', content: 'async function loadUser() {\n  try {\n    const user = await fetchUser();\n    const posts = await fetchPosts(user.id);\n    return { user, posts };\n  } catch (error) {\n    console.error("Failed to load user", error);\n  }\n}', language: 'javascript' },
    ],
    learningObjectives: ['Understand the event loop', 'Write promises', 'Use async/await syntax'],
    status: 'draft',
    createdBy: 'faculty-2',
    creatorName: 'Prof. Santos',
    createdAt: '2026-08-20T00:00:00Z',
    updatedAt: '2026-08-20T00:00:00Z',
    source: 'faculty',
    xpReward: 60,
  },
];

const defaultFacultyQuizzes: FacultyQuiz[] = [
  {
    id: 'faculty-quiz-dom-1',
    title: 'DOM Fundamentals Quiz',
    description: 'Test your understanding of DOM manipulation concepts.',
    topic: 'JavaScript',
    passingScore: 80,
    timeLimit: 20,
    attemptsAllowed: 3,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'What does DOM stand for?',
        options: ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Digital Object Management'],
        correctAnswer: 'Document Object Model',
        explanation: 'The DOM represents the structure of an HTML document as a tree of objects.',
        points: 10,
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'Which method returns the first element matching a CSS selector?',
        options: ['querySelectorAll()', 'getElementById()', 'querySelector()', 'getElementsByClassName()'],
        correctAnswer: 'querySelector()',
        explanation: 'querySelector() returns the first element that matches the specified CSS selector.',
        points: 10,
      },
      {
        id: 'q3',
        type: 'mcq',
        question: 'How do you create a new element in the DOM?',
        options: ['document.newElement()', 'document.createElement()', 'document.makeElement()', 'document.addElement()'],
        correctAnswer: 'document.createElement()',
        explanation: 'document.createElement(tagName) creates a new HTML element with the specified tag name.',
        points: 10,
      },
    ],
    status: 'published',
    createdBy: 'faculty-1',
    creatorName: 'Master Lamac',
    createdAt: '2026-08-17T00:00:00Z',
    updatedAt: '2026-08-17T00:00:00Z',
    source: 'faculty',
    xpReward: 100,
  },
  {
    id: 'faculty-quiz-async-1',
    title: 'Async JavaScript Quiz',
    description: 'Assess your knowledge of promises, async/await, and the event loop.',
    topic: 'JavaScript',
    passingScore: 75,
    timeLimit: 25,
    attemptsAllowed: 3,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'What is the state of a Promise after calling resolve()?',
        options: ['pending', 'fulfilled', 'rejected', 'settled'],
        correctAnswer: 'fulfilled',
        explanation: 'When resolve() is called, the Promise transitions to the fulfilled state.',
        points: 10,
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'What does the await keyword do?',
        options: ['Pauses execution until the Promise resolves', 'Creates a new Promise', 'Cancels an async operation', 'Speeds up function execution'],
        correctAnswer: 'Pauses execution until the Promise resolves',
        explanation: 'await pauses the execution of the async function until the Promise resolves or rejects.',
        points: 10,
      },
    ],
    status: 'published',
    createdBy: 'faculty-2',
    creatorName: 'Prof. Santos',
    createdAt: '2026-08-21T00:00:00Z',
    updatedAt: '2026-08-21T00:00:00Z',
    source: 'faculty',
    xpReward: 100,
  },
];

const defaultFacultyQuests: FacultyQuest[] = [
  {
    id: 'faculty-quest-dom-1',
    title: "Master Lamac's Quest",
    subtitle: 'JavaScript DOM Challenge',
    description: 'Master the fundamentals of DOM manipulation through guided lessons and an assessment.',
    difficulty: 3,
    estimatedMinutes: 60,
    xpReward: 300,
    objectives: [
      { id: 'obj-1', type: 'lesson', contentId: 'faculty-lesson-dom-1', title: 'Complete "Introduction to DOM"', description: 'Learn the basics of DOM manipulation' },
      { id: 'obj-2', type: 'lesson', contentId: 'faculty-lesson-dom-2', title: 'Complete "DOM Selectors Deep Dive"', description: 'Advanced selection and traversal techniques' },
      { id: 'obj-3', type: 'quiz', contentId: 'faculty-quiz-dom-1', title: 'Pass "DOM Fundamentals Quiz"', description: 'Test your DOM knowledge', minScore: 80 },
    ],
    status: 'published',
    createdBy: 'faculty-1',
    creatorName: 'Master Lamac',
    createdAt: '2026-08-18T00:00:00Z',
    updatedAt: '2026-08-18T00:00:00Z',
    source: 'faculty',
    badgeReward: 'DOM Warrior',
    prerequisites: [],
  },
  {
    id: 'faculty-quest-async-1',
    title: 'Async Mastery Challenge',
    subtitle: 'JavaScript Async Programming',
    description: 'Conquer asynchronous JavaScript with promises, async/await, and the event loop.',
    difficulty: 4,
    estimatedMinutes: 90,
    xpReward: 400,
    objectives: [
      { id: 'obj-1', type: 'lesson', contentId: 'faculty-lesson-async-1', title: 'Complete "Async JavaScript Basics"', description: 'Learn async programming fundamentals' },
      { id: 'obj-2', type: 'quiz', contentId: 'faculty-quiz-async-1', title: 'Pass "Async JavaScript Quiz"', description: 'Prove your async knowledge', minScore: 75 },
    ],
    status: 'published',
    createdBy: 'faculty-2',
    creatorName: 'Prof. Santos',
    createdAt: '2026-08-22T00:00:00Z',
    updatedAt: '2026-08-22T00:00:00Z',
    source: 'faculty',
    badgeReward: 'Async Champion',
    prerequisites: [],
  },
];

const defaultStudentProgress: FacultyStudentProgress[] = [
  { studentId: 'student-1', studentName: 'Alex Chen', questId: 'faculty-quest-dom-1', objectivesCompleted: 3, totalObjectives: 3, status: 'completed', startedAt: '2026-08-19T00:00:00Z', completedAt: '2026-08-20T00:00:00Z' },
  { studentId: 'student-2', studentName: 'Mark Santos', questId: 'faculty-quest-dom-1', objectivesCompleted: 2, totalObjectives: 3, status: 'in_progress', startedAt: '2026-08-21T00:00:00Z' },
  { studentId: 'student-3', studentName: 'John Cruz', questId: 'faculty-quest-dom-1', objectivesCompleted: 1, totalObjectives: 3, status: 'in_progress', startedAt: '2026-08-22T00:00:00Z' },
  { studentId: 'student-4', studentName: 'Bea Villanueva', questId: 'faculty-quest-dom-1', objectivesCompleted: 0, totalObjectives: 3, status: 'not_started' },
  { studentId: 'student-1', studentName: 'Alex Chen', questId: 'faculty-quest-async-1', objectivesCompleted: 1, totalObjectives: 2, status: 'in_progress', startedAt: '2026-08-23T00:00:00Z' },
  { studentId: 'student-2', studentName: 'Mark Santos', questId: 'faculty-quest-async-1', objectivesCompleted: 0, totalObjectives: 2, status: 'not_started' },
];

// ─── LocalStorage Keys ───
const LS_KEYS = {
  lessons: 'itquest_faculty_lessons',
  quizzes: 'itquest_faculty_quizzes',
  quests: 'itquest_faculty_quests',
  studentProgress: 'itquest_faculty_student_progress',
  lessonProgress: 'itquest_faculty_lesson_progress',
  quizResults: 'itquest_faculty_quiz_results',
  questProgress: 'itquest_faculty_quest_progress',
};

// ─── Seed Default Data ───
function seedIfEmpty() {
  if (!localStorage.getItem(LS_KEYS.lessons)) {
    localStorage.setItem(LS_KEYS.lessons, JSON.stringify(defaultFacultyLessons));
  }
  if (!localStorage.getItem(LS_KEYS.quizzes)) {
    localStorage.setItem(LS_KEYS.quizzes, JSON.stringify(defaultFacultyQuizzes));
  }
  if (!localStorage.getItem(LS_KEYS.quests)) {
    localStorage.setItem(LS_KEYS.quests, JSON.stringify(defaultFacultyQuests));
  }
  if (!localStorage.getItem(LS_KEYS.studentProgress)) {
    localStorage.setItem(LS_KEYS.studentProgress, JSON.stringify(defaultStudentProgress));
  }
}

seedIfEmpty();

// ─── Lesson CRUD ───
export function getFacultyLessons(): FacultyLesson[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.lessons);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyLessons(lessons: FacultyLesson[]) {
  localStorage.setItem(LS_KEYS.lessons, JSON.stringify(lessons));
}

export function createFacultyLesson(lesson: Omit<FacultyLesson, 'id' | 'createdAt' | 'updatedAt'>): FacultyLesson {
  const lessons = getFacultyLessons();
  const newLesson: FacultyLesson = {
    ...lesson,
    id: `faculty-lesson-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveFacultyLessons([...lessons, newLesson]);
  return newLesson;
}

export function updateFacultyLesson(id: string, updates: Partial<FacultyLesson>): FacultyLesson | null {
  const lessons = getFacultyLessons();
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  lessons[idx] = { ...lessons[idx], ...updates, updatedAt: new Date().toISOString() };
  saveFacultyLessons(lessons);
  return lessons[idx];
}

export function deleteFacultyLesson(id: string) {
  const lessons = getFacultyLessons().filter((l) => l.id !== id);
  saveFacultyLessons(lessons);
}

export function getFacultyLessonById(id: string): FacultyLesson | undefined {
  return getFacultyLessons().find((l) => l.id === id);
}

// ─── Quiz CRUD ───
export function getFacultyQuizzes(): FacultyQuiz[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.quizzes);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyQuizzes(quizzes: FacultyQuiz[]) {
  localStorage.setItem(LS_KEYS.quizzes, JSON.stringify(quizzes));
}

export function createFacultyQuiz(quiz: Omit<FacultyQuiz, 'id' | 'createdAt' | 'updatedAt'>): FacultyQuiz {
  const quizzes = getFacultyQuizzes();
  const newQuiz: FacultyQuiz = {
    ...quiz,
    id: `faculty-quiz-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveFacultyQuizzes([...quizzes, newQuiz]);
  return newQuiz;
}

export function updateFacultyQuiz(id: string, updates: Partial<FacultyQuiz>): FacultyQuiz | null {
  const quizzes = getFacultyQuizzes();
  const idx = quizzes.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  quizzes[idx] = { ...quizzes[idx], ...updates, updatedAt: new Date().toISOString() };
  saveFacultyQuizzes(quizzes);
  return quizzes[idx];
}

export function deleteFacultyQuiz(id: string) {
  const quizzes = getFacultyQuizzes().filter((q) => q.id !== id);
  saveFacultyQuizzes(quizzes);
}

export function getFacultyQuizById(id: string): FacultyQuiz | undefined {
  return getFacultyQuizzes().find((q) => q.id === id);
}

// ─── Quest CRUD ───
export function getFacultyQuests(): FacultyQuest[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.quests);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyQuests(quests: FacultyQuest[]) {
  localStorage.setItem(LS_KEYS.quests, JSON.stringify(quests));
}

export function createFacultyQuest(quest: Omit<FacultyQuest, 'id' | 'createdAt' | 'updatedAt'>): FacultyQuest {
  const quests = getFacultyQuests();
  const newQuest: FacultyQuest = {
    ...quest,
    id: `faculty-quest-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveFacultyQuests([...quests, newQuest]);
  return newQuest;
}

export function updateFacultyQuest(id: string, updates: Partial<FacultyQuest>): FacultyQuest | null {
  const quests = getFacultyQuests();
  const idx = quests.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  quests[idx] = { ...quests[idx], ...updates, updatedAt: new Date().toISOString() };
  saveFacultyQuests(quests);
  return quests[idx];
}

export function deleteFacultyQuest(id: string) {
  const quests = getFacultyQuests().filter((q) => q.id !== id);
  saveFacultyQuests(quests);
}

export function getFacultyQuestById(id: string): FacultyQuest | undefined {
  return getFacultyQuests().find((q) => q.id === id);
}

// ─── Faculty Quest Progress (Student-facing) ───
export function getFacultyQuestProgress() {
  try {
    const raw = localStorage.getItem(LS_KEYS.questProgress);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyQuestProgress(progress: any[]) {
  localStorage.setItem(LS_KEYS.questProgress, JSON.stringify(progress));
}

export function startFacultyQuest(questId: string) {
  const progress = getFacultyQuestProgress();
  const existing = progress.find((p: any) => p.questId === questId);
  if (!existing || existing.status === 'not_started') {
    const updated = progress.filter((p: any) => p.questId !== questId);
    updated.push({ questId, status: 'active', startedAt: new Date().toISOString(), completedAt: null });
    saveFacultyQuestProgress(updated);
    return updated;
  }
  return progress;
}

export function completeFacultyQuest(questId: string) {
  const progress = getFacultyQuestProgress();
  const updated = progress.filter((p: any) => p.questId !== questId);
  updated.push({
    questId,
    status: 'completed',
    startedAt: progress.find((p: any) => p.questId === questId)?.startedAt || new Date().toISOString(),
    completedAt: new Date().toISOString(),
  });
  saveFacultyQuestProgress(updated);
  return updated;
}

export function getFacultyQuestStatus(questId: string) {
  const progress = getFacultyQuestProgress();
  const entry = progress.find((p: any) => p.questId === questId);
  return entry?.status || 'not_started';
}

// ─── Faculty Lesson Progress (Student-facing) ───
export function getFacultyLessonProgress() {
  try {
    const raw = localStorage.getItem(LS_KEYS.lessonProgress);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyLessonProgress(progress: any[]) {
  localStorage.setItem(LS_KEYS.lessonProgress, JSON.stringify(progress));
}

export function completeFacultyLesson(lessonId: string) {
  const progress = getFacultyLessonProgress();
  const existing = progress.find((p: any) => p.lessonId === lessonId);
  if (!existing) {
    progress.push({ lessonId, isCompleted: true, completedAt: new Date().toISOString() });
  } else {
    existing.isCompleted = true;
    existing.completedAt = new Date().toISOString();
  }
  saveFacultyLessonProgress(progress);
}

export function isFacultyLessonCompleted(lessonId: string) {
  const progress = getFacultyLessonProgress();
  return progress.some((p: any) => p.lessonId === lessonId && p.isCompleted);
}

// ─── Faculty Quiz Results (Student-facing) ───
export function getFacultyQuizResults() {
  try {
    const raw = localStorage.getItem(LS_KEYS.quizResults);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyQuizResults(results: any[]) {
  localStorage.setItem(LS_KEYS.quizResults, JSON.stringify(results));
}

export function recordFacultyQuizResult(quizId: string, score: number, totalQuestions: number, passed: boolean) {
  const results = getFacultyQuizResults();
  results.push({
    quizId,
    score,
    totalQuestions,
    passed,
    submittedAt: new Date().toISOString(),
  });
  saveFacultyQuizResults(results);
}

export function getFacultyQuizBestScore(quizId: string) {
  const results = getFacultyQuizResults().filter((r: any) => r.quizId === quizId);
  if (results.length === 0) return 0;
  return Math.max(...results.map((r: any) => Math.round((r.score / r.totalQuestions) * 100)));
}

export function isFacultyQuizPassed(quizId: string, requiredScore: number) {
  const bestScore = getFacultyQuizBestScore(quizId);
  return bestScore >= requiredScore;
}

// ─── Student Progress (Faculty-facing) ───
export function getFacultyStudentProgress(): FacultyStudentProgress[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.studentProgress);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFacultyStudentProgress(progress: FacultyStudentProgress[]) {
  localStorage.setItem(LS_KEYS.studentProgress, JSON.stringify(progress));
}

export function getStudentProgressForQuest(questId: string): FacultyStudentProgress[] {
  return getFacultyStudentProgress().filter((p) => p.questId === questId);
}

// ─── Helpers ───
export function getPublishedFacultyLessons(): FacultyLesson[] {
  return getFacultyLessons().filter((l) => l.status === 'published');
}

export function getPublishedFacultyQuizzes(): FacultyQuiz[] {
  return getFacultyQuizzes().filter((q) => q.status === 'published');
}

export function getPublishedFacultyQuests(): FacultyQuest[] {
  return getFacultyQuests().filter((q) => q.status === 'published');
}

export function getFacultyLessonsByCreator(creatorId: string): FacultyLesson[] {
  return getFacultyLessons().filter((l) => l.createdBy === creatorId);
}

export function getFacultyQuizzesByCreator(creatorId: string): FacultyQuiz[] {
  return getFacultyQuizzes().filter((q) => q.createdBy === creatorId);
}

export function getFacultyQuestsByCreator(creatorId: string): FacultyQuest[] {
  return getFacultyQuests().filter((q) => q.createdBy === creatorId);
}

export function getQuestsUsingLesson(lessonId: string): FacultyQuest[] {
  return getFacultyQuests().filter((q) =>
    q.objectives.some((o) => o.type === 'lesson' && o.contentId === lessonId)
  );
}

export function getQuestsUsingQuiz(quizId: string): FacultyQuest[] {
  return getFacultyQuests().filter((q) =>
    q.objectives.some((o) => o.type === 'quiz' && o.contentId === quizId)
  );
}

export function countQuestsUsingLesson(lessonId: string): number {
  return getQuestsUsingLesson(lessonId).length;
}

export function countQuestsUsingQuiz(quizId: string): number {
  return getQuestsUsingQuiz(quizId).length;
}