import { gameConfig } from "@/config/game";

export interface StreakTier {
  days: number;
  tierName: string;
  multiplier: number;
}

export class StreakEngine {
  /**
   * Calculates the streak of consecutive calendar days with study activity.
   */
  calculateStreak(historyLogs: any[]): number {
    if (!historyLogs || historyLogs.length === 0) {
      return 0;
    }

    // Filter logs that have study activity (minutesFocused > 0 or missionsCompleted > 0)
    const activeDates = new Set(
      historyLogs
        .filter((log) => log.minutesFocused > 0 || log.missionsCompleted > 0)
        .map((log) => log.date) // Date is in YYYY-MM-DD
    );

    if (activeDates.size === 0) {
      return 0;
    }

    // Get current date string and yesterday date string in YYYY-MM-DD local format
    const getLocalDateStr = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const date = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${date}`;
    };

    const today = new Date();
    const todayStr = getLocalDateStr(today);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateStr(yesterday);

    // Determine starting point for consecutive day counting
    let startStr = "";
    if (activeDates.has(todayStr)) {
      startStr = todayStr;
    } else if (activeDates.has(yesterdayStr)) {
      startStr = yesterdayStr;
    } else {
      // If neither today nor yesterday has study activity, the streak is broken
      return 0;
    }

    let streak = 0;
    let checkDate = new Date(startStr + "T12:00:00"); // Use noon to avoid timezone shift errors

    while (true) {
      const checkStr = getLocalDateStr(checkDate);
      if (activeDates.has(checkStr)) {
        streak++;
        // Move check date back by 1 day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Returns the user's active streak tier details based on current streak count.
   */
  getStreakTier(streak: number): StreakTier {
    const sortedTiers = [...gameConfig.streakRules.tiers].sort((a, b) => b.days - a.days);
    return sortedTiers.find((t) => streak >= t.days) || gameConfig.streakRules.tiers[0];
  }

  /**
   * Returns the next streak milestone tier and remaining days to unlock it.
   */
  getNextStreakTier(streak: number): { nextTier: StreakTier | null; daysRemaining: number } {
    const sortedTiers = [...gameConfig.streakRules.tiers].sort((a, b) => a.days - b.days);
    const next = sortedTiers.find((t) => t.days > streak);
    if (!next) {
      return { nextTier: null, daysRemaining: 0 };
    }
    return {
      nextTier: next,
      daysRemaining: next.days - streak,
    };
  }
}

export const streakEngine = new StreakEngine();
