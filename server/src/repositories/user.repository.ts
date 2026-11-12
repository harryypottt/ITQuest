import pool from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 🌟 USER INTERFACE (Naidagdag ang rp at rank_tier batay sa database schema)
export interface User extends RowDataPacket {
  id: string;
  name: string;
  email: string | null;
  password_hash: string;
  role: string;
  student_id: string | null;
  specialization: string | null;
  level: number;
  total_xp: number;
  streak: number;
  rank: string | null;
  status: string;
  avatar_initials: string | null;
  bio: string | null;
  joined_at: Date;
  last_active: Date | null;
  rp?: number;
  rank_tier?: string;
  updated_at?: Date;
}

export interface CreateUserInput {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role?: string;
  student_id?: string | null;
  specialization?: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  specialization?: string;
  avatar_initials?: string;
}

export interface UserBadgeRow extends RowDataPacket {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  category_name: string | null;
  rarity: string | null;
  icon: string | null;
  xp_bonus: number;
  requirement: string | null;
  progress_target: number | null;
  is_earned: number;
  progress_current: number;
  earned_at: Date | null;
}

export interface UserActivityRow extends RowDataPacket {
  id: number;
  activity_type: string;
  title: string;
  description: string | null;
  xp_earned: number;
  created_at: Date;
}

export interface CodingStatsRow extends RowDataPacket {
  challenges_solved: number;
  total_submissions: number;
  total_coding_xp: number;
}

export const userRepository = {
  // 1. Maghanap ng user gamit ang Email
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length ? rows[0] : null;
  },

  // 2. Maghanap ng user gamit ang ID (String/UUID)
  async findById(id: string): Promise<User | null> {
    const [rows] = await pool.query<User[]>(
      'SELECT id, name, email, role, student_id, specialization, level, total_xp, streak, rank, status, avatar_initials, bio, joined_at, last_active, rp, rank_tier FROM users WHERE id = ?',
      [id]
    );
    return rows.length ? rows[0] : null;
  },

  // 3. Maghanap ng user gamit ang ID (kasama ang password)
  async findByIdWithPassword(id: string): Promise<User | null> {
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length ? rows[0] : null;
  },

  // 4. Magkwenta ng kabuuang bilang ng users
  async countUsers(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM users');
    return rows[0]?.total || 0;
  },

  // 5. Gumawa ng bagong User record
  async create(data: CreateUserInput): Promise<User | null> {
    const {
      id,
      name,
      email,
      password_hash,
      role = 'student',
      student_id = null,
      specialization = null,
    } = data;

    await pool.query<ResultSetHeader>(
      `INSERT INTO users (id, name, email, password_hash, role, student_id, specialization)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, password_hash, role, student_id, specialization]
    );

    return this.findById(id);
  },

  // 6. Mag-update ng password
  async updatePassword(id: string, password_hash: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, id]
    );
    return result.affectedRows > 0;
  },

  // 🌟 7. PROFILE MODULE: Mag-update ng Profile Information
  async updateProfile(id: string, data: UpdateProfileInput): Promise<User | null> {
    const { name, bio, specialization, avatar_initials } = data;
    await pool.query<ResultSetHeader>(
      `UPDATE users 
       SET 
         name = COALESCE(?, name),
         bio = COALESCE(?, bio),
         specialization = COALESCE(?, specialization),
         avatar_initials = COALESCE(?, avatar_initials),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name || null, bio || null, specialization || null, avatar_initials || null, id]
    );
    return this.findById(id);
  },

  // 🌟 8. PROFILE MODULE: Kunin ang lahat ng Badges + Status ng User
  async getUserBadges(userId: string): Promise<UserBadgeRow[]> {
    const [rows] = await pool.query<UserBadgeRow[]>(
      `SELECT 
        b.id,
        b.name,
        b.description,
        b.category,
        b.category_name,
        b.rarity,
        b.icon,
        b.xp_bonus,
        b.requirement,
        b.progress_target,
        COALESCE(ub.is_earned, 0) AS is_earned,
        COALESCE(ub.progress_current, 0) AS progress_current,
        ub.earned_at
      FROM badges b
      LEFT JOIN user_badges ub 
        ON b.id = ub.badge_id AND ub.user_id = ?
      ORDER BY ub.is_earned DESC, ub.earned_at DESC, b.id ASC`,
      [userId]
    );
    return rows;
  },

  // 🌟 9. PROFILE MODULE: Kunin ang Recent Activities ng User
  async getUserActivities(userId: string, limit: number = 5): Promise<UserActivityRow[]> {
    const [rows] = await pool.query<UserActivityRow[]>(
      `SELECT id, activity_type, title, description, xp_earned, created_at
       FROM user_activities
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, Number(limit)]
    );
    return rows;
  },

  // 🌟 10. PROFILE MODULE: Kunin ang Coding Challenge Statistics
  async getCodingStats(userId: string): Promise<CodingStatsRow> {
    const [rows] = await pool.query<CodingStatsRow[]>(
      `SELECT 
        COUNT(DISTINCT CASE WHEN status = 'passed' THEN challenge_id END) AS challenges_solved,
        COUNT(*) AS total_submissions,
        COALESCE(SUM(xp_awarded), 0) AS total_coding_xp
      FROM coding_submissions
      WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || { challenges_solved: 0, total_submissions: 0, total_coding_xp: 0 };
  },
};