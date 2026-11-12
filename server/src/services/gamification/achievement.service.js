const pool = require('../../config/database');
const achievementRepository = require('../../repositories/achievement.repository');

const checkAndAwardAchievements = async (userId) => {
  // Get user's XP total
  const [user] = await pool.query('SELECT xp_total FROM users WHERE id = ?', [userId]);
  const xp = user[0].xp_total;

  // Example: Award achievement for reaching 1000 XP (assume achievement id 1)
  if (xp >= 1000) {
    await achievementRepository.checkAndAward(userId, 1);
  }

  // Add more checks (lessons completed, etc.)
};

module.exports = { checkAndAwardAchievements };