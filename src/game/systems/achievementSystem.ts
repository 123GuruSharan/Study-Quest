import { achievementsConfig, AchievementDefinition } from "@/config/achievements";
import { UserAchievementLog } from "@/types/achievement";
import { eventSystem, EVENTS } from "./eventSystem";

export class AchievementSystem {
  evaluateAchievements(
    userStats: {
      streak: number;
      studyHours: number;
      completedMissionsCount: number;
      level: number;
      bossesDefeatedCount: number;
      totalCoinsEarned: number;
    },
    currentLogs: UserAchievementLog[]
  ): {
    updatedLogs: UserAchievementLog[];
    newlyUnlocked: AchievementDefinition[];
  } {
    const newlyUnlocked: AchievementDefinition[] = [];
    const updatedLogs = achievementsConfig.map((def) => {
      const existing = currentLogs.find((log) => log.achievementId === def.id);

      // If already fully completed, keep as is
      if (existing?.progressPercentage === 100) {
        return existing;
      }

      // Map statistics counters to the required metric targets
      let currentVal = 0;
      switch (def.metricType) {
        case "streak":
          currentVal = userStats.streak;
          break;
        case "study_hours":
          currentVal = userStats.studyHours;
          break;
        case "completed_missions":
          currentVal = userStats.completedMissionsCount;
          break;
        case "level":
          currentVal = userStats.level;
          break;
        case "bosses_defeated":
          currentVal = userStats.bossesDefeatedCount;
          break;
        case "coins_earned":
          currentVal = userStats.totalCoinsEarned;
          break;
      }

      const progressPercentage = Math.min(
        100,
        Math.max(0, Math.round((currentVal / def.targetValue) * 100))
      );

      const isCompletedNow = progressPercentage === 100;
      const wasCompletedBefore = existing ? existing.progressPercentage === 100 : false;

      if (isCompletedNow && !wasCompletedBefore) {
        newlyUnlocked.push(def);
      }

      return {
        achievementId: def.id,
        unlockedAt: isCompletedNow
          ? new Date().toISOString()
          : existing?.unlockedAt || "",
        claimed: existing?.claimed || false,
        progressPercentage,
      };
    });

    // Notify unlocking events for newly unlocked milestones
    newlyUnlocked.forEach((achievement) => {
      eventSystem.publish(EVENTS.ACHIEVEMENT_UNLOCKED, {
        id: achievement.id,
        title: achievement.title,
        tier: achievement.tier,
        rewardXP: achievement.rewardXP,
        rewardCoins: achievement.rewardCoins,
      });
    });

    return {
      updatedLogs,
      newlyUnlocked,
    };
  }
}

export const achievementSystem = new AchievementSystem();
