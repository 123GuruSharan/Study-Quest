import { RewardItem } from "@/config/rewards";

export class RewardEngine {
  /**
   * Checks if a reward is currently on cooldown.
   */
  getCooldownRemaining(reward: RewardItem): { active: boolean; remainingMs: number; formatted: string } {
    if (!reward.lastClaimedAt || !reward.cooldownHours || reward.cooldownHours <= 0) {
      return { active: false, remainingMs: 0, formatted: "" };
    }

    const elapsed = Date.now() - new Date(reward.lastClaimedAt).getTime();
    const cooldownMs = reward.cooldownHours * 60 * 60 * 1000;
    const remainingMs = cooldownMs - elapsed;

    if (remainingMs <= 0) {
      return { active: false, remainingMs: 0, formatted: "" };
    }

    // Format remaining time (e.g. "12h 30m" or "45m")
    const totalMinutes = Math.ceil(remainingMs / 60000);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const formatted = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    return { active: true, remainingMs, formatted };
  }

  /**
   * Validates if the user can purchase a reward.
   */
  canPurchase(reward: RewardItem, userCoins: number): { eligible: boolean; reason: string; coinsNeeded: number } {
    if (userCoins < reward.cost) {
      return {
        eligible: false,
        reason: `Need ${reward.cost - userCoins} more coins`,
        coinsNeeded: reward.cost - userCoins,
      };
    }

    const cooldown = this.getCooldownRemaining(reward);
    if (cooldown.active) {
      return {
        eligible: false,
        reason: `On cooldown for ${cooldown.formatted}`,
        coinsNeeded: 0,
      };
    }

    return { eligible: true, reason: "Affordable", coinsNeeded: 0 };
  }

  /**
   * Helper to deserialize extended fields from standard description.
   */
  deserializeReward(r: RewardItem): RewardItem {
    if (!r.description || !r.description.startsWith("{")) {
      return {
        ...r,
        category: "Custom",
        cooldownHours: 0,
        timesClaimed: 0,
        lastClaimedAt: null,
        isCustom: r.id.startsWith("cr_") && !["cr_chocolate", "cr_movie", "cr_pizza", "cr_shopping"].includes(r.id),
        wishlist: false,
        icon: "🎁",
        image: "",
      };
    }

    try {
      const parsed = JSON.parse(r.description);
      return {
        ...r,
        description: parsed.userDescription || "",
        category: parsed.category || "Custom",
        cooldownHours: parsed.cooldownHours || 0,
        timesClaimed: parsed.timesClaimed || 0,
        lastClaimedAt: parsed.lastClaimedAt || null,
        isCustom: parsed.isCustom !== undefined ? parsed.isCustom : true,
        wishlist: parsed.wishlist || false,
        icon: parsed.icon || "🎁",
        image: parsed.image || "",
      };
    } catch {
      return {
        ...r,
        category: "Custom",
        cooldownHours: 0,
        timesClaimed: 0,
        lastClaimedAt: null,
        isCustom: true,
        wishlist: false,
        icon: "🎁",
        image: "",
      };
    }
  }

  /**
   * Helper to serialize extended fields into standard description.
   */
  serializeReward(r: RewardItem): RewardItem {
    const payload = {
      userDescription: r.description,
      category: r.category || "Custom",
      cooldownHours: r.cooldownHours || 0,
      timesClaimed: r.timesClaimed || 0,
      lastClaimedAt: r.lastClaimedAt || null,
      isCustom: r.isCustom !== undefined ? r.isCustom : true,
      wishlist: r.wishlist || false,
      icon: r.icon || "🎁",
      image: r.image || "",
    };

    return {
      id: r.id,
      name: r.name,
      description: JSON.stringify(payload),
      cost: r.cost,
      type: r.type,
    };
  }

  /**
   * Computes purchase statistics and analytics.
   */
  getShopAnalytics(journeyLog: any[], userCoins: number, shopItems: RewardItem[]) {
    // Filter reward redemption logs
    const purchaseLogs = journeyLog
      .filter((entry) => entry.category === "reward")
      .map((entry) => {
        try {
          return JSON.parse(entry.description);
        } catch {
          return null;
        }
      })
      .filter((p) => p !== null);

    const totalSpent = purchaseLogs.reduce((acc, p) => acc + (p.cost || 0), 0);
    const totalPurchases = purchaseLogs.length;

    // Lifetime Coins Earned: Spent + current coins (approximation)
    const lifetimeEarned = totalSpent + userCoins;

    // Savings Rate (approximation): current coins / lifetime earned
    const savingsRate = lifetimeEarned > 0 ? Math.round((userCoins / lifetimeEarned) * 100) : 100;

    // Wishlist items count
    const wishlistItems = shopItems.filter((i) => i.wishlist).length;

    // Most purchased category
    const categoryPurchases: { [cat: string]: number } = {};
    purchaseLogs.forEach((p) => {
      const cat = p.category || "Custom";
      categoryPurchases[cat] = (categoryPurchases[cat] || 0) + 1;
    });
    const mostPurchasedCategory = Object.entries(categoryPurchases)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    // Purchase timing metrics
    const todayStr = new Date().toDateString();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const purchasedToday = journeyLog.filter(
      (entry) => entry.category === "reward" && new Date(entry.timestamp).toDateString() === todayStr
    ).length;

    const purchasedThisWeek = journeyLog.filter(
      (entry) => entry.category === "reward" && new Date(entry.timestamp).getTime() >= oneWeekAgo
    ).length;

    const avgSpending = totalPurchases > 0 ? Math.round(totalSpent / totalPurchases) : 0;
    
    const mostExpensive = purchaseLogs.length > 0
      ? Math.max(...purchaseLogs.map((p) => p.cost || 0))
      : 0;

    return {
      currentCoins: userCoins,
      lifetimeCoinsEarned: lifetimeEarned,
      lifetimeCoinsSpent: totalSpent,
      savingsRate,
      purchasesCount: totalPurchases,
      wishlistCount: wishlistItems,
      mostPurchasedCategory,
      purchasedToday,
      purchasedThisWeek,
      averageSpending: avgSpending,
      mostExpensivePurchase: mostExpensive,
    };
  }
}

export const rewardEngine = new RewardEngine();
