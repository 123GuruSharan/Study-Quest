import { UserAchievementLog } from "@/types/achievement";

export const mockAchievementLogs: UserAchievementLog[] = [
  {
    achievementId: "ac_streak_1",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    claimed: true,
    progressPercentage: 100,
  },
  {
    achievementId: "ac_hours_1",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    claimed: true,
    progressPercentage: 100,
  },
  {
    achievementId: "ac_missions_1",
    unlockedAt: "",
    claimed: false,
    progressPercentage: 66, // e.g. 10/15 completed
  },
  {
    achievementId: "ac_level_1",
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    claimed: true,
    progressPercentage: 100,
  },
  {
    achievementId: "ac_boss_1",
    unlockedAt: "",
    claimed: false,
    progressPercentage: 33, // 1/3 bosses defeated
  },
  {
    achievementId: "ac_coins_1",
    unlockedAt: "",
    claimed: false,
    progressPercentage: 71, // 1420/2000 coins earned
  },
];
