const { validationMiddleware } = require('./validation.middleware');
const { createLessonSchema, updateLessonSchema } = require('../validators/lesson.validator');

router.post('/lessons', validationMiddleware(createLessonSchema), lessonController.createLesson);
router.put('/lessons/:id', validationMiddleware(updateLessonSchema), lessonController.updateLesson);