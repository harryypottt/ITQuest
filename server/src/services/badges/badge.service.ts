import db from "../../config/db.js";
import badgeRepository from "../../repositories/badge.repository.js";

export class BadgeService {
  /**
   * Kinukuha ang lahat ng master badges at pinag-i-join sa progress ng user.
   * Gumagamit ng LEFT JOIN para lumitaw pa rin kahit ang mga zero-progress badges
   * nang hindi na kailangang i-save sa database table.
   */
async getUserBadges(userId: number | string) {
    const query = `
      SELECT 
        b.*,
        COALESCE(ub.progress_current, 0) AS progress_current,
        COALESCE(ub.is_earned, 0) AS is_earned,
        ub.earned_at
      FROM badges b
      LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
    `;

    const [badges]: any = await db.query(query, [userId]);
    const stats = await badgeRepository.getStatsForUser(userId);
    
    return { stats, badges };
  }
  async getBadgeCategories() {
    return await badgeRepository.findAllCategories();
  }
}

export default new BadgeService();