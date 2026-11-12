import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import db from '../../config/db.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      full_name, 
      first_name, 
      last_name, 
      role, 
      student_id, 
      specialization,
      year_level,
      status
    } = req.body;

    // 1. Name fallback validation
    const nameToUse = (full_name || `${first_name || ''} ${last_name || ''}`).trim();
    if (!nameToUse || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Kumpletuhin ang pangalan, email, at password.',
      });
    }

    // 2. Suriin kung umiiral na ang Email
    const [existing] = await db.query<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?', 
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'May account na gamit ang email na ito.' 
      });
    }

    // 3. Mag-generate ng Custom User ID
    const [countRows] = await db.query<mysql.RowDataPacket[]>('SELECT COUNT(*) as total FROM users');
    const nextNum = (countRows[0].total + 1).toString().padStart(3, '0');
    const userId = `u-${nextNum}`;

    // 4. Hash ng Password at Initials Generation
    const hashedPassword = await bcrypt.hash(password, 10);
    const nameParts = nameToUse.split(' ').filter(Boolean);
    const initials = nameParts.length >= 2
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      : nameToUse.substring(0, 2).toUpperCase();

    // 5. Role at Status Logic
    const finalRole = (role === 'professor' || role === 'faculty') ? 'faculty' : (role || 'student');
    const finalStatus = finalRole === 'faculty' ? 'pending' : 'active';

    // Parse level: Kapag Professor (walang year_level), ginagawang 0 para hindi mag NULL Error
    const parsedLevel = year_level ? parseInt(year_level.replace(/\D/g, ''), 10) || 1 : 0;

    // 6. Pag-INSERT sa Database (Ginamit lang ang tunay na mga column sa phpMyAdmin)
    await db.query(
      `INSERT INTO users 
        (id, name, email, password_hash, role, status, student_id, specialization, level, avatar_initials, last_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        userId, 
        nameToUse, 
        email, 
        hashedPassword, 
        finalRole, 
        finalStatus,
        student_id || null, 
        specialization || (finalRole === 'faculty' ? 'Faculty/Professor' : null), 
        parsedLevel,
        initials
      ]
    );

    return res.status(201).json({ 
      success: true, 
      message: finalRole === 'faculty' 
        ? 'Professor account registered! Awaiting admin approval.' 
        : 'Account successfully created!', 
      userId 
    });
  } catch (error: any) {
    console.error('Register Controller Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Database error during registration.' 
    });
  }
};

