import bossRepository from '../../repositories/boss.repository.js';

export class BossService {
  // 1. Kumuha at mag-format ng lahat ng bosses
  async getAllBosses() {
    const bosses = await bossRepository.findAllBosses();

    for (const boss of bosses) {
      const questions = await bossRepository.findQuestionsByBossId(boss.id);
      boss.questions = questions.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correctAnswer: q.correct_answer,
        timeLimit: q.time_limit,
      }));
      boss.badgeReward = { name: boss.badge_name, rarity: boss.badge_rarity };
      boss.xpReward = boss.xp_reward;
    }

    return bosses;
  }

  // 2. Kumuha at mag-format ng isang boss gamit ang ID
  async getBossById(id: string) {
    const boss = await bossRepository.findBossById(id);

    if (!boss) {
      return null;
    }

    const questions = await bossRepository.findQuestionsByBossId(id);
    boss.questions = questions.map((q: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correctAnswer: q.correct_answer,
      timeLimit: q.time_limit,
    }));
    boss.badgeReward = { name: boss.badge_name, rarity: boss.badge_rarity };
    boss.xpReward = boss.xp_reward;

    return boss;
  }

  // 3. I-process at i-save ang Boss Battle Attempt at XP updates
  async processBossAttempt(
    studentId: number | string,
    bossId: string,
    passed: boolean,
    xpEarned: number,
    bossHpRemaining: number
  ) {
    const attemptId = await bossRepository.createAttempt(
      studentId,
      bossId,
      passed,
      xpEarned,
      bossHpRemaining
    );

    if (passed && xpEarned > 0) {
      await bossRepository.addStudentXp(studentId, xpEarned);
    }

    return { attemptId, passed, xpEarned };
  }
}

export default new BossService();