import { missionsConfig } from "@/config/missions";
import { gameConfig } from "@/config/game";
import { Mission } from "@/types/mission";

export class RuleSystem {
  canCreateEasyMission(missions: Mission[]): boolean {
    const today = new Date().toDateString();
    const easyMissionsCreatedToday = missions.filter((m) => {
      const createdDate = new Date(m.createdAt).toDateString();
      return m.difficulty === "Easy" && createdDate === today && m.status !== "Cancelled";
    });

    return easyMissionsCreatedToday.length < missionsConfig.validationLimits.maxEasyMissionsPerDay;
  }

  isDailyGoalMet(missionPointsToday: number): boolean {
    return missionPointsToday >= gameConfig.dailyTargets.missionPoints;
  }

  isPhoneOverlimit(minutesUsed: number): boolean {
    return minutesUsed > gameConfig.dailyTargets.phoneUsageLimitMinutes;
  }

  isProofRequired(mission: Mission): boolean {
    // In our spec, completing a mission requires proof.
    return mission.proofRequired;
  }
}

export const ruleSystem = new RuleSystem();
