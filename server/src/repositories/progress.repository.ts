import mysql from 'mysql2/promise';
import db from '../config/db.js';

// Kumuha ng progress ng isang user
export const findUserProgressList = async (userId: string) => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT lesson_id AS lessonId, is_completed AS isCompleted, completed_at AS completedAt FROM user_lesson_progress WHERE user_id = ? AND is_completed = 1',
    [userId]
  );
  return rows;
};

// Suriin kung completed na ang lesson
export const findUserLessonProgress = async (userId: string, lessonId: string) => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT is_completed FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?',
    [userId, lessonId]
  );
  return rows[0] || null;
};

// I-save/update ang progress
export const upsertLessonProgress = async (userId: string, lessonId: string) => {
  const progressQuery = `
    INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, completed_at)
    VALUES (?, ?, 1, NOW())
    ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = NOW()
  `;
  await db.query(progressQuery, [userId, lessonId]);
};

// Kumuha ng XP reward ng lesson
export const getLessonXpReward = async (lessonId: string) => {
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT xp_reward FROM lessons WHERE id = ?',
    [lessonId]
  );
  return rows.length > 0 ? Number(rows[0].xp_reward || 50) : 50;
};

// Dagdagan ang total_xp ng user

export const addXpToUser = async (userId: string, xpAmount: number) => {
  await db.query(
    'UPDATE users SET total_xp = COALESCE(total_xp, 0) + ? WHERE id = ?',
    [xpAmount, userId]
  );
};