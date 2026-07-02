export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  metricType: "streak" | "study_hours" | "completed_missions" | "level" | "bosses_defeated" | "coins_earned";
  targetValue: number;
  rewardXP: number;
  rewardCoins: number;
}

export interface UserAchievementLog {
  achievementId: string;
  unlockedAt: string;
  claimed: boolean;
  progressPercentage: number;
}
