import { missionRewardsConfig } from "@/config/rewards";
import { gameConfig } from "@/config/game";
import { Mission } from "@/types/mission";

export class EconomySystem {
  calculateMissionPayout(
    mission: Mission,
    streakDays: number,
    comboCount: number
  ) {
    const rewards = missionRewardsConfig.difficultyRewards[mission.difficulty];
    const baseXP = rewards.xp;
    const baseCoins = rewards.coins;

    // Calculate streak tier details
    let streakMultiplier = 1.0;
    let streakTierName = "Initiate Flame";

    // Sort descending to find highest matched milestone tier
    const sortedTiers = [...gameConfig.streakRules.tiers].sort((a, b) => b.days - a.days);
    for (const tier of sortedTiers) {
      if (streakDays >= tier.days) {
        streakMultiplier = tier.multiplier;
        streakTierName = tier.tierName;
        break;
      }
    }

    // Calculate combo multiplier
    let comboMultiplier = 1.0;
    const sortedCombos = [...gameConfig.comboRules.multipliers].sort(
      (a, b) => b.completionsCount - a.completionsCount
    );
    for (const rule of sortedCombos) {
      if (comboCount >= rule.completionsCount) {
        comboMultiplier = rule.multiplier;
        break;
      }
    }

    const finalXP = Math.round(baseXP * comboMultiplier * streakMultiplier);
    const finalCoins = baseCoins;

    const bonusXP = finalXP - baseXP;
    const streakBonus = Math.max(0, Math.round(baseXP * (streakMultiplier - 1.0)));
    const comboBonus = Math.max(0, Math.round(baseXP * (comboMultiplier - 1.0)));

    return {
      baseXP,
      baseCoins,
      finalXP,
      finalCoins,
      bonusXP,
      comboBonus,
      streakBonus,
      missionPoints: rewards.missionPoints,
      streakTierName,
      comboMultiplier,
    };
  }

  calculateDailyGoalBonus() {
    return {
      xp: gameConfig.dailyGoalBonus.xp,
      coins: gameConfig.dailyGoalBonus.coins,
    };
  }
}

export const economySystem = new EconomySystem();
