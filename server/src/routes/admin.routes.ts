import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// HELPER: LOG AUDIT ACTIONS
async function logAuditAction(adminName: string, action: string, targetUser: string, details: string) {
  try {
    await pool.query(
      'INSERT INTO audit_logs (admin_name, action, target_user, details) VALUES (?, ?, ?, ?)',
      [adminName || 'System Admin', action, targetUser, details]
    );
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

// 1. GET SYSTEM STATS (Overview Tab)
router.get('/stats', async (req, res) => {
  try {
    const [totalUsersRows]: any = await pool.query("SELECT COUNT(*) as count FROM users WHERE status != 'pending'");
    const [pendingRows]: any = await pool.query("SELECT COUNT(*) as count FROM users WHERE status = 'pending'");
    const [professorsRows]: any = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'faculty'");
    const [adminsRows]: any = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");

    res.json({
      totalUsers: totalUsersRows[0]?.count || 0,
      pendingApprovals: pendingRows[0]?.count || 0,
      totalProfessors: professorsRows[0]?.count || 0,
      totalAdmins: adminsRows[0]?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
});

/// 2. GET PENDING REQUESTS
router.get('/requests/pending', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, name, email, role, specialization, level AS yearLevel, joined_at AS requestedAt 
       FROM users 
       WHERE LOWER(status) = 'pending' 
       ORDER BY joined_at DESC`
    );

    const formatted = rows.map((u: any) => {
      const lowerRole = (u.role || '').toLowerCase();
      return {
        ...u,
        role: (lowerRole === 'faculty' || lowerRole === 'professor') 
          ? 'Professor' 
          : lowerRole === 'admin' 
          ? 'Admin' 
          : 'Student',
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Error fetching pending requests', error });
  }
});

// 3. GET APPROVED USERS DIRECTORY
router.get('/users/approved', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, name, email, role, status, specialization, level AS yearLevel, joined_at AS approvedAt 
       FROM users WHERE status != 'pending' ORDER BY joined_at DESC`
    );
    const formatted = rows.map((u: any) => ({
      ...u,
      role: u.role === 'faculty' ? 'Professor' : u.role === 'admin' ? 'Admin' : 'Student',
      status: u.status === 'active' ? 'Enabled' : 'Disabled',
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved users', error });
  }
});

// 4. DECISION (APPROVE / REJECT)
router.patch('/requests/:id/decision', async (req, res) => {
  const { id } = req.params;
  const { decision, adminName } = req.body;

  try {
    const [userRows]: any = await pool.query('SELECT name FROM users WHERE id = ?', [id]);
    const targetName = userRows[0]?.name || `User ID ${id}`;

    if (decision === 'Approved') {
      await pool.query("UPDATE users SET status = 'active' WHERE id = ?", [id]);
      await logAuditAction(adminName, 'APPROVE_USER', targetName, `Approved access request for ${targetName}.`);
    } else {
      await pool.query("DELETE FROM users WHERE id = ?", [id]);
      await logAuditAction(adminName, 'REJECT_USER', targetName, `Rejected access request for ${targetName}.`);
    }
    res.json({ message: `Request ${decision.toLowerCase()} successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating decision', error });
  }
});

// 5. PROMOTE TO ADMIN
router.patch('/users/:id/promote-admin', async (req, res) => {
  const { id } = req.params;
  const { promotedBy } = req.body;

  try {
    const [userRows]: any = await pool.query('SELECT name FROM users WHERE id = ?', [id]);
    const targetName = userRows[0]?.name || `User ID ${id}`;

    await pool.query("UPDATE users SET role = 'admin' WHERE id = ?", [id]);
    await pool.query(
      "INSERT INTO admin_user_access (user_id, assigned_role, promoted_by) VALUES (?, 'admin', ?)",
      [id, promotedBy || 'System Admin']
    );
    await logAuditAction(promotedBy, 'PROMOTE_ADMIN', targetName, `Promoted ${targetName} to System Administrator.`);

    res.json({ message: 'User promoted to Admin successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error promoting user', error });
  }
});

// 6. DEMOTE / REMOVE ADMIN (ETO ANG WALA KANINA)
router.patch('/users/:id/demote-admin', async (req, res) => {
  const { id } = req.params;
  const { adminName } = req.body;

  try {
    const [userRows]: any = await pool.query('SELECT name FROM users WHERE id = ?', [id]);
    const targetName = userRows[0]?.name || `User ID ${id}`;

    // Ibalik sa faculty/professor ang role sa users table
    await pool.query("UPDATE users SET role = 'faculty' WHERE id = ?", [id]);

    // Burahin sa admin_user_access table
    await pool.query("DELETE FROM admin_user_access WHERE user_id = ?", [id]);

    await logAuditAction(adminName || 'System Admin', 'DEMOTE_ADMIN', targetName, `Revoked Administrator access for ${targetName}.`);

    res.json({ message: 'Admin privileges revoked successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error revoking admin access', error });
  }
});

// 7. TOGGLE STATUS (ENABLE / DISABLE)
router.patch('/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, adminName } = req.body; // status: 'active' | 'disabled'

  try {
    const [userRows]: any = await pool.query('SELECT name FROM users WHERE id = ?', [id]);
    const targetName = userRows[0]?.name || `User ID ${id}`;

    await pool.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    await logAuditAction(
      adminName,
      status === 'disabled' ? 'DISABLE_USER' : 'ENABLE_USER',
      targetName,
      `Changed status of ${targetName} to ${status}.`
    );

    res.json({ message: `Status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
});

// 8. GET AUDIT LOGS
router.get('/audit-logs', async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, admin_name AS adminName, action, target_user AS targetUser, details, created_at AS timestamp FROM audit_logs ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error });
  }
});

export default router;

