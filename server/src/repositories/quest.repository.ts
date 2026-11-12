import pool from "../config/db.js";
import { RowDataPacket } from "mysql2";

// ==========================================
// INTERFACES / DATA MODELS
// ==========================================

export interface QuestRow extends RowDataPacket {
  id: string;
  title: string;
  description: string | null;
  story_text: string | null;
  type: string;
  difficulty: number | null;
  xp_reward: number | null;
  badge_name: string | null;
  badge_rarity: string | null;
  category: string | null;
  category_name: string | null;
  region: string | null;
  icon: string | null;
  estimated_minutes: number | null;
  completion_hint: string | null;
  chain_id: string | null;
  chain_position: number | null;
  unlocks_quest_ids: string | null;
  requires_quest_ids: string | null;
  rarity: string | null;
  tags: string | null;
  is_hidden: number | null;
  hidden_condition: string | null;
  is_active: number | null;
}

export interface QuestObjectiveRow extends RowDataPacket {
  id: string;
  quest_id: string;
  description: string;
  objective_type: string | null;
  target_id: string | null;
  target_count: number | null;
  min_score: number | null;
  order_index: number;
  redirect_route: string | null;
  redirect_label: string | null;
  objective_title: string | null;
  content_name: string | null;
}

export interface QuestProgressRow extends RowDataPacket {
  id: number;
  user_id: string;
  quest_id: string;
  status: string;
  started_at: Date | null;
  completed_at: Date | null;
}

// ==========================================
// UNIFIED QUEST REPOSITORY
// ==========================================

export const questRepository = {
  // ------------------------------------------
  // 1. QUEST METHODS
  // ------------------------------------------

  /**
   * Kunin ang lahat ng active quests
   */
  async findAllActiveQuests(): Promise<QuestRow[]> {
    const [rows] = await pool.query<QuestRow[]>(
      "SELECT * FROM quests WHERE is_active = 1 ORDER BY chain_position ASC, id ASC",
    );
    return rows;
  },

  /**
   * Kunin ang isang specific quest gamit ang ID
   */
  async findQuestById(questId: string): Promise<QuestRow | null> {
    const [rows] = await pool.query<QuestRow[]>(
      "SELECT * FROM quests WHERE id = ?",
      [questId],
    );
    return rows.length ? rows[0] : null;
  },

  // ------------------------------------------
  // 2. QUEST OBJECTIVE METHODS
  // ------------------------------------------

  /**
   * Kunin ang lahat ng objectives sa database
   */
  async findAllObjectives(): Promise<QuestObjectiveRow[]> {
    const [rows] = await pool.query<QuestObjectiveRow[]>(
      "SELECT * FROM quest_objectives ORDER BY order_index ASC",
    );
    return rows;
  },

  /**
   * Kunin ang objectives para sa isang specific quest
   */
  async findObjectivesByQuestId(questId: string): Promise<QuestObjectiveRow[]> {
    const [rows] = await pool.query<QuestObjectiveRow[]>(
      "SELECT * FROM quest_objectives WHERE quest_id = ? ORDER BY order_index ASC",
      [questId],
    );
    return rows;
  },

  // ------------------------------------------
  // 3. QUEST PROGRESS METHODS
  // ------------------------------------------

  /**
   * Kunin ang lahat ng quest progress records ng isang user
   */
  async findProgressByUserId(userId: string): Promise<QuestProgressRow[]> {
    const [rows] = await pool.query<QuestProgressRow[]>(
      "SELECT * FROM quest_progress WHERE user_id = ?",
      [userId],
    );
    return rows;
  },

  /**
   * Suriin ang progress sa specific quest ng user
   */
  async findProgressByUserAndQuest(
    userId: string,
    questId: string,
  ): Promise<QuestProgressRow | null> {
    const [rows] = await pool.query<QuestProgressRow[]>(
      "SELECT * FROM quest_progress WHERE user_id = ? AND quest_id = ?",
      [userId, questId],
    );
    return rows.length ? rows[0] : null;
  },

  /**
   * Simulan ang quest ('in_progress')
   */
  async startQuest(userId: string, questId: string): Promise<void> {
    const query = `
      INSERT INTO quest_progress (user_id, quest_id, status, started_at)
      VALUES (?, ?, 'in_progress', NOW())
      ON DUPLICATE KEY UPDATE status = 'in_progress', started_at = COALESCE(started_at, NOW())
    `;
    await pool.query(query, [userId, questId]);
  },

  /**
   * Tapusin ang quest ('completed')
   */
  async completeQuest(userId: string, questId: string) {
    const query = `
      INSERT INTO quest_progress (user_id, quest_id, status, completed_at)
      VALUES (?, ?, 'completed', NOW())
      ON DUPLICATE KEY UPDATE 
        status = 'completed',
        completed_at = COALESCE(completed_at, NOW())
    `;
    return await pool.query(query, [userId, questId]);
  },
  // Idagdag sa loob ng questRepository object sa quest.repository.ts:

  /**
   * Kunin ang lahat ng completed objective IDs ng isang user
   */
  async findUserCompletedObjectiveIds(userId: string): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT objective_id FROM user_quest_objectives WHERE user_id = ? AND is_completed = 1",
      [userId],
    );
    return rows.map((r) => r.objective_id);
  },

  /**
   * Lagyan ng check (mark as complete) ang isang objective ng user
   */
  async completeUserObjective(
    userId: string,
    objectiveId: string,
  ): Promise<void> {
    const query = `
    INSERT INTO user_quest_objectives (user_id, objective_id, is_completed, completed_at)
    VALUES (?, ?, 1, NOW())
    ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = COALESCE(completed_at, NOW())
  `;
    await pool.query(query, [userId, objectiveId]);
  },

  /**
   * Dagdagan ang XP ng user sa kanyang profile/user table
   */
  /**
   * Dagdagan ang XP ng user sa kanyang profile/user table
   */
  async awardUserXp(userId: string, xpAmount: number) {
    const query =
      "UPDATE users SET total_xp = COALESCE(total_xp, 0) + ? WHERE id = ?";
    await pool.query(query, [xpAmount, userId]);
  },
};

// Backwards compatibility / alias exports para sa mga umiiral nang imports
export const questObjectiveRepository = {
  findAllObjectives: questRepository.findAllObjectives,
  findObjectivesByQuestId: questRepository.findObjectivesByQuestId,
};

export const questProgressRepository = {
  findByUserId: questRepository.findProgressByUserId,
  findByUserAndQuest: questRepository.findProgressByUserAndQuest,
  startQuest: questRepository.startQuest,
  completeQuest: questRepository.completeQuest,
};
