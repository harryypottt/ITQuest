import pool from '../../config/db.js';

export const getAllUsers = async (req: any, res: any) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users_access ORDER BY id DESC');
    return res.status(200).json({ status: 'success', data: rows });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch users: ' + error.message });
  }
};

export const updateUserStatus = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ status: 'error', message: 'Status is required' });
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE admin_users_access SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({ status: 'success', message: `User status updated to ${status}` });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Failed to update user status: ' + error.message });
  }
};

