import { userRepository, UpdateProfileInput } from '../../repositories/user.repository.js';

export const userProfileService = {
  async getFullUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Isabay ang pagkuha ng Badges, Activities, at Coding Stats
    const [allBadges, activities, codingStats] = await Promise.all([
      userRepository.getUserBadges(userId).catch(() => []),
      userRepository.getUserActivities(userId, 5).catch(() => []),
      userRepository.getCodingStats(userId).catch(() => ({
        challenges_solved: 0,
        total_submissions: 0,
        total_coding_xp: 0,
      })),
    ]);

    const earnedBadges = allBadges.filter((b) => Boolean(b.is_earned));
    const lockedBadges = allBadges.filter((b) => !b.is_earned);

    // Compute Level XP Progress (500 XP per level)
    const xpPerLevel = 500;
    const currentLevelBaseXP = user.level * xpPerLevel;
    const currentLevelXP = Math.max(0, user.total_xp - currentLevelBaseXP);

    return {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.student_id,
        role: user.role,
        specialization: user.specialization || 'N/A',
        avatarInitials: user.avatar_initials || (user.name ? user.name.slice(0, 2).toUpperCase() : 'U'),
        bio: user.bio || '',
        joinedAt: user.joined_at,
        lastActive: user.last_active,
      },
      stats: {
        level: user.level,
        totalXp: user.total_xp,
        currentLevelXp: currentLevelXP,
        nextLevelXpThreshold: xpPerLevel,
        streak: user.streak,
        rank: user.rank || 'Novice',
        rankTier: user.rank_tier || 'Bronze',
        rp: user.rp || 0,
        badgesCount: earnedBadges.length,
        totalBadgesAvailable: allBadges.length,
        challengesSolved: Number(codingStats.challenges_solved),
        totalSubmissions: Number(codingStats.total_submissions),
        codingXp: Number(codingStats.total_coding_xp),
      },
      badges: {
        all: allBadges,
        earned: earnedBadges,
        locked: lockedBadges,
      },
      recentActivities: activities,
    };
  },

  async updateUserProfile(userId: string, updateData: UpdateProfileInput) {
    const updatedUser = await userRepository.updateProfile(userId, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update profile');
    }
    return updatedUser;
  },
};