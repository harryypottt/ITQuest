import pool from '../config/db.js';

interface SubmissionPayload {
  userId: string | number;
  challengeId: string | number;
  status: 'passed' | 'failed';
  testsPassed: number;
  testsTotal: number;
  submittedCode?: string;
  xpReward?: number;
}

export const submitChallengeSolution = async (userId: string | number, rawChallengeId: string | number, {
  status, testsPassed, testsTotal, submittedCode = '', xpReward = 50
}: SubmissionPayload) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const cleanId = String(rawChallengeId).replace(/[^0-9]/g, '');
    const challengeId = cleanId ? cleanId : rawChallengeId;

    const [challenges] = await connection.query(
      `SELECT * FROM coding_challenges WHERE id = ? OR id = ?`,
      [challengeId, rawChallengeId]
    );
    const challenge = (challenges as any[])[0];
    const actualChallengeId = challenge ? challenge.id : rawChallengeId;
    const rewardXP = challenge?.xp_reward ?? xpReward;
    const isPassed = status === 'passed' && testsPassed === testsTotal;

    const [existing] = await connection.query(
      `SELECT * FROM coding_submissions WHERE challenge_id = ? AND user_id = ?`,
      [actualChallengeId, userId]
    );
    const existingRows = existing as any[];
    let isFirstCompletion = false;

    if (existingRows.length === 0) {
      const submissionId = `sub-${actualChallengeId}-${userId}-${Date.now()}`;
      if (isPassed) {
        isFirstCompletion = true;
      }
      await connection.query(
        `INSERT INTO coding_submissions 
         (id, user_id, challenge_id, challenge_title, category, difficulty, status, attempts, best_score, last_attempted_at, xp_awarded, tests_passed, tests_total, submitted_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), ?, ?, ?, ?)`,
        [
          submissionId,
          userId,
          actualChallengeId,
          challenge?.title || 'Coding Challenge',
          challenge?.category || 'JavaScript',
          challenge?.difficulty || 1,
          isPassed ? 'passed' : 'failed',
          isPassed ? 100 : Math.round((testsPassed / (testsTotal || 1)) * 100),
          isPassed ? rewardXP : 0,
          testsPassed,
          testsTotal,
          submittedCode
        ]
      );
    } else {
      const currentSub = existingRows[0];
      const previouslyPassed = currentSub.status === 'passed';
      if (!previouslyPassed && isPassed) {
        isFirstCompletion = true;
      }
      const newBestScore = Math.max(
        currentSub.best_score || 0,
        isPassed ? 100 : Math.round((testsPassed / (testsTotal || 1)) * 100)
      );
      await connection.query(
        `UPDATE coding_submissions 
         SET status = IF(status = 'passed', 'passed', ?),
             attempts = attempts + 1,
             best_score = ?,
             last_attempted_at = NOW(),
             xp_awarded = IF(status = 'passed', xp_awarded, ?),
             tests_passed = GREATEST(tests_passed, ?),
             tests_total = ?,
             submitted_code = ?
         WHERE challenge_id = ? AND user_id = ?`,
        [
          isPassed ? 'passed' : 'failed',
          newBestScore,
          isPassed ? rewardXP : 0,
          testsPassed,
          testsTotal,
          submittedCode,
          actualChallengeId,
          userId
        ]
      );
    }

    if (isFirstCompletion && rewardXP > 0) {
      await connection.query(
        `UPDATE users SET total_xp = COALESCE(total_xp, 0) + ? WHERE id = ?`,
        [rewardXP, userId]
      );
    }

    await connection.commit();
    return { success: true, isFirstCompletion, xpAwarded: isFirstCompletion ? rewardXP : 0 };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};