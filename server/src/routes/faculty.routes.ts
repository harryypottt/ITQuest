import { Router } from 'express';
import {
  getLessons,
  createLesson,
  updateLesson,
  updateLessonStatus,
  deleteLesson,
  getQuizzes,
  createQuiz,
  updateQuiz,
  updateQuizStatus,
  deleteQuiz,
  getQuests,
  createQuest,
  updateQuest,
  updateQuestStatus,
  deleteQuest,
  getSubmissions,
  getStats,
} from '../controllers/faculty/faculty.controller.js';

const router = Router();

// ─── 📚 LESSONS ROUTES ───
router.get('/lessons', getLessons);
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.patch('/lessons/:id/status', updateLessonStatus);
router.delete('/lessons/:id', deleteLesson);

// ─── 🧪 QUIZZES ROUTES ───
router.get('/quizzes', getQuizzes);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.patch('/quizzes/:id/status', updateQuizStatus);
router.delete('/quizzes/:id', deleteQuiz);

// ─── ⚔️ QUESTS ROUTES ───
router.get('/quests', getQuests);
router.post('/quests', createQuest);
router.put('/quests/:id', updateQuest);
router.patch('/quests/:id/status', updateQuestStatus);
router.delete('/quests/:id', deleteQuest);

// ─── 📊 ANALYTICS & SUBMISSIONS ───
router.get('/submissions', getSubmissions);
router.get('/stats', getStats);

export default router;
