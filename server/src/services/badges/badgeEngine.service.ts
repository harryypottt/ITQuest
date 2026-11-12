import db from "../../config/db.js";

export class BadgeEngineService {
  /**
   * Pangkalahatang mag-e-evaluate at mag-a-update ng progress at earned status
   * ng lahat ng badges para sa isang specific user batay sa kanilang data sa DB.
   */
  async evaluateBadges(userId: string | number): Promise<void> {
    try {
      // 1. Kunin ang lahat ng badges at ang mga panuntunan nito mula sa database
      const [badges]: any = await db.query("SELECT * FROM badges");

      for (const badge of badges) {
        let currentProgress = 0;
        const target = badge.progress_target || 1;
        const reqType = badge.requirement_type;
        const reqVal = badge.requirement_value;

        // 2. Suriin ang progreso base sa requirement_type ng bawat badge
        switch (reqType) {
          case "total_xp": {
            const [userRows]: any = await db.query(
              "SELECT total_xp FROM users WHERE id = ?",
              [userId],
            );
            currentProgress = userRows[0]?.total_xp || 0;
            break;
          }
          case "lessons_completed": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM user_lesson_progress
               WHERE user_id = ? AND is_completed = 1`,
              [userId],
            );
            currentProgress = res[0]?.total || 0;
            break;
          }
          case "challenge_solved": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM coding_submissions
               WHERE user_id = ? AND challenge_id = ? AND status = 'passed'`,
              [userId, reqVal],
            );
            currentProgress = res[0]?.total > 0 ? 1 : 0;
            break;
          }
          case "challenges_solved": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM coding_submissions
               WHERE user_id = ? AND status = 'passed'`,
              [userId],
            );
            currentProgress = res[0]?.total || 0;
            break;
          }
          case "quest_completed": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM quest_progress
     WHERE user_id = ? AND quest_id = ? AND status = 'completed'`,
              [userId, reqVal],
            );
            currentProgress = res[0]?.total > 0 ? 1 : 0;
            break;
          }
          case "quests_completed": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM quest_progress
     WHERE user_id = ? AND status = 'completed'`,
              [userId],
            );
            currentProgress = res[0]?.total || 0;
            break;
          }
          case "quiz_passed": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM quiz_attempts
               WHERE user_id = ? AND quiz_id = ? AND won = 1`,
              [userId, reqVal],
            );
            currentProgress = res[0]?.total > 0 ? 1 : 0;
            break;
          }
          case "quizzes_passed": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM quiz_attempts
               WHERE user_id = ? AND won = 1`,
              [userId],
            );
            currentProgress = res[0]?.total || 0;
            break;
          }
          case "streak_days": {
            const [userRows]: any = await db.query(
              "SELECT streak FROM users WHERE id = ?",
              [userId],
            );
            currentProgress = userRows[0]?.streak || 0;
            break;
          }

          case "bugs_fixed": {
            const [res]: any = await db.query(
              `SELECT COUNT(*) AS total FROM coding_submissions WHERE user_id = ? AND category = 'bug_fix' AND status = 'passed'`,
              [userId],
            );
            currentProgress = res[0]?.total || 0;
            break;
          }

          default:
            continue;
        }

        // 3. I-update o i-insert ang progress at is_earned status sa `user_badges` table
        await this.updateBadgeProgress(
          userId,
          badge.id,
          currentProgress,
          target,
        );
      }
    } catch (error) {
      console.error("Error evaluating badges:", error);
    }
  }

  /**
   * Katulong na function para i-save ang progress at awtomatikong i-set ang is_earned = 1
   * kapag naabot na ang target ng user. Kung 0 at hindi pa earned, ide-delete/huwag isave.
   */
  private async updateBadgeProgress(
    userId: string | number,
    badgeId: string,
    currentProgress: number,
    target: number,
  ): Promise<void> {
    const isEarned = currentProgress >= target ? 1 : 0;

    // KUNG WALA PANG PROGRESS (0) AT HINDI PA EARNED, HUWAG ISAVE O TANGGALIN SA DB
    if (currentProgress === 0 && isEarned === 0) {
      await db.query(
        `DELETE FROM user_badges WHERE user_id = ? AND badge_id = ?`,
        [userId, badgeId],
      );
      return;
    }

    const query = `
      INSERT INTO user_badges (user_id, badge_id, progress_current, is_earned, earned_at)
      VALUES (?, ?, ?, ?, IF(? = 1, NOW(), NULL))
      ON DUPLICATE KEY UPDATE
        progress_current = VALUES(progress_current),
        is_earned = GREATEST(is_earned, VALUES(is_earned)),
        earned_at = COALESCE(earned_at, IF(VALUES(is_earned) = 1, NOW(), NULL))
    `;

    await db.query(query, [
      userId,
      badgeId,
      currentProgress,
      isEarned,
      isEarned,
    ]);
  }
}

export default new BadgeEngineService();
