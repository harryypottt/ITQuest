import { questRepository } from '../../repositories/quest.repository.js';

const parseArrayField = (value: string | null | undefined): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
};

export const questService = {
  /**
   * Fetch at i-format ang lahat ng active quests kasama ang objectives at progress ng user
   */
  async getAllQuests(userId?: string) {
    // 1. Fetch active quests at objectives
    const [quests, objectives] = await Promise.all([
      questRepository.findAllActiveQuests(),
      questRepository.findAllObjectives()
    ]);

    let userProgressMap: Record<string, string> = {};
    let completedObjSet = new Set<string>();

    // 2. Fetch user progress at completed objectives kung may logged-in user
    if (userId) {
      const [userProgress, completedObjIds] = await Promise.all([
        questRepository.findProgressByUserId(userId),
        questRepository.findUserCompletedObjectiveIds(userId)
      ]);

      userProgressMap = userProgress.reduce((acc, curr) => {
        if (curr.quest_id) acc[curr.quest_id] = curr.status;
        return acc;
      }, {} as Record<string, string>);

      completedObjSet = new Set(completedObjIds);
    }

    // 3. Map at i-format ang bawat quest
    return quests.map((quest) => {
      // 🌟 Dito itinalaga ang questStatus
      const questStatus = userProgressMap[quest.id] || 'not_started';
      const questObjs = objectives.filter((obj) => obj.quest_id === quest.id);

      const formattedObjectives = questObjs.map((obj) => ({
        id: obj.id,
        description: obj.description,
        objectiveType: obj.objective_type,
        targetId: obj.target_id,
        targetCount: obj.target_count,
        minScore: obj.min_score,
        orderIndex: obj.order_index,
        redirectRoute: obj.redirect_route,
        redirectLabel: obj.redirect_label,
        objectiveTitle: obj.objective_title,
        contentName: obj.content_name,
        isCompleted: completedObjSet.has(obj.id)
      }));

      const completedCount = formattedObjectives.filter((o) => o.isCompleted).length;
      const totalCount = formattedObjectives.length;
      const progressPercent = questStatus === 'completed'
        ? 100
        : totalCount > 0
          ? Math.round((completedCount / totalCount) * 100)
          : 0;

      return {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        storyText: quest.story_text,
        type: quest.type,
        difficulty: quest.difficulty,
        xpReward: quest.xp_reward,
        badgeReward: quest.badge_name
          ? { name: quest.badge_name, rarity: quest.badge_rarity }
          : null,
        category: quest.category,
        categoryName: quest.category_name,
        region: quest.region,
        icon: quest.icon,
        estimatedMinutes: quest.estimated_minutes,
        completionHint: quest.completion_hint,
        chainId: quest.chain_id,
        chainPosition: quest.chain_position,
        unlocksQuestIds: parseArrayField(quest.unlocks_quest_ids),
        requiresQuestIds: parseArrayField(quest.requires_quest_ids),
        rarity: quest.rarity,
        tags: quest.tags ? quest.tags.split(',') : [],
        isHidden: Boolean(quest.is_hidden),
        hiddenCondition: quest.hidden_condition,
        isActive: Boolean(quest.is_active),
        status: questStatus,
        progressPercent,
        completedCount,
        totalCount,
        objectives: formattedObjectives
      };
    });
  },

  /**
   * Simulan ang quest ('in_progress')
   */
  async startQuest(userId: string, questId: string) {
    await questRepository.startQuest(userId, questId);
    return true;
  },

  /**
   * Tapusin ang quest ('completed')
   */
  async completeQuest(userId: string, questId: string) {
    await questRepository.completeQuest(userId, questId);
    console.log(`[Quest Engine] Quest ${questId} completed for user ${userId}`);
    return true;
  }
};