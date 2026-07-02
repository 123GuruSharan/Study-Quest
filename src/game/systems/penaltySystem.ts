import { gameConfig } from "@/config/game";
import { eventSystem, EVENTS } from "./eventSystem";

export class PenaltySystem {
  calculatePhoneUsagePenalty(minutesUsed: number): number {
    const limit = gameConfig.dailyTargets.phoneUsageLimitMinutes;
    if (minutesUsed <= limit) return 0;

    const minutesOver = minutesUsed - limit;
    const intervals = Math.floor(minutesOver / 10);
    return intervals * gameConfig.penalties.phoneOverusePerTenMinutes;
  }

  applyPenalty(type: "phone" | "expired" | "late" | "missed_goal", details?: any): number {
    let penaltyAmount = 0;
    let reason = "";

    switch (type) {
      case "phone":
        const minutes = details?.minutesUsed || 0;
        penaltyAmount = this.calculatePhoneUsagePenalty(minutes);
        reason = `exceeding screen time limit by ${minutes - gameConfig.dailyTargets.phoneUsageLimitMinutes} mins`;
        break;
      case "expired":
        penaltyAmount = gameConfig.penalties.expiredMission;
        reason = "missing mission deadline";
        break;
      case "late":
        penaltyAmount = gameConfig.penalties.lateSubmission;
        reason = "submitting study mission after deadline";
        break;
      case "missed_goal":
        penaltyAmount = gameConfig.penalties.missedDailyGoal;
        reason = "failing to complete daily study goals";
        break;
    }

    if (penaltyAmount > 0) {
      eventSystem.publish(EVENTS.PENALTY_APPLIED, {
        type,
        amount: penaltyAmount,
        reason,
      });
    }

    return penaltyAmount;
  }
}

export const penaltySystem = new PenaltySystem();
