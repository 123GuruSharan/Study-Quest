export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  metricType: "streak" | "study_hours" | "completed_missions" | "level" | "bosses_defeated" | "coins_earned";
  targetValue: number;
  rewardXP: number;
  rewardCoins: number;
}

export const achievementsConfig: AchievementDefinition[] = [
  {
    id: "ac_streak_1",
    title: "Consistent Catalyst",
    description: "Maintain a study streak of 10 consecutive days.",
    tier: "Silver",
    metricType: "streak",
    targetValue: 10,
    rewardXP: 300,
    rewardCoins: 50,
  },
  {
    id: "ac_hours_1",
    title: "Deep Work Ascendant",
    description: "Log a total of 24 focused study hours.",
    tier: "Gold",
    metricType: "study_hours",
    targetValue: 24,
    rewardXP: 500,
    rewardCoins: 100,
  },
  {
    id: "ac_missions_1",
    title: "Mission Specialist",
    description: "Complete 15 study missions.",
    tier: "Bronze",
    metricType: "completed_missions",
    targetValue: 15,
    rewardXP: 200,
    rewardCoins: 30,
  },
  {
    id: "ac_level_1",
    title: "Scholar Awakening",
    description: "Reach level 5 in study progression.",
    tier: "Bronze",
    metricType: "level",
    targetValue: 5,
    rewardXP: 150,
    rewardCoins: 25,
  },
  {
    id: "ac_boss_1",
    title: "Procrastination Slayer",
    description: "Defeat 3 Weekly Boss Battle events.",
    tier: "Platinum",
    metricType: "bosses_defeated",
    targetValue: 3,
    rewardXP: 1000,
    rewardCoins: 350,
  },
  {
    id: "ac_coins_1",
    title: "Guild Treasurer",
    description: "Earn a total of 2,000 StudyQuest coins.",
    tier: "Gold",
    metricType: "coins_earned",
    targetValue: 2000,
    rewardXP: 600,
    rewardCoins: 150,
  },
];
