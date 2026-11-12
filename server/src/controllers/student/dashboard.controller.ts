import db from '../../config/db.js';

export async function getDashboardData(req: any, res: any) {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No user ID found' });
    }

    // 1. Kunin ang User Info
    const [userRows]: any = await db.query(
      'SELECT id, name, email, level, total_xp, streak, rank_tier FROM users WHERE id = ?',
      [userId]
    );
    const user = userRows[0] || {};

    // Kuhanin ang Total XP mula sa DB
    const totalXP = user.total_xp || 0;

    // AUTOMATIC LEVEL FORMULA: Bawat 500 XP ay tataas ng 1 level (Simula sa Level 1)
    const calculatedLevel = Math.floor(totalXP / 500) + 1;

    // (Opsyonal) Pwede mo ring i-update sa database para laging updated
    await db.query('UPDATE users SET level = ? WHERE id = ?', [calculatedLevel, userId]);

    // 2. Kunin ang Active Quests
    const [questRows]: any = await db.query(
      `SELECT q.id as questId, q.title, q.description, q.icon, q.xp_reward as xpReward, 
              qp.status, qp.started_at
       FROM quest_progress qp
       JOIN quests q ON qp.quest_id = q.id
       WHERE qp.user_id = ? AND qp.status = 'in_progress'`,
      [userId]
    );

    const activeQuests = [];
    for (const quest of questRows) {
      const [objectives]: any = await db.query(
        'SELECT id, description, objective_type FROM quest_objectives WHERE quest_id = ? ORDER BY order_index ASC',
        [quest.questId]
      );
      
      let completedCount = 0;
      const formattedObjectives = [];

      for (const obj of objectives) {
        const [objProgress]: any = await db.query(
          'SELECT is_completed FROM user_quest_objectives WHERE user_id = ? AND objective_id = ?',
          [userId, obj.id]
        );
        
        const isCompleted = objProgress[0]?.is_completed === 1;
        if (isCompleted) completedCount++;

        formattedObjectives.push({
          id: obj.id,
          description: obj.description,
          isCompleted: isCompleted
        });
      }

      activeQuests.push({
        ...quest,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        progress: completedCount,
        total: objectives.length,
        objectives: formattedObjectives
      });
    }

    // 3. Kunin ang Unread Notifications count
    const [notifRows]: any = await db.query(
      'SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    const unreadCount = notifRows[0]?.unreadCount || 0;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          full_name: user.name,
          // Gamitin ang kalkuladong level para tumpak sa XP ring
          current_level: calculatedLevel,
          total_xp: totalXP,
          current_rank: user.rank_tier || 'Bronze',
          streak_days: user.streak || 0,
        },
        activeQuests,
        unreadNotificationsCount: unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}