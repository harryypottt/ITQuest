// ==========================================
// FACULTY DATABASE REPOSITORY
// Database: MySQL (mysql2/promise)
// ==========================================

import mysql from 'mysql2/promise';
import db from '../config/db.js';

// ─── 1. LESSONS MODULE ───

export const findAllFacultyLessons = async () => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM faculty_lessons ORDER BY created_at DESC'
  );
  return rows.map((l) => ({
    ...l,
    sections: typeof l.sections === 'string' ? JSON.parse(l.sections || '[]') : l.sections || [],
    learningObjectives: typeof l.learning_objectives === 'string' ? JSON.parse(l.learning_objectives || '[]') : l.learning_objectives || [],
    estimatedMinutes: l.estimated_minutes,
    xpReward: l.xp_reward,
    contentType: l.content_type,
    creatorName: l.creator_name,
    createdBy: l.created_by,
    createdAt: l.created_at,
    updatedAt: l.updated_at,
  }));
};

export const createFacultyLesson = async (data: any) => {
  const {
    id, title, description, topic, difficulty, estimatedMinutes,
    xpReward, contentType, sections, learningObjectives, status, createdBy, creatorName
  } = data;

  const sql = `
    INSERT INTO faculty_lessons 
    (id, title, description, topic, difficulty, estimated_minutes, xp_reward, content_type, sections, learning_objectives, status, created_by, creator_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    id || `faculty-lesson-${Date.now()}`,
    title,
    description,
    topic,
    difficulty || 1,
    estimatedMinutes || 30,
    xpReward || 50,
    contentType || 'structured',
    JSON.stringify(sections || []),
    JSON.stringify(learningObjectives || []),
    status || 'draft',
    createdBy || 'faculty-1',
    creatorName || 'Master Lamac',
  ];

  const [result] = await db.query(sql, values);
  return result;
};

export const updateFacultyLesson = async (id: string, data: any) => {
  const {
    title, description, topic, difficulty, estimatedMinutes,
    xpReward, contentType, sections, learningObjectives, status
  } = data;

  const sql = `
    UPDATE faculty_lessons 
    SET title = ?, 
        description = ?, 
        topic = ?, 
        difficulty = ?, 
        estimated_minutes = ?, 
        xp_reward = ?, 
        content_type = ?, 
        sections = ?, 
        learning_objectives = ?, 
        status = ?, 
        updated_at = NOW()
    WHERE id = ?
  `;

  const values = [
    title,
    description,
    topic,
    difficulty || 1,
    estimatedMinutes || 30,
    xpReward || 50,
    contentType || 'structured',
    JSON.stringify(sections || []),
    JSON.stringify(learningObjectives || []),
    status || 'draft',
    id,
  ];

  const [result] = await db.query(sql, values);
  return result;
};

export const updateFacultyLessonStatus = async (id: string, status: string) => {
  const [result] = await db.query(
    'UPDATE faculty_lessons SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};

export const deleteFacultyLesson = async (id: string) => {
  const [result] = await db.query(
    'DELETE FROM faculty_lessons WHERE id = ?',
    [id]
  );
  return result;
};

// ─── 2. QUIZZES & QUESTIONS MODULE ───

const saveQuizQuestions = async (quizId: string, questions: any[]) => {
  await db.query('DELETE FROM faculty_quiz_questions WHERE quiz_id = ?', [quizId]);

  if (questions && Array.isArray(questions) && questions.length > 0) {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionId = q.id || `fq-${Date.now()}-${i + 1}`;
      const optionsVal = typeof q.options === 'string' ? q.options : JSON.stringify(q.options || []);

      const sql = `
        INSERT INTO faculty_quiz_questions 
        (id, quiz_id, order_index, type, question, options, correct_answer, explanation, points) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        questionId,
        quizId,
        q.orderIndex || i + 1,
        q.type || 'mcq',
        q.question || '',
        optionsVal,
        q.correctAnswer || q.correct_answer || '',
        q.explanation || '',
        q.points || 10,
      ];

      await db.query(sql, values);
    }
  }
};

export const findAllFacultyQuizzes = async () => {
  const [quizzes] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM faculty_quizzes ORDER BY created_at DESC'
  );

  const [allQuestions] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM faculty_quiz_questions ORDER BY order_index ASC'
  );

  return quizzes.map((q) => {
    const quizQuestions = allQuestions
      .filter((quest) => String(quest.quiz_id) === String(q.id))
      .map((quest) => {
        let parsedOptions: string[] = [];

        if (typeof quest.options === 'string') {
          try {
            parsedOptions = JSON.parse(quest.options || '[]');
          } catch (e) {
            parsedOptions = [];
          }
        } else if (Array.isArray(quest.options)) {
          parsedOptions = quest.options;
        }

        return {
          id: quest.id,
          quizId: quest.quiz_id,
          orderIndex: quest.order_index,
          type: quest.type || 'mcq',
          question: quest.question || '',
          options: parsedOptions,
          correctAnswer: quest.correct_answer || quest.correctAnswer || '',
          explanation: quest.explanation || '',
          points: quest.points || 10,
        };
      });

    return {
      ...q,
      questions: quizQuestions,
      passingScore: q.passing_score,
      timeLimit: q.time_limit,
      attemptsAllowed: q.attempts_allowed,
      xpReward: q.xp_reward,
      creatorName: q.creator_name,
      createdBy: q.created_by,
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    };
  });
};

export const createFacultyQuiz = async (data: any) => {
  const {
    id, title, description, topic, passingScore, timeLimit,
    attemptsAllowed, questions, xpReward, status, createdBy, creatorName
  } = data;

  const quizId = id || `faculty-quiz-${Date.now()}`;

  const sql = `
    INSERT INTO faculty_quizzes 
    (id, title, description, topic, passing_score, time_limit, attempts_allowed, xp_reward, status, created_by, creator_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    quizId,
    title,
    description,
    topic,
    passingScore || 80,
    timeLimit || 20,
    attemptsAllowed || 3,
    xpReward || 100,
    status || 'draft',
    createdBy || 'faculty-1',
    creatorName || 'Master Lamac',
  ];

  const [result] = await db.query(sql, values);
  await saveQuizQuestions(quizId, questions);
  return result;
};

export const updateFacultyQuiz = async (id: string, data: any) => {
  const {
    title, description, topic, passingScore, timeLimit,
    attemptsAllowed, questions, xpReward, status
  } = data;

  const sql = `
    UPDATE faculty_quizzes
    SET title = ?, description = ?, topic = ?, passing_score = ?, time_limit = ?, attempts_allowed = ?, xp_reward = ?, status = ?, updated_at = NOW()
    WHERE id = ?
  `;
  const values = [
    title, description, topic, passingScore || 80, timeLimit || 20,
    attemptsAllowed || 3, xpReward || 100, status || 'draft', id
  ];

  const [result] = await db.query(sql, values);
  await saveQuizQuestions(id, questions);
  return result;
};

export const updateFacultyQuizStatus = async (id: string, status: string) => {
  const [result] = await db.query(
    'UPDATE faculty_quizzes SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};

export const deleteFacultyQuiz = async (id: string) => {
  await db.query('DELETE FROM faculty_quiz_questions WHERE quiz_id = ?', [id]);
  const [result] = await db.query(
    'DELETE FROM faculty_quizzes WHERE id = ?',
    [id]
  );
  return result;
};

// ─── 3. QUESTS MODULE ───

export const findAllFacultyQuests = async () => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM faculty_quests ORDER BY created_at DESC'
  );
  return rows.map((q) => ({
    ...q,
    objectives: typeof q.objectives === 'string' ? JSON.parse(q.objectives || '[]') : q.objectives || [],
    prerequisites: typeof q.prerequisites === 'string' ? JSON.parse(q.prerequisites || '[]') : q.prerequisites || [],
    estimatedMinutes: q.estimated_minutes,
    xpReward: q.xp_reward,
    badgeReward: q.badge_reward,
    creatorName: q.creator_name,
    createdBy: q.created_by,
    createdAt: q.created_at,
    updatedAt: q.updated_at,
  }));
};

export const createFacultyQuest = async (data: any) => {
  const {
    id, title, subtitle, description, difficulty, estimatedMinutes,
    xpReward, objectives, badgeReward, prerequisites, status, createdBy, creatorName
  } = data;

  const sql = `
    INSERT INTO faculty_quests 
    (id, title, subtitle, description, difficulty, estimated_minutes, xp_reward, objectives, badge_reward, prerequisites, status, created_by, creator_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    id || `faculty-quest-${Date.now()}`,
    title,
    subtitle || '',
    description,
    difficulty || 1,
    estimatedMinutes || 60,
    xpReward || 300,
    JSON.stringify(objectives || []),
    badgeReward || '',
    JSON.stringify(prerequisites || []),
    status || 'draft',
    createdBy || 'faculty-1',
    creatorName || 'Master Lamac',
  ];

  const [result] = await db.query(sql, values);
  return result;
};

export const updateFacultyQuest = async (id: string, data: any) => {
  const {
    title, subtitle, description, difficulty, estimatedMinutes,
    xpReward, objectives, badgeReward, prerequisites, status
  } = data;

  const sql = `
    UPDATE faculty_quests
    SET title = ?, subtitle = ?, description = ?, difficulty = ?, estimated_minutes = ?, xp_reward = ?, objectives = ?, badge_reward = ?, prerequisites = ?, status = ?, updated_at = NOW()
    WHERE id = ?
  `;
  const values = [
    title, subtitle || '', description, difficulty || 1, estimatedMinutes || 60,
    xpReward || 300, JSON.stringify(objectives || []), badgeReward || '', JSON.stringify(prerequisites || []), status || 'draft', id
  ];

  const [result] = await db.query(sql, values);
  return result;
};

export const updateFacultyQuestStatus = async (id: string, status: string) => {
  const [result] = await db.query(
    'UPDATE faculty_quests SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};

export const deleteFacultyQuest = async (id: string) => {
  const [result] = await db.query(
    'DELETE FROM faculty_quests WHERE id = ?',
    [id]
  );
  return result;
};

// ─── 4. PROGRESS & STATS ───

export const findFacultyStudentProgress = async () => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM faculty_student_progress ORDER BY started_at DESC'
  );
  return rows.map((p) => ({
    studentId: p.student_id,
    studentName: p.student_name,
    questId: p.quest_id,
    objectivesCompleted: p.objectives_completed,
    totalObjectives: p.total_objectives,
    status: p.status,
    startedAt: p.started_at,
    completedAt: p.completed_at,
  }));
};

export const findFacultyDashboardStats = async () => {
  const [[studentStats]] = await db.query<mysql.RowDataPacket[]>(`
    SELECT 
      COUNT(*) as totalStudents,
      SUM(CASE WHEN last_active >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as activeStudents
    FROM users WHERE role = 'student'
  `);

  const [[contentStats]] = await db.query<mysql.RowDataPacket[]>(`
    SELECT 
      (SELECT COUNT(*) FROM faculty_lessons) as lessonsCreated,
      (SELECT COUNT(*) FROM faculty_quests) as questsCreated,
      (SELECT COUNT(*) FROM faculty_quizzes) as quizzesCreated,
      (SELECT COUNT(*) FROM faculty_student_progress WHERE status = 'in_progress' OR status = 'pending') as pendingSubmissions
  `);

  const lessons = Number(contentStats?.lessonsCreated || 0);
  const quests = Number(contentStats?.questsCreated || 0);
  const quizzes = Number(contentStats?.quizzesCreated || 0);

  return {
    totalStudents: Number(studentStats?.totalStudents || 0),
    activeStudents: Number(studentStats?.activeStudents || 0),
    pendingSubmissions: Number(contentStats?.pendingSubmissions || 0),
    totalContent: lessons + quests + quizzes,
    lessonsCreated: lessons,
    questsCreated: quests,
    quizzesCreated: quizzes,
  };
};
