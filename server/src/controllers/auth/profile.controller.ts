import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import db from '../../config/db.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const [users] = await db.query<mysql.RowDataPacket[]>(
      `SELECT id, name, email, role, student_id, specialization, level, total_xp, rank_tier, avatar_initials, last_active 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User hindi nahanap.' });
    }

    return res.json({
      success: true,
      user: users[0]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};