const subjectRepository = require('../../repositories/subject.repository');
const studentProgressRepository = require('../../repositories/studentProgress.repository');
const lessonRepository = require('../../repositories/lesson.repository');

const getCurriculumTree = async (userId) => {
  const subjects = await subjectRepository.findAllWithProgress(userId);
  const tree = {};
  for (const subject of subjects) {
    const year = subject.year_level_name;
    const semester = subject.semester_name;
    if (!tree[year]) tree[year] = {};
    if (!tree[year][semester]) tree[year][semester] = [];

    // Determine unlock status: check prerequisite subject if any
    let isUnlocked = false;
    if (subject.prerequisite_subject_id) {
      const prereqProgress = await studentProgressRepository.getSubjectProgress(userId, subject.prerequisite_subject_id);
      isUnlocked = prereqProgress && prereqProgress.status === 'completed';
    } else {
      isUnlocked = true; // first subject, no prerequisite
    }

    tree[year][semester].push({
      ...subject,
      isUnlocked,
      progress_status: subject.progress_status || 'locked',
    });
  }
  return tree;
};

const getSubjectDetails = async (userId, subjectId) => {
  const subject = await subjectRepository.findById(subjectId);
  if (!subject) throw new Error('Subject not found');

  const lessons = await subjectRepository.findLessonsBySubjectId(subjectId);
  const quizzes = await subjectRepository.findQuizzesBySubjectId(subjectId);
  const lessonProgress = await lessonRepository.getLessonProgressBySubject(userId, subjectId);
  const subjectProgress = await studentProgressRepository.getSubjectProgress(userId, subjectId);

  const lessonsWithProgress = lessons.map(lesson => {
    const prog = lessonProgress.find(lp => lp.id === lesson.id);
    return { ...lesson, is_completed: prog ? prog.is_completed : false };
  });

  return {
    ...subject,
    lessons: lessonsWithProgress,
    quizzes,
    subject_progress: subjectProgress,
  };
};

module.exports = {
  getCurriculumTree,
  getSubjectDetails,
};