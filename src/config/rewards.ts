export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "boost" | "item" | "customization" | "shield" | "user_defined";
  effect?: string;
  unlocked?: boolean;

  // Extended Reward Shop 2.0 fields
  category?: "Entertainment" | "Food" | "Gaming" | "Shopping" | "Fitness" | "Social" | "Break" | "Learning" | "Custom";
  cooldownHours?: number;
  timesClaimed?: number;
  lastClaimedAt?: string | null;
  isCustom?: boolean;
  wishlist?: boolean;
  icon?: string;
  image?: string;
}

export const missionRewardsConfig = {
  difficultyRewards: {
    Easy: {
      xp: 50,
      coins: 5,
      missionPoints: 1,
    },
    Medium: {
      xp: 120,
      coins: 10,
      missionPoints: 2,
    },
    Hard: {
      xp: 250,
      coins: 20,
      missionPoints: 3,
    },
    Epic: {
      xp: 500,
      coins: 45,
      missionPoints: 5,
    },
  },
};

export const chestRarityConfig = {
  probabilities: [
    { rarity: "Common", weight: 0.50, minXP: 40, maxXP: 80, minCoins: 10, maxCoins: 25 },
    { rarity: "Rare", weight: 0.30, minXP: 100, maxXP: 180, minCoins: 30, maxCoins: 60 },
    { rarity: "Epic", weight: 0.12, minXP: 220, maxXP: 400, minCoins: 80, maxCoins: 150 },
    { rarity: "Legendary", weight: 0.06, minXP: 500, maxXP: 800, minCoins: 200, maxCoins: 400 },
    { rarity: "Mythic", weight: 0.02, minXP: 1000, maxXP: 1800, minCoins: 500, maxCoins: 1000 },
  ],
};

export const defaultCustomRewards: RewardItem[] = [
  {
    id: "cr_chocolate",
    name: "Indulge in Chocolate",
    description: "Treat yourself to a premium chocolate bar after a hard study session.",
    cost: 50,
    type: "user_defined",
  },
  {
    id: "cr_movie",
    name: "Watch a Movie",
    description: "Redeem for 2 hours of guilt-free screen time watching a film.",
    cost: 200,
    type: "user_defined",
  },
  {
    id: "cr_pizza",
    name: "Cheat Meal Pizza Party",
    description: "Order a fresh hot pizza to reward complete consistency.",
    cost: 500,
    type: "user_defined",
  },
  {
    id: "cr_shopping",
    name: "Retail Therapy Shopping Spree",
    description: "Spend coins to authorize a personal budget purchase.",
    cost: 1000,
    type: "user_defined",
  },
];
