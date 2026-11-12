import db from '../config/db.js';


export interface Badge {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  rarity: string | null;
  icon: string | null;
  xp_bonus: number;
  requirement: string | null;
  is_earned: boolean;
  earned_at: Date | null;
  progress_current: number;
  progress_target: number;
}


export class BadgeRepository {
  /**
   * Kukunin ang lahat ng badges sa database kasama ang progress ng specific user
   */
  async findAllForUser(userId: number | string): Promise<Badge[]> {
    const query = `
      SELECT
        b.id,
        b.name,
        b.description,
        b.category,
        b.rarity,
        b.icon,
        COALESCE(b.xp_bonus, 0) AS xp_bonus,
        b.requirement,
        IF(ub.id IS NOT NULL AND ub.is_earned = 1, true, false) AS is_earned,
        ub.earned_at AS earned_at,
        COALESCE(ub.progress_current, 0) AS progress_current,
        COALESCE(b.progress_target, 1) AS progress_target
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
      ORDER BY b.id ASC
    `;
    const [rows]: any = await db.query(query, [userId]);
    return rows as Badge[];
  }


  /**
   * Dynamic stats generator base sa user progress
   */
  async getStatsForUser(userId: number | string) {
    const query = `
      SELECT
        COUNT(b.id) AS total_badges,
        SUM(CASE WHEN ub.id IS NOT NULL AND ub.is_earned = 1 THEN 1 ELSE 0 END) AS total_earned,
        SUM(CASE WHEN b.rarity = 'Common' AND ub.id IS NOT NULL AND ub.is_earned = 1 THEN 1 ELSE 0 END) AS common_count,
        SUM(CASE WHEN b.rarity = 'Rare' AND ub.id IS NOT NULL AND ub.is_earned = 1 THEN 1 ELSE 0 END) AS rare_count,
        SUM(CASE WHEN b.rarity = 'Epic' AND ub.id IS NOT NULL AND ub.is_earned = 1 THEN 1 ELSE 0 END) AS epic_count,
        SUM(CASE WHEN b.rarity = 'Legendary' AND ub.id IS NOT NULL AND ub.is_earned = 1 THEN 1 ELSE 0 END) AS legendary_count,
        SUM(CASE WHEN ub.id IS NOT NULL AND ub.is_earned = 1 THEN COALESCE(b.xp_bonus, 0) ELSE 0 END) AS total_xp_bonus
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
    `;
    const [rows]: any = await db.query(query, [userId]);
    return rows[0];
  }


  async findById(id: string): Promise<Badge | null> {
    const [rows]: any = await db.query('SELECT * FROM badges WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as Badge;
  }


  /**
   * Kukunin ang badge categories galing sa `badge_categories` table
   */
  async findAllCategories() {
    const [rows]: any = await db.query('SELECT value, label FROM badge_categories');
    return rows;
  }
}


export default new BadgeRepository();