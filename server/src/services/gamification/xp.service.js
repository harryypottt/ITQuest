const pool = require('../../config/database');

const addXP = async (userId, xpAmount, sourceType, sourceId, description) => {
  await pool.query(
    `INSERT INTO xp_transactions (user_id, xp_amount, source_type, source_id, description, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [userId, xpAmount, sourceType, sourceId, description]
  );

  // Update user total XP and level
  const [user] = await pool.query('SELECT xp_total FROM users WHERE id = ?', [userId]);
  const newTotal = user[0].xp_total + xpAmount;
  const newLevel = Math.floor(Math.sqrt(newTotal / 100)) + 1; // example formula
  await pool.query(
    `UPDATE users SET xp_total = ?, current_level = ? WHERE id = ?`,
    [newTotal, newLevel, userId]
  );
  return { newTotal, newLevel };
};

module.exports = { addXP };