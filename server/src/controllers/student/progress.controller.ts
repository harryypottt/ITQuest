import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import * as progressRepo from "../../repositories/progress.repository.js";
import { progressService } from "../../services/progress/progress.service.js";
import { questEngineService } from "../../services/quest/questEngine.service.js";
import badgeEngineService from "../../services/badges/badgeEngine.service.js"; // 💡 Idinagdag para sa badge evaluation


// GET: Kunin ang lahat ng completed progress ng authenticated student
export const getStudentProgress = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const rawUserId = req.user?.userId;


    if (!rawUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in token",
      });
    }


    const userId = String(rawUserId);
    const rows = await progressRepo.findUserProgressList(userId);


    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Error fetching student progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student progress",
      error: error.message,
    });
  }
};


// POST: Save/Update Lesson Progress at Magbigay ng XP Reward
export const updateStudentProgress = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const rawUserId = req.user?.userId;
    const lessonId = req.body.lessonId || req.body.lesson_id;


    if (!rawUserId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Lesson ID are required",
      });
    }


    const userId = String(rawUserId);
    const targetLessonId = String(lessonId);


    // 1. Suriin kung completed na dati
    const existing = await progressRepo.findUserLessonProgress(
      userId,
      targetLessonId,
    );
    const alreadyCompleted = existing ? Boolean(existing.is_completed) : false;


    // 2. Insert / Update progress
    await progressRepo.upsertLessonProgress(userId, targetLessonId);


    let gainedXP = 0;


    // 3. Magbigay ng XP kung bago pa lang natapos
    if (!alreadyCompleted) {
      gainedXP = await progressRepo.getLessonXpReward(targetLessonId);
      await progressRepo.addXpToUser(userId, gainedXP);
    }


    // 🌟 AUTO-PROGRESS QUEST TRIGGER: Palaging i-evaluate ang quest progress kahit repeat access
    await questEngineService.evaluateUserQuestProgress({
      userId,
      type: "lesson",
      targetId: targetLessonId,
    });


    // Ebalyahin din ang XP progress ng Quest
    console.log("--- TRIGGERING XP EVALUATION FOR USER:", userId);
    await questEngineService.evaluateUserQuestProgress({
      userId,
      type: "xp",
    });

    // 🌟 AUTOMATED BADGE TRIGGER: Suriin at i-update ang badges (lessons & XP)
    await badgeEngineService.evaluateBadges(userId);


    return res.status(200).json({
      success: true,
      message: alreadyCompleted
        ? "Lesson progress updated"
        : "Lesson completed and XP awarded!",
      gainedXP,
      alreadyCompleted,
    });
  } catch (error: any) {
    console.error("DATABASE ERROR in updateStudentProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update student progress",
      error: error.message,
    });
  }
};