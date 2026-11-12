import { questRepository } from '../../repositories/quest.repository.js';
import pool from '../../config/db.js';
import badgeService from '../badges/badgeEngine.service.js';

export interface UserActionEvent {
  userId: string;
  type: 'lesson' | 'quiz' | 'coding' | 'boss' | 'xp' | 'streak';
  targetId?: string;
  score?: number;
  currentXp?: number;
  streakDays?: number;
}

export const questEngineService = {
  /**
   * Ang Central Evaluator Engine. Tinatawag ito tuwing nakatapos ang user ng activity.
   */
  async evaluateUserQuestProgress(event: UserActionEvent) {
    const { userId, type, targetId, score, streakDays } = event;
    let currentXp = event.currentXp;

    // Kunin ang totoong total XP sa DB kung undefined si currentXp
    if (currentXp === undefined) {
      const [userRows]: any = await pool.query('SELECT total_xp FROM users WHERE id = ?', [userId]);
      if (userRows && userRows.length > 0) {
        currentXp = Number(userRows[0].total_xp || 0);
      }
    }

    // 1. Kunin ang lahat ng active quests at objectives
    const [quests, allObjectives, userCompletedObjIds, userQuestProgress] = await Promise.all([
      questRepository.findAllActiveQuests(),
      questRepository.findAllObjectives(),
      questRepository.findUserCompletedObjectiveIds(userId),
      questRepository.findProgressByUserId(userId)
    ]);

    const completedObjSet = new Set<string>(userCompletedObjIds);
    const userProgressMap = userQuestProgress.reduce((acc, curr) => {
      acc[curr.quest_id] = curr.status;
      return acc;
    }, {} as Record<string, string>);

    // 2. Suriin ang bawat quest
    for (const quest of quests) {
      const questStatus = userProgressMap[quest.id] || 'not_started';

      // Laktawan ang mga quest na tapos na
      if (questStatus === 'completed') continue;

      const questObjectives = allObjectives.filter((obj) => obj.quest_id === quest.id);
      if (questObjectives.length === 0) continue;

      let hasObjectiveUpdated = false;

      // 3. Evaluate ang bawat objective sa quest na ito
      for (const obj of questObjectives) {
        if (completedObjSet.has(obj.id)) continue;

        let isMatch = false;

        if (obj.objective_type === type) {
          if (type === 'lesson' && obj.target_id === targetId) {
            isMatch = true;
          } else if (type === 'quiz' && obj.target_id === targetId) {
            if (!obj.min_score || (score !== undefined && score >= obj.min_score)) {
              isMatch = true;
            }
          } else if (type === 'coding' && obj.target_id === targetId) {
            isMatch = true;
          } else if (type === 'boss' && obj.target_id === targetId) {
            isMatch = true;
          }
        }

        if (obj.objective_type === 'xp' || obj.objective_type === 'xp_requirement') {
          const requiredXp = Number(obj.min_score || obj.target_count || 0);
          if (currentXp !== undefined && currentXp >= requiredXp) {
            isMatch = true;
          }
        }

        if ((obj.objective_type === 'streak' || obj.objective_type === 'streak_requirement') && streakDays !== undefined) {
          const requiredStreak = Number(obj.target_count || obj.min_score || 0);
          if (streakDays >= requiredStreak) {
            isMatch = true;
          }
        }

        if (isMatch) {
          await questRepository.completeUserObjective(userId, obj.id);
          completedObjSet.add(obj.id);
          hasObjectiveUpdated = true;
        }
      }

      // 4. AUTOMATIC START & COMPLETE CHECK:
      if (questStatus === 'not_started' && hasObjectiveUpdated) {
        await questRepository.startQuest(userId, quest.id);
      }

      // Suriin kung ang lahat ng objectives ng quest na ito ay tapos na
      const updatedQuestObjectives = allObjectives.filter((obj) => obj.quest_id === quest.id);
      const allDone = updatedQuestObjectives.every((obj) => completedObjSet.has(obj.id));

      if (allDone && updatedQuestObjectives.length > 0) {
        // 🌟 I-update agad sa database bilang 'completed' ang quest!
        await questRepository.completeQuest(userId, quest.id);
        
        // 🌟 Kusa ring i-trigger ang badge engine para mabigyan ka ng badge agad!
        await badgeService.evaluateBadges(userId);
      }
    }

    return {
      success: true
    };
  }
};