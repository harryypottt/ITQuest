const questionService = require('../../services/quest/question.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await questionService.getQuestionsByQuiz(quizId);
    return successResponse(res, questions);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    return successResponse(res, question, 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const updated = await questionService.updateQuestion(questionId, req.body);
    return successResponse(res, updated);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    await questionService.deleteQuestion(questionId);
    return successResponse(res, { message: 'Question deleted successfully' });
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

module.exports = {
  getQuestionsByQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};