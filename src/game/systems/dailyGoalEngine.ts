import { gameConfig } from "@/config/game";

export interface DailyGoalProgress {
  xpCompleted: boolean;
  xpPercentage: number;
  mpCompleted: boolean;
  mpPercentage: number;
  hoursCompleted: boolean;
  hoursPercentage: number;
  phoneCompleted: boolean;
  phonePercentage: number;
  overallPercentage: number;
  allGoalsMet: boolean;
}

export class DailyGoalEngine {
  calculateDailyProgress(data: {
    xpToday: number;
    mpToday: number;
    hoursToday: number;
    phoneMinutesToday: number;
  }): DailyGoalProgress {
    const targets = gameConfig.dailyTargets;

    // XP progress
    const xpPercentage = Math.min(100, Math.round((data.xpToday / targets.xp) * 100));
    const xpCompleted = data.xpToday >= targets.xp;

    // Mission Points progress
    const mpPercentage = Math.min(100, Math.round((data.mpToday / targets.missionPoints) * 100));
    const mpCompleted = data.mpToday >= targets.missionPoints;

    // Study Hours progress
    const hoursPercentage = Math.min(100, Math.round((data.hoursToday / targets.studyHours) * 100));
    const hoursCompleted = data.hoursToday >= targets.studyHours;

    // Phone progress: goal is keeping under limit. If under, 100% complete.
    // Otherwise show how close they are to limit.
    const phoneLimit = targets.phoneUsageLimitMinutes;
    const phoneCompleted = data.phoneMinutesToday <= phoneLimit;
    const phonePercentage = data.phoneMinutesToday <= phoneLimit
      ? 100
      : Math.max(0, Math.round((1 - (data.phoneMinutesToday - phoneLimit) / phoneLimit) * 100));

    // Overall daily completion percentage (average of targets, phone limit capped at 100)
    const overallPercentage = Math.round(
      (xpPercentage + mpPercentage + hoursPercentage + phonePercentage) / 4
    );

    const allGoalsMet = xpCompleted && mpCompleted && hoursCompleted && phoneCompleted;

    return {
      xpCompleted,
      xpPercentage,
      mpCompleted,
      mpPercentage,
      hoursCompleted,
      hoursPercentage,
      phoneCompleted,
      phonePercentage,
      overallPercentage,
      allGoalsMet,
    };
  }
}

export const dailyGoalEngine = new DailyGoalEngine();
