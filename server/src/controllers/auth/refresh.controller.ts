import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import db from '../../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';
const ACCESS_EXPIRATION = process.env.ACCESS_EXPIRATION || '15m';

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Walang ibinigay na refresh token.' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };

    const [users] = await db.query<mysql.RowDataPacket[]>('SELECT id, role, email FROM users WHERE id = ?', [decoded.userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

     const user = users[0];
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRATION as any } // Idagdag ang `as any` dito
    );

    return res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: 'Invalid o expired na refresh token.' });
  }
};