export interface UserProfile {
  id: string;
  username: string;
  level: number;
  rankName: string;
  xp: number;
  coins: number;
  streak: number;
  comboMultiplier: number;
  studyHours: number;
  phoneUsageMinutes: number;
  missionPoints: number;
  avatarUrl?: string;
  theme: "light" | "dark";
  careerJourneyRank?: string; // Future career growth indicator
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  lastChestClaimedAt?: string;
  bossHp?: number;
  bossesDefeatedCount?: number;
}
