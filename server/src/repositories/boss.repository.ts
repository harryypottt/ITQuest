const db = require('../config/db.js');

export class BossRepository {
  // 1. Kunin ang lahat ng Bosses
  async findAllBosses() {
    const [rows] = await db.query('SELECT * FROM bosses ORDER BY level ASC');
    return rows;
  }

  // 2. Kunin ang isang Boss gamit ang ID
  async findBossById(bossId: string) {
    const [rows] = await db.query('SELECT * FROM bosses WHERE id = ?', [bossId]);
    return rows[0] || null;
  }

  // 3. Kunin ang lahat ng Questions ng isang Boss
  async findQuestionsByBossId(bossId: string) {
    const [rows] = await db.query('SELECT * FROM boss_questions WHERE boss_id = ?', [bossId]);
    return rows;
  }

  // 4. I-record ang Boss Battle attempt ng student
  async createAttempt(
    studentId: number | string,
    bossId: string,
    passed: boolean,
    xpEarned: number,
    bossHpRemaining: number
  ) {
    const [result] = await db.query(
      `INSERT INTO boss_attempts (student_id, boss_id, passed, xp_earned, boss_hp_remaining, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [studentId, bossId, passed ? 1 : 0, xpEarned, bossHpRemaining]
    );
    return result.insertId;
  }

  // 5. Dagdagan ang XP ng Student sa database
  async addStudentXp(studentId: number | string, xpEarned: number) {
    const [result] = await db.query(
      `UPDATE students SET xp = xp + ? WHERE id = ?`,
      [xpEarned, studentId]
    );
    return result;
  }
}

export default new BossRepository();