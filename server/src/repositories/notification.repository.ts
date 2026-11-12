import pool from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface NotificationRow extends RowDataPacket {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string | Date;
  is_read: number | boolean;
  icon: string | null;
  action_label: string | null;
  action_path: string | null;
}

export const notificationRepository = {
  async findByUserId(userId: string): Promise<NotificationRow[]> {
    const [rows] = await pool.query<NotificationRow[]>(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC`,
      [userId]
    );
    return rows;
  },

  async countUnread(userId: string): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );
    return rows[0].count;
  },

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
    return result.affectedRows > 0;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );
    return result.affectedRows > 0;
  },

  async delete(notificationId: string, userId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
    return result.affectedRows > 0;
  },

  async create(data: {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    icon?: string;
    actionLabel?: string;
    actionPath?: string;
  }): Promise<boolean> {
    const query = `
      INSERT INTO notifications (id, user_id, type, title, message, timestamp, is_read, icon, action_label, action_path)
      VALUES (?, ?, ?, ?, ?, NOW(), FALSE, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(query, [
      data.id,
      data.userId,
      data.type,
      data.title,
      data.message,
      data.icon || null,
      data.actionLabel || null,
      data.actionPath || null,
    ]);
    return result.affectedRows > 0;
  },
};