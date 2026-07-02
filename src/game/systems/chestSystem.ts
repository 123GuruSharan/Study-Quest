import { chestRarityConfig } from "@/config/rewards";

export interface ChestReward {
  rarity: string;
  xp: number;
  coins: number;
  unlockedShield?: boolean;
}

export class ChestSystem {
  openChest(type: "daily" | "weekly" | "epic" | "legendary" | "mythic"): ChestReward {
    const roll = Math.random();
    let accumulatedWeight = 0;
    
    // Choose rarity based on weights
    let selectedRarity = chestRarityConfig.probabilities[0];
    
    // Force specific chest for premium triggers if needed, else roll
    if (type === "legendary") {
      selectedRarity = chestRarityConfig.probabilities.find(p => p.rarity === "Legendary") || selectedRarity;
    } else if (type === "mythic") {
      selectedRarity = chestRarityConfig.probabilities.find(p => p.rarity === "Mythic") || selectedRarity;
    } else {
      for (const p of chestRarityConfig.probabilities) {
        accumulatedWeight += p.weight;
        if (roll <= accumulatedWeight) {
          selectedRarity = p;
          break;
        }
      }
    }

    // Roll random values in bounds
    const xp = Math.round(
      selectedRarity.minXP + Math.random() * (selectedRarity.maxXP - selectedRarity.minXP)
    );
    const coins = Math.round(
      selectedRarity.minCoins + Math.random() * (selectedRarity.maxCoins - selectedRarity.minCoins)
    );

    const unlockedShield = selectedRarity.rarity === "Legendary" || selectedRarity.rarity === "Mythic";

    return {
      rarity: selectedRarity.rarity,
      xp,
      coins,
      unlockedShield,
    };
  }

  isCooldownOver(cooldownTime: string | null): boolean {
    if (!cooldownTime) return true;
    return new Date().getTime() > new Date(cooldownTime).getTime();
  }

  getNewCooldown(): string {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    return tomorrow.toISOString();
  }
}

export const chestSystem = new ChestSystem();
