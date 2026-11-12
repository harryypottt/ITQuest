const quizService = require('../../services/quest/quiz.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getQuizzesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const quizzes = await quizService.getQuizzesBySubject(subjectId);
    return successResponse(res, quizzes);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const createQuiz = async (req, res) => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    return successResponse(res, quiz, 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const updated = await quizService.updateQuiz(quizId, req.body);
    return successResponse(res, updated);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    await quizService.deleteQuiz(quizId);
    return successResponse(res, { message: 'Quiz deleted successfully' });
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

module.exports = {
  getQuizzesBySubject,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};