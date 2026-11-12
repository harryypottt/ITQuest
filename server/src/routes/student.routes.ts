import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getLessons,
  getLessonById,
} from "../controllers/student/lesson.controller.js";
import {
  getStudentProgress,
  updateStudentProgress,
} from "../controllers/student/progress.controller.js";
import { questController } from "../controllers/student/quest.controller.js";
import {
  getQuizzes,
  getQuizById,
  getBossById,
  joinByPin,
  createCustomQuiz,
  submitQuizAttempt,
  getMastery,
  getReviewPlan,
  getQuestLinks,
  claimQuestReward,
  getUserHeaderStats,
} from "../controllers/student/quiz.controller.js";
import {
  getBadges,
  getBadgeCategories,
} from "../controllers/student/badge.controller.js";
import {
  getCodingChallenges,
  getCodingChallenge,
  submitCodingChallenge,
} from "../controllers/student/coding.controller.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/student/userProfile.controller.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/student/notification.controller.js';

import { getDashboardData } from '../controllers/student/dashboard.controller.js';

const router = Router();

router.use(authMiddleware);

// Lessons
router.get("/lessons", getLessons);
router.get("/lessons/:id", getLessonById);

// Progress
router.get("/progress", getStudentProgress);
router.post("/progress/update", updateStudentProgress);

// Quests
router.get("/quests", questController.getAllQuests);
router.post("/quests/:id/start", questController.startQuest);
router.post("/quests/:id/complete", questController.completeQuest);

// Quizzes & Battle Arena
router.get("/quizzes", getQuizzes);
router.post("/quizzes", createCustomQuiz);
router.post("/quizzes/join-by-pin", joinByPin);
router.get("/quizzes/:id", getQuizById);
router.post("/quizzes/:id/attempt", submitQuizAttempt);

// Topic Mastery Route
router.get("/mastery", getMastery);

// Review Plan Route
router.get("/review-plan", getReviewPlan);

// Quest Links & Header Stats Routes
router.get("/quest-links", getQuestLinks);
router.post("/quest-links/:id/claim", claimQuestReward);
router.get("/header-stats", getUserHeaderStats);

// Boss Battles
router.get("/bosses/:id", getBossById);

// Badges
router.get("/badges", getBadges);
router.get("/badges/categories", getBadgeCategories);

// Coding challenges
router.get("/coding-challenges", getCodingChallenges);
router.get("/coding-challenges/:id", getCodingChallenge);
router.post("/coding-challenges/:id/submit", submitCodingChallenge);

// Profile
router.get("/profile", getProfile);
router.get("/profile/:id", getProfile);
router.put("/profile", updateProfile);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllAsRead);
router.patch('/notifications/:id/read', markAsRead);
router.delete('/notifications/:id', deleteNotification);

// Dashboard Route
router.get('/dashboard', getDashboardData);


export default router;
