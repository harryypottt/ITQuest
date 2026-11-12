import db from "../config/db.js";

export class QuizRepository {
  // --- QUIZZES ---
  async findAllQuizzes(type?: string) {
    let query = 'SELECT * FROM quizzes WHERE status = "published"';
    const params: any[] = [];

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    query += " ORDER BY created_at DESC";

    const [rows] = (await db.query(query, params)) as [any[], any];
    return rows;
  }

  async findQuizById(id: string) {
    const [rows] = (await db.query("SELECT * FROM quizzes WHERE id = ?", [
      id,
    ])) as [any[], any];
    return rows[0] || null;
  }

  async findQuizByPin(pin: string) {
    const [rows] = (await db.query(
      "SELECT * FROM quizzes WHERE pin = ? OR id = ?",
      [pin, pin],
    )) as [any[], any];
    return rows[0] || null;
  }

  async findQuestionsByQuizId(quizId: string) {
    const [rows] = (await db.query(
      "SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY order_index ASC",
      [quizId],
    )) as [any[], any];
    return rows;
  }

  async createQuiz(quizData: any) {
    const {
      id,
      title,
      description,
      category,
      difficulty,
      xpReward,
      timeLimit,
      passingScore,
      questionCount,
      type,
      badgeReward,
      createdBy,
      creatorName,
    } = quizData;

    await db.query(
      `INSERT INTO quizzes
       (id, title, description, category, difficulty, xp_reward, time_limit, passing_score, question_count, type, badge_reward, created_by, creator_name, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [
        id,
        title,
        description,
        category,
        difficulty,
        xpReward || 100,
        timeLimit || 300,
        passingScore || 70,
        questionCount || 0,
        type || "solo",
        badgeReward || null,
        createdBy || null,
        creatorName || "Instructor",
      ],
    );
    return id;
  }

  async createQuestions(quizId: string, questions: any[]) {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await db.query(
        `INSERT INTO quiz_questions
         (id, quiz_id, order_index, type, question, options, correct_answer, explanation, points, topic, category, code_snippet, code_language, match_pairs, time_limit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id || `q_${Date.now()}_${i}`,
          quizId,
          i + 1,
          q.type || "mcq",
          q.question,
          Array.isArray(q.options) ? q.options.join("\n") : q.options,
          typeof q.correctAnswer === "object"
            ? JSON.stringify(q.correctAnswer)
            : q.correctAnswer,
          q.explanation || "",
          q.points || 10,
          q.topic || "General",
          q.category || "Frontend",
          q.codeSnippet || null,
          q.codeLanguage || null,
          q.matchPairs
            ? typeof q.matchPairs === "string"
              ? q.matchPairs
              : JSON.stringify(q.matchPairs)
            : null,
          q.timeLimit || 20,
        ],
      );
    }
  }

  // --- BOSSES ---
  async findAllBosses() {
    const [rows] = (await db.query(
      "SELECT * FROM bosses ORDER BY level ASC",
    )) as [any[], any];
    return rows;
  }

  async findBossById(id: string) {
    const [rows] = (await db.query("SELECT * FROM bosses WHERE id = ?", [
      id,
    ])) as [any[], any];
    return rows[0] || null;
  }

  async findQuestionsByBossId(bossId: string) {
    const [rows] = (await db.query(
      "SELECT * FROM boss_questions WHERE boss_id = ?",
      [bossId],
    )) as [any[], any];
    return rows;
  }

  // --- ATTEMPTS & ACHIEVEMENTS ---
  async createQuizAttempt(attempt: {
    userId: string;
    quizId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    won: boolean;
    attemptType: string;
    category: string;
    attemptNumber: number;
    xpEarned?: number;
  }) {
    const [result]: any = await db.query(
      `INSERT INTO quiz_attempts
       (user_id, quiz_id, score, total_questions, percentage, won, attempt_type, category, attempt_number, xp_earned, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        attempt.userId,
        attempt.quizId,
        attempt.score,
        attempt.totalQuestions,
        attempt.percentage,
        attempt.won ? 1 : 0,
        attempt.attemptType,
        attempt.category,
        attempt.attemptNumber,
        attempt.xpEarned || 0,
      ],
    );
    return result.insertId;
  }

  async countUserAttempts(userId: string, quizId: string): Promise<number> {
    const [rows] = (await db.query(
      "SELECT COUNT(*) as count FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?",
      [userId, quizId],
    )) as [any[], any];
    return rows[0]?.count || 0;
  }

  async findUserAttempts(userId: string, quizId: string) {
    const [rows]: any = await db.query(
      "SELECT * FROM quiz_attempts WHERE user_id = ? AND quiz_id = ? ORDER BY recorded_at ASC",
      [userId, quizId],
    );
    return rows;
  }

// 🟢 QUIZ QUEST LINKS QUERY (FAIL-SAFE)
// 🟢 QUIZ QUEST LINKS QUERY (FIXED: SYNCED WITH QUEST HUB PROGRESS & LOCK STATE)
  async findQuestLinks(userId: string) {
    try {
      const query = `
        SELECT 
          l.quest_id AS id,
          l.quest_title AS title,
          l.quest_objective AS description,
          COALESCE(q.category, 'General') AS category,
          3 AS targetCount,
          COALESCE(q.xp_reward, 300) AS xpReward,
          COALESCE(q.badge_reward, CONCAT(COALESCE(q.category, 'Quest'), ' Veteran')) AS badgeReward,
          -- 1. Kapag locked o wala pa sa quest_progress, 0 muna ang progress
          CASE 
            WHEN qp.status IS NULL OR qp.status = 'locked' THEN 0
            WHEN qp.status = 'claimed' THEN 3
            ELSE LEAST(COUNT(DISTINCT qa.id), 3)
          END AS currentProgress,
          -- 2. Magiging completed (1) LAMANG kung active/unlocked sa quest_progress AT nakapasa sa 3 attempts
          CASE 
            WHEN qp.status IN ('active', 'unlocked', 'completed') AND LEAST(COUNT(DISTINCT qa.id), 3) >= 3 THEN 1
            WHEN qp.status = 'completed' THEN 1
            ELSE 0
          END AS isCompleted
        FROM quiz_quest_links l
        LEFT JOIN quizzes q ON q.id = l.quiz_id
        LEFT JOIN quest_progress qp ON qp.quest_id = l.quest_id AND qp.user_id = ?
        LEFT JOIN quiz_attempts qa ON qa.user_id = ? 
          AND (qa.quiz_id = l.quiz_id OR qa.category = q.category) 
          AND qa.won = 1
        GROUP BY l.quest_id, l.quest_title, l.quest_objective, q.category, q.xp_reward, q.badge_reward, qp.status
      `;
      const [rows] = (await db.query(query, [userId, userId])) as [any[], any];

      if (Array.isArray(rows) && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.warn("quiz_quest_links query error, loading fallback:", err);
    }

    // Fallback kung walang records
    const fallbackQuery = `
      SELECT 
        q.id AS id,
        CONCAT(q.title, ' Campaign') AS title,
        q.description AS description,
        q.category AS category,
        3 AS targetCount,
        COALESCE(q.xp_reward, 300) AS xpReward,
        COALESCE(q.badge_reward, 'Quest Master') AS badgeReward,
        0 AS currentProgress,
        0 AS isCompleted
      FROM quizzes q 
      LIMIT 4
    `;
    const [fallbackRows] = (await db.query(fallbackQuery, [])) as [any[], any];
    return fallbackRows;
  }

  async findAchievements() {
    const [rows] = (await db.query("SELECT * FROM quiz_achievements")) as [
      any[],
      any,
    ];
    return rows;
  }

  async updateUserXpAndLevel(
    userId: string,
    xpEarned: number,
    isRanked: boolean = false,
    won: boolean = false,
  ) {
    const [userRows]: any = await db.query(
      "SELECT total_xp, level, rp FROM users WHERE id = ?",
      [userId],
    );

    const currentXP = Number(userRows[0]?.total_xp || 0);
    const currentLevel = Number(userRows[0]?.level || 1);
    const currentRP = Number(userRows[0]?.rp || 0);

    const newTotalXP = currentXP + xpEarned;
    const newLevel = Math.floor(newTotalXP / 500) + 1;
    const isLevelUp = newLevel > currentLevel;

    let rpChange = 0;
    if (isRanked) {
      rpChange = won ? 25 : -10;
    }
    const newRP = Math.max(0, currentRP + rpChange);

    await db.query(
      "UPDATE users SET total_xp = ?, level = ?, rp = ? WHERE id = ?",
      [newTotalXP, newLevel, newRP, userId],
    );

    return {
      newTotalXP,
      level: newLevel,
      isLevelUp,
      currentLevelXP: newTotalXP % 500,
      xpRequiredForNextLevel: 500,
      rpChange: isRanked ? rpChange : null,
      currentRP: newRP,
    };
  }

  // 🟢 MASTERY DATA QUERIES
  async getCategoryAccuracy(userId: string) {
    const query = `
      SELECT 
        q.category AS name,
        ROUND(AVG(qa.percentage)) AS accuracy,
        COALESCE(SUM(qa.total_questions), COUNT(qa.id)) AS questionsCount,
        '12.5s' AS avgTime,
        CASE 
          WHEN AVG(qa.percentage) >= 80 THEN 'improving'
          WHEN AVG(qa.percentage) >= 65 THEN 'stable'
          ELSE 'needs_attention'
        END AS trend
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.user_id = ?
      GROUP BY q.category
      ORDER BY accuracy DESC
    `;
    const [rows] = (await db.query(query, [userId])) as [any[], any];
    return rows;
  }

  async getTopicMastery(userId: string) {
    const query = `
      SELECT 
        CAST(q.id AS CHAR) AS id,
        q.title AS title,
        q.category AS category,
        ROUND(AVG(qa.percentage)) AS accuracy,
        COALESCE(SUM(qa.total_questions), COUNT(qa.id)) AS questionsCount,
        DATE_FORMAT(MAX(qa.recorded_at), '%Y-%m-%d') AS lastAttempt,
        CASE 
          WHEN AVG(qa.percentage) >= 90 THEN 'Mastered'
          WHEN AVG(qa.percentage) >= 75 THEN 'Proficient'
          WHEN AVG(qa.percentage) >= 60 THEN 'Developing'
          ELSE 'Needs Work'
        END AS status
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.user_id = ?
      GROUP BY q.id, q.title, q.category
      ORDER BY MAX(qa.recorded_at) DESC
      LIMIT 12
    `;
    const [rows] = (await db.query(query, [userId])) as [any[], any];
    return rows;
  }

  // 🟢 RECOMMENDED REVIEWS QUERY
  async getRecommendedReviews(userId: string) {
    const query = `
      SELECT 
        q.category AS category,
        q.title AS topicTitle,
        ROUND(AVG(qa.percentage)) AS accuracy,
        CONCAT('Low Accuracy (', ROUND(AVG(qa.percentage)), '%) • Suggested Review') AS reason
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.user_id = ?
      GROUP BY q.id, q.title, q.category
      HAVING AVG(qa.percentage) < 75
      ORDER BY AVG(qa.percentage) ASC
      LIMIT 6
    `;
    const [rows] = (await db.query(query, [userId])) as [any[], any];
    return rows;
  }
  // 🟢 CLAIM QUEST REWARD METHOD
  async claimQuestReward(userId: string, questId: string) {
    // 1. Kukunin ang quest info
    const [questRows]: any = await db.query(
      "SELECT * FROM quiz_quest_links WHERE id = ?",
      [questId]
    );
    
    const xpReward = Number(questRows[0]?.xp_reward) || 250;
    const badgeReward = questRows[0]?.badge_reward || null;

    // 2. I-update ang total_xp at level ng user sa MySQL
    const [userRows]: any = await db.query(
      "SELECT total_xp, level FROM users WHERE id = ?",
      [userId]
    );
    const currentXP = Number(userRows[0]?.total_xp || 0);
    const newTotalXP = currentXP + xpReward;
    const newLevel = Math.floor(newTotalXP / 500) + 1;

    await db.query(
      "UPDATE users SET total_xp = ?, level = ? WHERE id = ?",
      [newTotalXP, newLevel, userId]
    );

    // 3. I-award ang badge sa user_badges table kung may badge reward
    if (badgeReward) {
      await db.query(
        "INSERT IGNORE INTO user_badges (user_id, badge_name, awarded_at) VALUES (?, ?, NOW())",
        [userId, badgeReward]
      );
    }

    return {
      newTotalXP,
      newLevel,
      xpEarned: xpReward,
      badgeEarned: badgeReward
    };
  }


// 🟢 USER HEADER STATS (FIXED: Kukuha na sa rank_tier ng MySQL)
  async getUserHeaderStats(userId: string) {
    const [rows]: any = await db.query(
      "SELECT total_xp, level, rp, rank_tier, rank FROM users WHERE id = ?",
      [userId]
    );
    const user = rows[0] || {};
    const totalXp = Number(user.total_xp || 0);
    const rp = Number(user.rp || 0);

    // 1. Unahing kunin ang eksaktong rank_tier o rank column mula sa database
    let rawRank = user.rank_tier || user.rank;

    // 2. Kung NULL ang rank sa DB, kalkulahin batay sa RP (Rank Points) lamang:
    if (!rawRank) {
      if (rp >= 1000) rawRank = "Diamond";
      else if (rp >= 600) rawRank = "Gold";
      else if (rp >= 300) rawRank = "Silver";
      else rawRank = "Bronze";
    }

    // 3. Format na may "Division" para sa Header UI
    const division = rawRank.toLowerCase().includes("division") 
      ? rawRank 
      : `${rawRank} Division`;

    return {
      totalXp,
      level: Number(user.level || 1),
      rp,
      division
    };
  }
  
}



export default new QuizRepository();
