const lessonService = require('../../services/quest/lesson.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getLessonsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const lessons = await lessonService.getLessonsBySubject(subjectId);
    return successResponse(res, lessons);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const createLesson = async (req, res) => {
  try {
    const lessonData = req.body;
    // Optional: attach the admin/professor who created it
   // lessonData.created_by = req.user.id;
    const newLesson = await lessonService.createLesson(lessonData);
    return successResponse(res, newLesson, 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const updateData = req.body;
    const updatedLesson = await lessonService.updateLesson(lessonId, updateData);
    return successResponse(res, updatedLesson);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

const deleteLesson = async (req, res) => {
  try {
    console.log('DELETE request received for id:', req.params.id);
    const lessonId = req.params.id;
    await lessonService.deleteLesson(lessonId);
    return successResponse(res, { message: 'Lesson deleted successfully' });
  } catch (err) {
    console.error('Delete controller error:', err);
    // Make sure errorResponse is defined
    if (typeof errorResponse !== 'function') {
      return res.status(500).json({ success: false, error: 'Internal server error: errorResponse missing' });
    }
    return errorResponse(res, err.message, 400);
  }
};

module.exports = {
  getLessonsBySubject,
  createLesson,
  updateLesson,
  deleteLesson,
};