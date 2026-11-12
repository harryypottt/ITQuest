import mysql from 'mysql2/promise';
import db from '../config/db.js';

export const findAllLessons = async () => {
  const [lessons] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM lessons ORDER BY id ASC'
  );
  return lessons;
};

export const findLessonById = async (id: string) => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT * FROM lessons WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

export const findUserLessonProgress = async (userId: string, lessonId: string) => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT is_completed FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?',
    [userId, lessonId]
  );
  return rows[0] || null;
};

export const upsertLessonProgress = async (userId: string, lessonId: string) => {
  const progressQuery = `
    INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, completed_at)
    VALUES (?, ?, 1, NOW())
    ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = NOW()
  `;
  await db.query(progressQuery, [userId, lessonId]);
};

export const addXpToUser = async (userId: string, xpAmount: number) => {
  await db.query(
    'UPDATE users SET xp = COALESCE(xp, 0) + ? WHERE id = ?',
    [xpAmount, userId]
  );
};

export const findUserProgressList = async (userId: string) => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT lesson_id AS lessonId, is_completed AS isCompleted, completed_at AS completedAt FROM user_lesson_progress WHERE user_id = ? AND is_completed = 1',
    [userId]
  );
  return rows;
};

export interface CreateLessonData {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  category_name?: string;
  difficulty?: number;
  estimated_minutes?: number;
  xp_reward?: number;
  icon?: string;
  thumbnail?: string;
  module_id?: string;
  order_index?: number;
  prerequisites?: string;
  content?: string;
  learning_objectives?: string;
  source?: string;
  status?: string;
  created_by?: string;
  creator_name?: string;
}

export const createLesson = async (data: CreateLessonData) => {
  // Gagawa ng UUID/ID kung walang ipinasa
  const lessonId = data.id || `lesson_${Date.now()}`;

  const query = `
    INSERT INTO lessons (
      id, title, description, category, category_name, difficulty,
      estimated_minutes, xp_reward, icon, thumbnail, module_id,
      order_index, prerequisites, content, learning_objectives,
      source, status, created_by, creator_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    lessonId,
    data.title,
    data.description || null,
    data.category || null,
    data.category_name || null,
    data.difficulty ?? 1,
    data.estimated_minutes ?? 15,
    data.xp_reward ?? 50,
    data.icon || null,
    data.thumbnail || null,
    data.module_id || null,
    data.order_index ?? 1,
    data.prerequisites ? JSON.stringify(data.prerequisites) : null,
    data.content ? JSON.stringify(data.content) : null,
    data.learning_objectives ? JSON.stringify(data.learning_objectives) : null,
    data.source || 'core',
    data.status || 'published',
    data.created_by || null,
    data.creator_name || null,
  ];

  await db.query(query, values);
  return { id: lessonId, ...data };
};
