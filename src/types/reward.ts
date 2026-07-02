export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "boost" | "item" | "customization" | "shield";
  effect: string;
  unlocked?: boolean;
}

export interface PurchaseRecord {
  id: string;
  rewardId: string;
  purchasedAt: string;
  coinsSpent: number;
  applied?: boolean;
}
