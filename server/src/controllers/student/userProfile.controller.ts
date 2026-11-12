import { Request, Response } from 'express';
import { userProfileService } from '../../services/profile/userProfile.service.js';

// 🟢 GET PROFILE
export const getProfile = async (req: Request, res: Response) => {
  try {
    // 🌟 Tinitingnan lahat ng posibleng lalagyan ng User ID (URL params, Token variations, o Query)
    const userFromToken = (req as any).user;
    const targetUserId =
      (req.params.id as string) ||
      userFromToken?.id ||
      userFromToken?.userId ||
      userFromToken?.user_id ||
      (req.query.userId as string);

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const data = await userProfileService.getFullUserProfile(targetUserId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error in getProfile:', error.message);
    return res.status(error.message === 'User not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

// 🟢 UPDATE PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userFromToken = (req as any).user;
    const userId =
      userFromToken?.id ||
      userFromToken?.userId ||
      userFromToken?.user_id ||
      req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID missing',
      });
    }

    const { name, bio, specialization, avatar_initials } = req.body;

    const updatedProfile = await userProfileService.updateUserProfile(userId, {
      name,
      bio,
      specialization,
      avatar_initials,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error('Error in updateProfile:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};    