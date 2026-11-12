import { Request, Response } from "express";
import { questService } from "../../services/quest/quest.service.js";
import { questEngineService } from "../../services/quest/questEngine.service.js";
import badgeEngineService from "../../services/badges/badgeEngine.service.js";

export const questController = {
  /**
   * GET /api/student/quests
   * Kunin ang lahat ng quests na naka-align sa user progress
   */
  async getAllQuests(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;

      const formattedQuests = await questService.getAllQuests(userId);

      return res.status(200).json({
        success: true,
        count: formattedQuests.length,
        data: formattedQuests,
      });
    } catch (error: any) {
      console.error("Error in getAllQuests:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch quests",
        error: error.message,
      });
    }
  },

  /**
   * POST /api/student/quests/:id/start
   * Simulan ang isang quest
   */
  async startQuest(req: Request, res: Response) {
    try {
      const { id: questId } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      await questService.startQuest(userId, questId);

      // 🌟 I-trigger ang Quest Engine para masuri ang progreso
      await questEngineService.evaluateUserQuestProgress({
        userId,
        type: "lesson", // O depende sa aktibidad
      });

      return res.status(200).json({
        success: true,
        message: "Quest started successfully",
        questId,
      });
    } catch (error: any) {
      console.error("Error in startQuest:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to start quest",
        error: error.message,
      });
    }
  },

  async completeQuest(req: Request, res: Response) {
    try {
      const { id: questId } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      // 🌟 Direktang i-complete sa database at i-trigger ang engines
      await questService.completeQuest(userId, questId);

      await questEngineService.evaluateUserQuestProgress({
        userId,
        type: "lesson",
      });

      await badgeEngineService.evaluateBadges(userId);

      return res.status(200).json({
        success: true,
        message: "Quest completed successfully",
        questId,
      });
    } catch (error: any) {
      console.error("Error in completeQuest:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to complete quest",
        error: error.message,
      });
    }
  },
};
