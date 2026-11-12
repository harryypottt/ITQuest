import { Request, Response } from 'express';
import quizService from '../../services/quiz/quiz.service.js';
import { questEngineService } from '../../services/quest/questEngine.service.js';
import badgeEngineService from '../../services/badges/badgeEngine.service.js'; // 💡 Idinagdag para sa badge evaluation
import db from '../../config/db.js';

// 💡 Helper function para siguradong makuha ang User ID mula sa JWT Auth Middleware
const getAuthUserId = (req: Request): string | null => {
  const user = (req as any).user;
  if (!user) return null;
  return user.id || user.userId || user._id || null;
};

/**
 * 🌟 Function para i-award ang Quiz Achievement/Badge direkta sa user_badges table
 */
export async function awardQuizAchievement(userId: string | number, achievementId: string) {
  try {
    const query = `
      INSERT INTO user_badges (user_id, badge_id, is_earned, earned_at, progress_current)
      VALUES (?, ?, 1, NOW(), 1)
      ON DUPLICATE KEY UPDATE 
        is_earned = 1, 
        earned_at = COALESCE(earned_at, NOW()),
        progress_current = 1
    `;
    
    await db.query(query, [userId, achievementId]);
    console.log(`Successfully awarded badge/achievement ${achievementId} to user ${userId}`);
  } catch (error) {
    console.error('Error awarding quiz achievement to user_badges:', error);
    throw error;
  }
}


// GET: /api/student/quizzes
export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const quizzes = await quizService.getAllQuizzes(type);
    return res.json({ success: true, quizzes, data: quizzes });
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    return res.status(500).json({ success: false, message: 'Database query failed' });
  }
};


// GET: /api/student/quizzes/:id
export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getAuthUserId(req);
    const quiz = await quizService.getQuizById(id, userId || undefined);


    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }


    return res.json({ success: true, quiz, attempts: quiz.attempts });
  } catch (error) {
    console.error('Fetch quiz by ID error:', error);
    return res.status(500).json({ success: false, message: 'Database query failed' });
  }
};


// GET: /api/student/bosses/:id
export const getBossById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const boss = await quizService.getBossById(id);


    if (!boss) {
      return res.status(404).json({ success: false, message: 'Boss entity not found' });
    }


    return res.json({ success: true, boss });
  } catch (error) {
    console.error('Fetch boss by ID error:', error);
    return res.status(500).json({ success: false, message: 'Database query failed' });
  }
};


// POST: /api/student/quizzes/join-by-pin
export const joinByPin = async (req: Request, res: Response) => {
  try {
    const { pin } = req.body;
    const quiz = await quizService.verifyGamePin(pin);


    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Invalid 6-Digit Game PIN' });
    }


    return res.json({ success: true, quiz });
  } catch (error) {
    console.error('Join pin error:', error);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
};


// POST: /api/student/quizzes
export const createCustomQuiz = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user logged in' });
    }
    const quiz = await quizService.createCustomQuiz(userId, req.body);
    return res.json({ success: true, quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create assessment' });
  }
};


// POST: /api/student/quizzes/:id/attempt
export const submitQuizAttempt = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req) || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User session not found' });
    }
    const quizId = req.params.id;


    // 1. Record Quiz Attempt
    const result = await quizService.recordAttempt(userId, quizId, req.body);


    // 2. Kuhanin ang nakuha niyang Score/Percentage
    const userScore = Number(
      (result as any)?.scorePercentage ??
      (result as any)?.percentage ??
      (result as any)?.score ??
      req.body?.scorePercentage ??
      req.body?.percentage ??
      req.body?.score ??
      0
    );


    // 🌟 Halimbawa ng pag-award ng badge kapag nakakuha ng 100% (Perfect Accuracy)
    if (userScore === 100) {
      await awardQuizAchievement(userId, 'perfect-accuracy');
    }


    // 🌟 AUTO-PROGRESS QUEST TRIGGER: Ebalyahin ang Quests pagkatapos mag-submit ng quiz!
    await questEngineService.evaluateUserQuestProgress({
      userId,
      type: 'quiz',
      targetId: quizId,
      score: userScore
    });

    // 🌟 AUTOMATED BADGE TRIGGER: Suriin at i-update ang badges pagkatapos mag-quiz!
    await badgeEngineService.evaluateBadges(userId);


    return res.json({ success: true, message: 'Attempt saved to quiz_attempts', data: result });
  } catch (error) {
    console.error('Submit attempt error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record attempt' });
  }
};


// GET: /api/student/mastery
export const getMastery = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User session not found' });
    }
    const masteryData = await quizService.getMastery(userId);
    return res.json({ success: true, ...masteryData });
  } catch (error) {
    console.error('Fetch mastery error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch mastery metrics' });
  }
};


// GET: /api/student/review-plan
export const getReviewPlan = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User session not found' });
    }
    const recommendations = await quizService.getReviewPlan(userId);
    return res.json({ success: true, recommendations });
  } catch (error) {
    console.error('Fetch review plan error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch review plan' });
  }
};


// GET: /api/student/quest-links
export const getQuestLinks = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User session not found' });
    }
    const questLinks = await quizService.getQuestLinks(userId);
    return res.json({ success: true, questLinks });
  } catch (error: any) {
    console.error('Fetch quest links error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quest links',
      error: error?.message || 'Database query error'
    });
  }
};


// POST: /api/student/quest-links/:id/claim
export const claimQuestReward = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    const result = await quizService.claimQuestReward(userId, id);
    return res.json({ success: true, message: 'Reward claimed successfully!', data: result });
  } catch (error) {
    console.error('Claim quest reward error:', error);
    return res.status(500).json({ success: false, message: 'Failed to claim reward' });
  }
};


// GET: /api/student/header-stats
export const getUserHeaderStats = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const stats = await quizService.getUserHeaderStats(userId);
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('Fetch header stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch header stats' });
  }
};
