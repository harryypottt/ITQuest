import { Request, Response } from 'express';
import bossService from '../../services/quiz/boss.service.js';

// 🟢 GET /api/student/bosses
export const getAllBosses = async (req: Request, res: Response) => {
  try {
    const bosses = await bossService.getAllBosses();
    return res.json({ success: true, bosses });
  } catch (error: any) {
    console.error('Fetch bosses error:', error);
    return res.status(500).json({ success: false, message: 'Database Error' });
  }
};

// 🟢 GET /api/student/bosses/:id
export const getBossById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const boss = await bossService.getBossById(id);

    if (!boss) {
      return res.status(404).json({ success: false, message: 'Boss not found' });
    }

    return res.json({ success: true, boss });
  } catch (error: any) {
    console.error('Fetch boss error:', error);
    return res.status(500).json({ success: false, message: 'Database Error' });
  }
};

// 🟢 POST /api/student/bosses/:id/attempt
export const submitBossAttempt = async (req: Request | any, res: Response) => {
  try {
    const studentId = req.user?.id || req.body.studentId;
    const bossId = req.params.id;
    const { passed, xpEarned, bossHpRemaining } = req.body;

    const result = await bossService.processBossAttempt(
      studentId,
      bossId,
      passed,
      xpEarned,
      bossHpRemaining
    );

    return res.json({
      success: true,
      message: 'Boss attempt processed and saved successfully!',
      data: result,
    });
  } catch (error: any) {
    console.error('Submit boss attempt error:', error);
    return res.status(500).json({ success: false, message: 'Database Error' });
  }
};