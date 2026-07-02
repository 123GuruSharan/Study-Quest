import { create } from "zustand";
import { UserProfile } from "@/types/user";
import { UserAchievementLog } from "@/types/achievement";
import { JourneyEntry } from "@/types/journey";
import { RewardItem, defaultCustomRewards } from "@/config/rewards";
import { gameConfig } from "@/config/game";
import { userRepository, achievementRepository, rewardRepository, journeyRepository } from "@/lib/repositories";
import { achievementsConfig } from "@/config/achievements";
import { achievementSystem } from "@/game/systems/achievementSystem";
import { levelSystem } from "@/game/systems/levelSystem";
import { eventSystem, EVENTS } from "@/game/systems/eventSystem";
import { logGameplayMutation } from "@/game/diagnostics";
import { streakEngine } from "@/game/systems/streakEngine";
import { rewardEngine } from "@/game/systems/rewardEngine";

interface UserState {
  user: UserProfile;
  achievements: UserAchievementLog[];
  journeyLog: JourneyEntry[];
  customShopItems: RewardItem[];
  isLoading: boolean;
  
  loadUser: () => Promise<void>;
  incrementStreak: () => Promise<void>;
  updateStreakFromHistory: (historyLogs: any[]) => Promise<void>;
  addStudyHours: (hours: number) => Promise<void>;
  setPhoneUsage: (minutes: number) => Promise<void>;
  setTheme: (theme: "light" | "dark") => Promise<void>;
  updateMissionPoints: (points: number) => Promise<void>;
  checkAchievements: () => Promise<void>;
  
  // Storage helper
  userRepositorySave: (user: UserProfile) => Promise<void>;
  
  // Resets
  resetDailyCounters: () => Promise<void>;
  
  // Custom Shop Actions
  addCustomReward: (name: string, description: string, cost: number, category?: string, cooldownHours?: number, icon?: string) => Promise<void>;
  purchaseCustomReward: (id: string) => Promise<boolean>;
  deleteCustomReward: (id: string) => Promise<void>;
  toggleWishlistReward: (id: string) => Promise<void>;
  editCustomReward: (id: string, name: string, description: string, cost: number, category?: string, cooldownHours?: number, icon?: string) => Promise<void>;
  
  // Journey Timeline Logs
  addJourneyEntry: (title: string, description: string, category: JourneyEntry["category"]) => Promise<void>;
  
  // Surprise Chest Claims
  claimDailyChest: (rewardXp: number, rewardCoins: number) => Promise<void>;

  // Centralized XP and Coins Mutations
  addXp: (amount: number) => Promise<void>;
  removeXp: (amount: number) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  removeCoins: (amount: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => {
  // Listen for level up events to sync in user profile state
  eventSystem.subscribe(EVENTS.LEVEL_UP, (payload: { level: number; rankName: string }) => {
    const { user } = get();
    const updated = { ...user, level: payload.level, rankName: payload.rankName };
    set({ user: updated });
    userRepository.saveUser(updated);
  });

  // Listen to daily goal completion to disburse bonuses
  eventSystem.subscribe(EVENTS.DAILY_GOAL_COMPLETED, async (payload: { xpBonus: number; coinsBonus: number }) => {
    await get().addXp(payload.xpBonus);
    await get().addCoins(payload.coinsBonus);
    
    await get().addJourneyEntry(
      "Daily Quests Completed!",
      `Earned daily quest chest bonus: +${payload.xpBonus} XP and +${payload.coinsBonus} Coins.`,
      "achievement"
    );
  });

  // Listen to progression events to check achievements automatically
  eventSystem.subscribe(EVENTS.XP_UPDATED, () => {
    get().checkAchievements();
  });
  eventSystem.subscribe(EVENTS.MISSION_COMPLETED, () => {
    get().checkAchievements();
  });
  eventSystem.subscribe(EVENTS.COIN_UPDATED, () => {
    get().checkAchievements();
  });
  eventSystem.subscribe(EVENTS.PHONE_USAGE_UPDATED, () => {
    get().checkAchievements();
  });

  return {
    user: {} as any,
    achievements: [],
    journeyLog: [],
    customShopItems: [],
    isLoading: true,

    loadUser: async () => {
      set({ isLoading: true });
      try {
        const storedUser = await userRepository.getUser();
        const storedAchievements = await achievementRepository.getAchievementLogs();
        
        // Load custom shop items through injected repository (initialize empty)
        const storedShop = await rewardRepository.getRewards();
        let finalShop: RewardItem[] = [];
        if (storedShop && storedShop.length > 0) {
          finalShop = storedShop.map(rewardEngine.deserializeReward);
        } else {
          // If no custom shop rewards exist in DB, populate default custom rewards!
          finalShop = defaultCustomRewards.map(rewardEngine.deserializeReward);
          await rewardRepository.saveRewards(finalShop.map(rewardEngine.serializeReward));
        }

        // Load journey logs through injected repository
        const storedJourney = await journeyRepository.getJourneyEntries();
        let finalJourney: JourneyEntry[] = [
          {
            id: "j_seed_1",
            title: "Welcome to StudyQuest.",
            category: "other",
            description: "Your journey begins today.",
            timestamp: new Date().toISOString(),
          },
        ];
        if (storedJourney && storedJourney.length > 0) {
          finalJourney = storedJourney;
        }

        const defaultProfile: UserProfile = {
          id: "user_alex",
          username: "Alex",
          level: 1,
          rankName: "Novice Mind",
          xp: 0,
          coins: 0,
          streak: 0,
          comboMultiplier: 1.0,
          studyHours: 0.0,
          phoneUsageMinutes: 0,
          missionPoints: 0,
          theme: "light",
          bossHp: 25000,
          bossesDefeatedCount: 0,
        };

        let finalUser = defaultProfile;
        const initialAchievements: UserAchievementLog[] = achievementsConfig.map((ach) => ({
          achievementId: ach.id,
          unlockedAt: "",
          claimed: false,
          progressPercentage: 0,
        }));
        let finalAchievements = initialAchievements;

        if (storedUser) {
          const cleanStoredUser = Object.fromEntries(
            Object.entries(storedUser).filter(([_, v]) => v !== null && v !== undefined)
          );
          finalUser = { ...defaultProfile, ...cleanStoredUser };
        }

        if (storedAchievements && storedAchievements.length > 0) {
          finalAchievements = storedAchievements;
        }

        set({
          user: finalUser,
          achievements: finalAchievements,
          journeyLog: finalJourney,
          customShopItems: finalShop,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error in loadUser:", error);
        set({ isLoading: false });
      }
    },

    incrementStreak: async () => {
      const { user } = get();
      const nextStreak = user.streak + 1;
      const updated = { ...user, streak: nextStreak };
      set({ user: updated });
      await userRepository.saveUser(updated);

      // Check if user reached a new streak milestone dynamically from config
      const matchedTier = gameConfig.streakRules.tiers.find((t) => t.days === nextStreak);
      if (matchedTier && matchedTier.days > 0) {
        await get().addJourneyEntry(
          `${matchedTier.tierName} Unlocked`,
          `Maintained study streak of ${matchedTier.days} days.`,
          "streak"
        );
      }
    },

    updateStreakFromHistory: async (historyLogs: any[]) => {
      const { user } = get();
      if (!user || !user.id) return;

      const nextStreak = streakEngine.calculateStreak(historyLogs);
      if (user.streak !== nextStreak) {
        const updated = { ...user, streak: nextStreak };
        set({ user: updated });
        await userRepository.saveUser(updated);

        // Check if user reached a new streak milestone dynamically from config
        const matchedTier = gameConfig.streakRules.tiers.find((t) => t.days === nextStreak);
        if (matchedTier && matchedTier.days > 0) {
          await get().addJourneyEntry(
            `${matchedTier.tierName} Unlocked`,
            `Maintained study streak of ${matchedTier.days} days.`,
            "streak"
          );
        }

        logGameplayMutation({
          mutation: `Streak Updated From History: ${user.streak} -> ${nextStreak}`,
          previousState: user,
          supabasePayload: updated,
          dbResponse: "Success (safeDbWrite queued or sent)",
          finalState: updated,
        });
      }
    },

    addStudyHours: async (hours: number) => {
      const { user } = get();
      const updated = { ...user, studyHours: parseFloat((user.studyHours + hours).toFixed(1)) };
      set({ user: updated });
      await userRepository.saveUser(updated);
    },

    setPhoneUsage: async (minutes: number) => {
      const { user } = get();
      const updated = { ...user, phoneUsageMinutes: minutes };
      set({ user: updated });
      await userRepository.saveUser(updated);
      eventSystem.publish(EVENTS.PHONE_USAGE_UPDATED, { minutesUsed: minutes });
    },

    setTheme: async (theme: "light" | "dark") => {
      const { user } = get();
      const updated = { ...user, theme };
      set({ user: updated });
      await userRepository.saveUser(updated);
    },

    updateMissionPoints: async (points: number) => {
      const { user } = get();
      const updated = { ...user, missionPoints: Math.max(0, user.missionPoints + points) };
      set({ user: updated });
      await userRepository.saveUser(updated);
    },

    checkAchievements: async () => {
      const { user, achievements } = get();
      const { missions } = await import("./missionStore").then((mod) => mod.useMissionStore.getState());
      const completedMissionsCount = missions.filter((m) => m.status === "Completed").length;

      const evaluation = achievementSystem.evaluateAchievements(
        {
          streak: user.streak,
          studyHours: user.studyHours,
          completedMissionsCount,
          level: user.level,
          bossesDefeatedCount: Math.floor(completedMissionsCount / 10),
          totalCoinsEarned: user.coins,
        },
        achievements
      );

      if (evaluation.newlyUnlocked.length > 0) {
        let nextXp = user.xp;
        let nextCoins = user.coins;

        for (const ach of evaluation.newlyUnlocked) {
          nextXp += ach.rewardXP;
          nextCoins += ach.rewardCoins;

          await get().addJourneyEntry(
            "Achievement Unlocked",
            `Milestone achieved: "${ach.title}". Gained +${ach.rewardXP} XP and +${ach.rewardCoins} Coins.`,
            "achievement"
          );

          eventSystem.publish(EVENTS.XP_UPDATED, { xp: nextXp, amountGained: ach.rewardXP });
          eventSystem.publish(EVENTS.COIN_UPDATED, { coins: nextCoins, amountGained: ach.rewardCoins });
        }

        const details = levelSystem.calculateLevelDetails(nextXp);
        const oldLevel = user.level;

        const updatedUser = {
          ...user,
          xp: nextXp,
          level: details.level,
          rankName: details.rankName,
          coins: nextCoins,
        };

        set({ user: updatedUser, achievements: evaluation.updatedLogs });
        await userRepository.saveUser(updatedUser);
        await achievementRepository.saveAchievementLogs(evaluation.updatedLogs);

        if (details.level > oldLevel) {
          eventSystem.publish(EVENTS.LEVEL_UP, {
            level: details.level,
            rankName: details.rankName,
          });
        }
      }
    },

    userRepositorySave: async (updatedUser: UserProfile) => {
      set({ user: updatedUser });
      await userRepository.saveUser(updatedUser);
    },

    resetDailyCounters: async () => {
      const { user } = get();
      const updated = { ...user, phoneUsageMinutes: 0, missionPoints: 0 };
      set({ user: updated });
      await userRepository.saveUser(updated);
    },

    addCustomReward: async (name, description, cost, category, cooldownHours, icon) => {
      const { customShopItems } = get();
      const newItem: RewardItem = {
        id: `cr_${Date.now()}`,
        name,
        description,
        cost,
        type: "user_defined",
        category: (category as any) || "Custom",
        cooldownHours: cooldownHours || 0,
        timesClaimed: 0,
        lastClaimedAt: null,
        isCustom: true,
        wishlist: false,
        icon: icon || "🎁",
        image: "",
      };

      const updated = [...customShopItems, newItem];
      await rewardRepository.saveRewards(updated.map(rewardEngine.serializeReward));
      set({ customShopItems: updated });
    },

    purchaseCustomReward: async (id) => {
      const { customShopItems, user } = get();
      const item = customShopItems.find((i) => i.id === id);
      if (!item) return false;

      const validation = rewardEngine.canPurchase(item, user.coins);
      if (!validation.eligible) return false;

      const nextCoins = user.coins - item.cost;
      const updatedItem: RewardItem = {
        ...item,
        timesClaimed: (item.timesClaimed || 0) + 1,
        lastClaimedAt: new Date().toISOString(),
      };

      const updatedItems = customShopItems.map((i) => (i.id === id ? updatedItem : i));
      const updatedUser = { ...user, coins: nextCoins };

      set({ user: updatedUser, customShopItems: updatedItems });
      await userRepository.saveUser(updatedUser);
      await rewardRepository.saveRewards(updatedItems.map(rewardEngine.serializeReward));

      // Publish events
      eventSystem.publish(EVENTS.COIN_UPDATED, { coins: nextCoins, amountLost: item.cost });

      // Add structured journey log entries
      const purchaseLogPayload = {
        rewardId: item.id,
        name: item.name,
        cost: item.cost,
        category: item.category || "Custom",
        timestamp: new Date().toISOString(),
      };

      await get().addJourneyEntry(
        "Reward Redeemed",
        JSON.stringify(purchaseLogPayload),
        "reward"
      );

      return true;
    },

    deleteCustomReward: async (id) => {
      const { customShopItems } = get();
      const updated = customShopItems.filter((i) => i.id !== id);
      await rewardRepository.saveRewards(updated.map(rewardEngine.serializeReward));
      set({ customShopItems: updated });
    },

    toggleWishlistReward: async (id) => {
      const { customShopItems } = get();
      const updated = customShopItems.map((i) =>
        i.id === id ? { ...i, wishlist: !i.wishlist } : i
      );
      await rewardRepository.saveRewards(updated.map(rewardEngine.serializeReward));
      set({ customShopItems: updated });
    },

    editCustomReward: async (id, name, description, cost, category, cooldownHours, icon) => {
      const { customShopItems } = get();
      const updated = customShopItems.map((i) =>
        i.id === id
          ? {
              ...i,
              name,
              description,
              cost,
              category: (category as any) || i.category,
              cooldownHours: cooldownHours !== undefined ? cooldownHours : i.cooldownHours,
              icon: icon || i.icon,
            }
          : i
      );
      await rewardRepository.saveRewards(updated.map(rewardEngine.serializeReward));
      set({ customShopItems: updated });
    },

    addJourneyEntry: async (title, description, category) => {
      const { journeyLog } = get();
      const newEntry: JourneyEntry = {
        id: `j_${Date.now()}`,
        title,
        category,
        description,
        timestamp: new Date().toISOString(),
      };

      const updated = [newEntry, ...journeyLog];
      await journeyRepository.saveJourneyEntries(updated);
      set({ journeyLog: updated });
    },

    claimDailyChest: async (rewardXp: number, rewardCoins: number) => {
      const { user } = get();
      
      const nextXp = user.xp + rewardXp;
      const details = levelSystem.calculateLevelDetails(nextXp);
      const oldLevel = user.level;
      const nextCoins = user.coins + rewardCoins;
      
      const updated = {
        ...user,
        xp: nextXp,
        level: details.level,
        rankName: details.rankName,
        coins: nextCoins,
        lastChestClaimedAt: new Date().toDateString(),
      };
      
      set({ user: updated });
      await userRepository.saveUser(updated);

      logGameplayMutation({
        mutation: "Claim Daily Chest",
        previousState: user,
        supabasePayload: updated,
        dbResponse: "Success (safeDbWrite queued or sent)",
        finalState: updated,
      });
      
      eventSystem.publish(EVENTS.XP_UPDATED, { xp: nextXp, amountGained: rewardXp });
      eventSystem.publish(EVENTS.COIN_UPDATED, { coins: nextCoins, amountGained: rewardCoins });
      
      if (details.level > oldLevel) {
        eventSystem.publish(EVENTS.LEVEL_UP, {
          level: details.level,
          rankName: details.rankName,
        });
      }
      await get().checkAchievements();
    },

    addXp: async (amount: number) => {
      const { user } = get();
      const currentXP = user.xp + amount;
      const details = levelSystem.calculateLevelDetails(currentXP);
      const oldLevel = user.level;

      const updated = {
        ...user,
        xp: currentXP,
        level: details.level,
        rankName: details.rankName,
      };
      set({ user: updated });
      await userRepository.saveUser(updated);

      eventSystem.publish(EVENTS.XP_UPDATED, { xp: currentXP, amountGained: amount });

      if (details.level > oldLevel) {
        eventSystem.publish(EVENTS.LEVEL_UP, {
          level: details.level,
          rankName: details.rankName,
        });
      }
    },

    removeXp: async (amount: number) => {
      const { user } = get();
      const currentXP = Math.max(0, user.xp - amount);
      const details = levelSystem.calculateLevelDetails(currentXP);

      const updated = {
        ...user,
        xp: currentXP,
        level: details.level,
        rankName: details.rankName,
      };
      set({ user: updated });
      await userRepository.saveUser(updated);

      eventSystem.publish(EVENTS.XP_UPDATED, { xp: currentXP, amountLost: amount });
    },

    addCoins: async (amount: number) => {
      const { user } = get();
      const currentCoins = user.coins + amount;

      const updated = {
        ...user,
        coins: currentCoins,
      };
      set({ user: updated });
      await userRepository.saveUser(updated);

      eventSystem.publish(EVENTS.COIN_UPDATED, { coins: currentCoins, amountGained: amount });
    },

    removeCoins: async (amount: number) => {
      const { user } = get();
      const currentCoins = Math.max(0, user.coins - amount);

      const updated = {
        ...user,
        coins: currentCoins,
      };
      set({ user: updated });
      await userRepository.saveUser(updated);

      eventSystem.publish(EVENTS.COIN_UPDATED, { coins: currentCoins, amountLost: amount });
    },
  };
});
