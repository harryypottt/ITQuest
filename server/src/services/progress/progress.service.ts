import * as progressRepo from '../../repositories/progress.repository.js';

export const progressService = {
  // Fetch student's overall progress
  async getStudentProgress(userId: string) {
    return await progressRepo.findUserProgressList(userId);
  },

  // Process lesson completion and handle XP rewards logic
  async updateProgressAndAwardXp(userId: string, lessonId: string) {
    // 1. Check kung natapos na ang lesson bago ito i-upsert
    const existing = await progressRepo.findUserLessonProgress(userId, lessonId);
    const alreadyCompleted = existing ? Boolean(existing.is_completed) : false;

    // 2. Save or update the lesson progress
    await progressRepo.upsertLessonProgress(userId, lessonId);

    let gainedXP = 0;

    // 3. XP reward logic (award XP kung ngayon pa lang natapos)
    if (!alreadyCompleted) {
      gainedXP = await progressRepo.getLessonXpReward(lessonId);
      if (gainedXP > 0) {
        await progressRepo.addXpToUser(userId, gainedXP);
      }
    }

    return {
      alreadyCompleted,
      gainedXP,
    };
  },
};