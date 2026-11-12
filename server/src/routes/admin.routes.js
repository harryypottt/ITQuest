const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');

// Controllers
const lessonController = require('../controllers/admin/lesson.controller');
const quizController = require('../controllers/admin/quiz.controller');
const questionController = require('../controllers/admin/question.controller');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'professor']));

// Lesson routes (existing)
router.get('/subjects/:subjectId/lessons', lessonController.getLessonsBySubject);
router.post('/lessons', lessonController.createLesson);
router.put('/lessons/:id', lessonController.updateLesson);
router.delete('/lessons/:id', lessonController.deleteLesson);

// Quiz routes
router.get('/subjects/:subjectId/quizzes', quizController.getQuizzesBySubject);
router.post('/quizzes', quizController.createQuiz);
router.put('/quizzes/:id', quizController.updateQuiz);
router.delete('/quizzes/:id', quizController.deleteQuiz);

// Question routes
router.get('/quizzes/:quizId/questions', questionController.getQuestionsByQuiz);
router.post('/questions', questionController.createQuestion);
router.put('/questions/:id', questionController.updateQuestion);
router.delete('/questions/:id', questionController.deleteQuestion);

module.exports = router;