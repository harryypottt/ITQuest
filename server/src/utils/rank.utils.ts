export interface RankResult {
  tier: string;
  rpEarned: number;
  newRp: number;
}

// 🟢 Rank Tier Thresholds
export const getRankTier = (rp: number): string => {
  if (rp >= 2000) return 'Legend';
  if (rp >= 1500) return 'Diamond';
  if (rp >= 1000) return 'Platinum';
  if (rp >= 600) return 'Gold';
  if (rp >= 300) return 'Silver';
  return 'Bronze';
};

// 🟢 RP Earned/Lost Logic
export const calculateRpChange = (won: boolean, percentage: number): number => {
  if (won) {
    // Perfect Win = +50 RP, Standard Win = +25 RP
    return percentage === 100 ? 50 : 25;
  }
  // Loss = -15 RP
  return -15;
};