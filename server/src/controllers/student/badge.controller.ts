import { Request, Response } from 'express';
import badgeService from '../../services/badges/badge.service.js';

export const getBadges = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?.userId;
    console.log("Kasalukuyang User ID:", userId);
    const { stats, badges } = await badgeService.getUserBadges(userId);

    return res.status(200).json({
      success: true,
      stats,
      data: badges,
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getBadgeCategories = async (req: Request, res: Response) => {
  try {
    const categories = await badgeService.getBadgeCategories();
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching badge categories:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};