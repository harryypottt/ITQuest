import quizRepository from "../../repositories/quiz.repository.js";

export class QuizService {
  private parseOptions(optionsRaw: any): string[] {
    if (!optionsRaw) return [];
    if (Array.isArray(optionsRaw)) return optionsRaw;
    if (typeof optionsRaw === "string") {
      const trimmed = optionsRaw.trim();
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        try {
          return JSON.parse(trimmed);
        } catch {}
      }
      return trimmed
        .split("\n")
        .map((opt) => opt.trim())
        .filter(Boolean);
    }
    return [];
  }

  private parseMatchPairs(rawPairs: any) {
    if (!rawPairs) return undefined;
    if (Array.isArray(rawPairs)) return rawPairs;
    if (typeof rawPairs === "string") {
      const trimmed = rawPairs.trim();
      if (trimmed.startsWith("[")) {
        try {
          return JSON.parse(trimmed);
        } catch {}
      }
      return trimmed
        .split("\n")
        .map((line) => {
          const parts = line.split("::").map((s) => s.trim());
          if (parts.length >= 2) {
            return { left: parts[0], right: parts[1] };
          }
          return null;
        })
        .filter(Boolean);
    }
    return undefined;
  }

  private formatQuestion(q: any) {
    return {
      id: q.id,
      quizId: q.quiz_id || q.boss_id,
      orderIndex: q.order_index || 1,
      type: q.type || "mcq",
      question: q.question,
      options: this.parseOptions(q.options),
      correctAnswer: q.correct_answer,
      explanation: q.explanation || "",
      points: Number(q.points) || 10,
      topic: q.topic || "General",
      category: q.category || "General",
      codeSnippet: q.code_snippet || null,
      codeLanguage: q.code_language || null,
      matchPairs: this.parseMatchPairs(q.match_pairs),
      timeLimit: Number(q.time_limit) || 20,
    };
  }

  async getAllQuizzes(type?: string) {
    const quizzes = await quizRepository.findAllQuizzes(type);
    return quizzes.map((q: any) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      category: q.category,
      difficulty: Number(q.difficulty),
      xpReward: Number(q.xp_reward),
      timeLimit: Number(q.time_limit),
      passingScore: Number(q.passing_score),
      questionCount: Number(q.question_count),
      type: q.type,
      minPlayers: q.min_players,
      maxPlayers: q.max_players,
      badgeReward: q.badge_reward,
      createdBy: q.created_by,
      creatorName: q.creator_name,
    }));
  }

  async getQuizById(id: string, userId?: string) {
    const quiz = await quizRepository.findQuizById(id);
    if (!quiz) return null;

    const rawQuestions = await quizRepository.findQuestionsByQuizId(id);
    const questions = rawQuestions.map((q: any) => this.formatQuestion(q));

    let attempts = [];
    if (userId) {
      attempts = await quizRepository.findUserAttempts(userId, id);
    }

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: Number(quiz.difficulty),
      xpReward: Number(quiz.xp_reward),
      timeLimit: Number(quiz.time_limit),
      passingScore: Number(quiz.passing_score),
      questionCount: Number(quiz.question_count),
      type: quiz.type,
      badgeReward: quiz.badge_reward,
      questions,
      attempts,
    };
  }

  async verifyGamePin(pin: string) {
    const quiz = await quizRepository.findQuizByPin(pin);
    if (!quiz) return null;
    return this.getQuizById(quiz.id);
  }

  async createCustomQuiz(userId: string, quizPayload: any) {
    const quizId = quizPayload.id || `quiz_${Date.now()}`;
    const newQuizData = {
      ...quizPayload,
      id: quizId,
      createdBy: userId,
      questionCount: Array.isArray(quizPayload.questions)
        ? quizPayload.questions.length
        : 0,
    };

    await quizRepository.createQuiz(newQuizData);
    if (
      Array.isArray(quizPayload.questions) &&
      quizPayload.questions.length > 0
    ) {
      await quizRepository.createQuestions(quizId, quizPayload.questions);
    }

    return this.getQuizById(quizId, userId);
  }

  async getBossById(id: string) {
    const boss = await quizRepository.findBossById(id);
    if (!boss) return null;

    const rawQuestions = await quizRepository.findQuestionsByBossId(id);
    const questions = rawQuestions.map((q: any) => this.formatQuestion(q));

    return {
      id: boss.id,
      name: boss.name,
      title: boss.title,
      avatar: boss.avatar,
      level: Number(boss.level),
      hp: Number(boss.hp),
      element: boss.element,
      description: boss.description,
      xpReward: Number(boss.xp_reward),
      badgeName: boss.badge_name,
      badgeRarity: boss.badge_rarity,
      unlockLevel: Number(boss.unlock_level),
      questions,
    };
  }

  async recordAttempt(userId: string, quizId: string, payload: any) {
    const quiz = await quizRepository.findQuizById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    const previousAttemptCount = await quizRepository.countUserAttempts(
      userId,
      quizId,
    );
    const percentage =
      Number(payload.percentage) ||
      Math.round((payload.score / (payload.totalQuestions * 10)) * 100);
    const won = percentage >= Number(quiz.passing_score || 60);

    const totalQuestions = payload.totalQuestions || quiz.question_count || 8;
    const correctCount =
      payload.correctCount ?? Math.round((percentage / 100) * totalQuestions);
    const timeTaken = Number(payload.timeTaken) || 0;

    const baseXP = correctCount * 15;
    const speedBonus =
      timeTaken > 0 && timeTaken < 60 ? 50 : timeTaken < 120 ? 20 : 0;
    const passingBonus = won ? 100 : 0;
    const perfectBonus = percentage === 100 ? 50 : 0;
    const totalXPEarned = baseXP + speedBonus + passingBonus + perfectBonus;

    const attemptType = payload.attemptType || quiz.type || "solo";
    const isRanked = attemptType === "ranked" || quiz.type === "battle";

    let userProgress = {
      newTotalXP: 0,
      level: 1,
      isLevelUp: false,
      currentLevelXP: 0,
      xpRequiredForNextLevel: 500,
      rpChange: null as number | null,
      currentRP: 0,
    };

    if (typeof quizRepository.updateUserXpAndLevel === "function") {
      userProgress = await quizRepository.updateUserXpAndLevel(
        userId,
        totalXPEarned,
        isRanked,
        won,
      );
    }
    const attemptId = await quizRepository.createQuizAttempt({
      userId,
      quizId,
      score: payload.score || 0,
      totalQuestions,
      percentage,
      won,
      attemptType,
      category: quiz.category || "General",
      attemptNumber: previousAttemptCount + 1,
      xpEarned: totalXPEarned,
    });

    return {
      attemptId,
      percentage,
      won,
      xpEarned: totalXPEarned,
      xpBreakdown: {
        base: baseXP,
        speedBonus,
        passingBonus,
        perfectBonus,
      },
      ...userProgress,
    };
  }

  // 🟢 MASTERY SERVICE FUNCTION
  async getMastery(userId: string) {
    const categories = await quizRepository.getCategoryAccuracy(userId);
    const topics = await quizRepository.getTopicMastery(userId);

    return {
      categories: categories || [],
      topics: topics || [],
    };
  }

  // 🟢 REVIEW PLAN SERVICE FUNCTION
  async getReviewPlan(userId: string) {
    const recommendations = await quizRepository.getRecommendedReviews(userId);
    return recommendations || [];
  }
  // 🟢 QUEST LINKS SERVICE FUNCTION
  async getQuestLinks(userId: string) {
    const links = await quizRepository.findQuestLinks(userId);
    return links || [];
  } 

  async claimQuestReward(userId: string, questId: string) {
    return await quizRepository.claimQuestReward(userId, questId);
  }

  async getUserHeaderStats(userId: string) {
    return await quizRepository.getUserHeaderStats(userId);
  }
}

export default new QuizService();