import { Response } from 'express';
import pool from '../../config/db.js';
import { submitChallengeSolution } from '../../repositories/coding.repository.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { questEngineService } from '../../services/quest/questEngine.service.js';
import badgeEngineService from '../../services/badges/badgeEngine.service.js';


export const getCodingChallenges = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as any;
    const userId = user?.userId || user?.id || user?.user_id;
    const [rows] = await pool.query(
      `SELECT c.*,
              s.status AS submission_status,
              s.submitted_code,
              s.tests_passed,
              s.tests_total,
              IF(s.status = 'passed' OR s.status = 'COMPLETED', true, false) AS is_completed
       FROM coding_challenges c
       LEFT JOIN coding_submissions s
         ON c.id = s.challenge_id AND s.user_id = ?`,
      [userId]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};


export const getCodingChallenge = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as any;
    const userId = user?.userId || user?.id || user?.user_id;
    const { id } = req.params;
    const [challenges] = await pool.query(
      `SELECT c.*,
              s.status AS submission_status,
              s.submitted_code,
              s.tests_passed,
              s.tests_total,
              IF(s.status = 'passed' OR s.status = 'COMPLETED', true, false) AS is_completed
       FROM coding_challenges c
       LEFT JOIN coding_submissions s
         ON c.id = s.challenge_id AND s.user_id = ?
       WHERE c.id = ?`,
      [userId, id]
    );
    const challenge = (challenges as any[])[0];
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    const [files] = await pool.query(`SELECT * FROM coding_files WHERE challenge_id = ?`, [id]);
    const [testCases] = await pool.query(`SELECT * FROM coding_test_cases WHERE challenge_id = ?`, [id]);
    return res.status(200).json({
      success: true,
      data: { ...challenge, files, testCases }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};


export const submitCodingChallenge = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user as any;
    const userId = user?.userId || user?.id || user?.user_id;
    const { id: challengeId } = req.params;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User missing' });
    }
    let submittedCode = '';
    const rawCode = req.body.submittedCode ?? req.body.submitted_code ?? req.body.code;
    if (typeof rawCode === 'object' && rawCode !== null) {
      const keys = Object.keys(rawCode);
      submittedCode = keys.length > 0 ? String(rawCode[keys[0]] || '') : JSON.stringify(rawCode);
    } else {
      submittedCode = String(rawCode ?? '');
    }
    const statusInput = req.body.status || 'passed';
    const testsPassed = Number(req.body.testsPassed ?? req.body.tests_total ?? 4);
    const testsTotal = Number(req.body.testsTotal ?? req.body.tests_total ?? 4);
    const xpReward = Number(req.body.xpReward ?? req.body.xp_reward ?? 50);
    const isPassed = testsPassed === testsTotal || statusInput === 'passed';
   
    const result = await submitChallengeSolution(userId, challengeId, {
      userId,
      challengeId,
      status: isPassed ? 'passed' : 'failed',
      testsPassed,
      testsTotal,
      submittedCode,
      xpReward
    });


    if (isPassed) {
      await questEngineService.evaluateUserQuestProgress({
        userId,
        type: 'coding',
        targetId: challengeId
      });

      // 🌟 AUTOMATED BADGE TRIGGER: Suriin at i-update ang coding badges
      await badgeEngineService.evaluateBadges(userId);
    }


    return res.status(200).json({
      success: true,
      message: 'Challenge submitted successfully',
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};