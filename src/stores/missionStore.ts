import { create } from "zustand";
import { Mission, MissionDifficulty, MissionPriority } from "@/types/mission";
import { DailyQuestItem } from "@/types/gameState";
import { missionRepository } from "@/lib/repositories";
import { validationSystem } from "@/game/systems/validationSystem";
import { economySystem } from "@/game/systems/economySystem";
import { eventSystem, EVENTS } from "@/game/systems/eventSystem";
import { gameConfig } from "@/config/game";
import { useUserStore } from "./userStore";
import { levelSystem } from "@/game/systems/levelSystem";
import { getBossForDefeatedCount, calculateBossDamage } from "@/config/bosses";
import { useUiStore } from "./uiStore";
import { logGameplayMutation } from "@/game/diagnostics";
import { missionRewardsConfig } from "@/config/rewards";
import { missionCompletionPipeline } from "@/game/pipelines/missionCompletionPipeline";
import { getTodayStudyMinutes } from "@/game/systems/studyHoursDerivation";

interface MissionState {
  missions: Mission[];
  dailyQuests: DailyQuestItem[];
  isLoading: boolean;
  loadMissions: () => Promise<void>;
  createMission: (data: {
    title: string;
    description: string;
    subject: string;
    difficulty: MissionDifficulty;
    deadline: string;
    priority?: MissionPriority;
    notes?: string;
  }) => Promise<{ success: boolean; errors?: { [key: string]: string } }>;
  lockMission: (id: string) => Promise<void>;
  uploadProof: (id: string, fileName: string) => Promise<void>;
  completeMission: (id: string) => Promise<void>;
  cancelMission: (id: string) => Promise<void>;
  triggerMidnightReset: () => Promise<void>;
  evaluateDailyQuests: () => void;
}

export const useMissionStore = create<MissionState>((set, get) => {
  // Listen for changes that affect daily quests
  eventSystem.subscribe(EVENTS.XP_UPDATED, () => {
    get().evaluateDailyQuests();
  });
  eventSystem.subscribe(EVENTS.PHONE_USAGE_UPDATED, () => {
    get().evaluateDailyQuests();
  });

  return {
    missions: [],
    dailyQuests: [],
    isLoading: true,

    loadMissions: async () => {
      set({ isLoading: true });
      try {
        const storedMissions = await missionRepository.getMissions();
        const finalMissions = storedMissions && storedMissions.length > 0 ? storedMissions : [];
        set({ missions: finalMissions });

        // Daily Reset Check on mount
        const lastReset = localStorage.getItem("studyquest_last_reset_date");
        const todayStr = new Date().toDateString();
        
        if (lastReset !== todayStr) {
          // Set immediately to lock out concurrent trigger executions
          localStorage.setItem("studyquest_last_reset_date", todayStr);
          const tempState = get();
          set({ missions: finalMissions, isLoading: false }); // Set temporarily to allow reset
          await tempState.triggerMidnightReset();
        } else {
          // Load existing daily quests
          const storedQuests = localStorage.getItem("studyquest_daily_quests");
          if (storedQuests) {
            set({ dailyQuests: JSON.parse(storedQuests), isLoading: false });
          } else {
            // Generate new daily quests
            const quests = gameConfig.dailyQuestsTemplates.map((q) => ({
              id: q.id,
              text: q.text,
              targetType: q.targetType,
              targetValue: q.targetValue,
              currentValue: 0,
              completed: false,
            }));
            localStorage.setItem("studyquest_daily_quests", JSON.stringify(quests));
            set({ dailyQuests: quests, isLoading: false });
          }
        }
        
        get().evaluateDailyQuests();
      } catch (error) {
        console.error("Error in loadMissions:", error);
        set({ isLoading: false });
      }
    },

    createMission: async (data) => {
      const { missions } = get();

      const validation = validationSystem.validateMissionForm({
        title: data.title,
        subject: data.subject,
        difficulty: data.difficulty,
        deadline: data.deadline,
        missionsList: missions,
      });

      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      const configRewards = missionRewardsConfig.difficultyRewards[data.difficulty];

      const newMission: Mission = {
        id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title: data.title,
        description: data.description,
        subject: data.subject,
        difficulty: data.difficulty,
        deadline: data.deadline,
        status: "Draft",
        xpReward: configRewards.xp,
        coinReward: configRewards.coins,
        missionPoints: configRewards.missionPoints,
        locked: false,
        proofRequired: true,
        proofUploaded: false,
        createdAt: new Date().toISOString(),
        notes: data.notes,
        priority: data.priority || "Medium",
        energyCost: data.difficulty === "Easy" ? 15 : data.difficulty === "Medium" ? 30 : 50,
      };

      const updated = [newMission, ...missions];
      set({ missions: updated });
      await missionRepository.saveMissions(updated);

      eventSystem.publish(EVENTS.MISSION_CREATED, newMission);
      get().evaluateDailyQuests();

      return { success: true };
    },

    lockMission: async (id) => {
      const { missions } = get();
      const updated = missions.map((m) => {
        if (m.id === id) {
          return { ...m, locked: true, status: "Locked" as const };
        }
        return m;
      });

      set({ missions: updated });
      await missionRepository.saveMissions(updated);

      const target = updated.find((m) => m.id === id);
      if (target) {
        eventSystem.publish(EVENTS.MISSION_LOCKED, target);
        
        // Log to user timeline
        await useUserStore.getState().addJourneyEntry(
          "Mission Committed & Locked",
          `Locked: "${target.title}" to start focus timeline.`,
          "mission"
        );
      }
    },

    uploadProof: async (id, fileName) => {
      const { missions } = get();
      const updated = missions.map((m) => {
        if (m.id === id) {
          return { ...m, proofUploaded: true, proofFileName: fileName };
        }
        return m;
      });

      set({ missions: updated });
      await missionRepository.saveMissions(updated);
    },

    completeMission: async (id) => {
      await missionCompletionPipeline.execute(id);
    },

    cancelMission: async (id) => {
      const { missions } = get();
      const updated = missions.map((m) => {
        if (m.id === id) {
          return { ...m, status: "Cancelled" as const };
        }
        return m;
      });

      set({ missions: updated });
      await missionRepository.saveMissions(updated);

      // Break combo on cancellation of locked mission
      const updatedUser = { ...useUserStore.getState().user, comboMultiplier: 1.0 };
      await useUserStore.getState().userRepositorySave(updatedUser);

      eventSystem.publish(EVENTS.PENALTY_APPLIED, {
        reason: "mission cancellation (Combo reset)",
        amount: 0,
      });
    },

    triggerMidnightReset: async () => {
      const todayStr = new Date().toDateString();
      
      // Reset user counters
      await useUserStore.getState().resetDailyCounters();
      
      // Reset UI chest
      useUiStore.getState().setChestState("closed");

      // Generate new daily quests list
      const quests = gameConfig.dailyQuestsTemplates.map((q) => ({
        id: q.id,
        text: q.text,
        targetType: q.targetType,
        targetValue: q.targetValue,
        currentValue: 0,
        completed: false,
      }));

      localStorage.setItem("studyquest_last_reset_date", todayStr);
      localStorage.setItem("studyquest_daily_quests", JSON.stringify(quests));

      set({ dailyQuests: quests });
      get().evaluateDailyQuests();

      // Timeline log
      await useUserStore.getState().addJourneyEntry(
        "Midnight Reset Activated",
        "Refreshed daily quests, reset daily study hours and screen usage logs.",
        "other"
      );
    },

    evaluateDailyQuests: () => {
      const { missions, dailyQuests } = get();
      if (dailyQuests.length === 0) return;

      const user = useUserStore.getState().user;
      const todayStr = new Date().toDateString();

      // Filter completions today
      const completedToday = missions.filter(
        (m) => m.status === "Completed" && m.completedAt && new Date(m.completedAt).toDateString() === todayStr
      );

      const xpToday = completedToday.reduce((acc, m) => acc + m.xpReward, 0);
      const todayStudyMins = getTodayStudyMinutes();
      const hoursToday = todayStudyMins / 60;
      const hardCompletedToday = completedToday.filter((m) => m.difficulty === "Hard").length;
      const phoneUsageToday = user.phoneUsageMinutes;

      const updated = dailyQuests.map((quest) => {
        let currentValue = 0;
        let completed = false;

        switch (quest.targetType) {
          case "hard_missions":
            currentValue = hardCompletedToday;
            completed = currentValue >= quest.targetValue;
            break;
          case "xp":
            currentValue = xpToday;
            completed = currentValue >= quest.targetValue;
            break;
          case "phone_limit":
            currentValue = phoneUsageToday;
            // Complete if below limit
            completed = currentValue <= quest.targetValue;
            break;
          case "study_hours":
            currentValue = hoursToday;
            completed = currentValue >= quest.targetValue;
            break;
        }

        return {
          ...quest,
          currentValue,
          completed,
        };
      });

      // Check if newly met all daily goals
      const previouslyMetAll = dailyQuests.length > 0 && dailyQuests.every((q) => q.completed);
      const metAllNow = updated.every((q) => q.completed);

      localStorage.setItem("studyquest_daily_quests", JSON.stringify(updated));
      set({ dailyQuests: updated });

      if (metAllNow && !previouslyMetAll) {
        eventSystem.publish(EVENTS.DAILY_GOAL_COMPLETED, {
          xpBonus: gameConfig.dailyGoalBonus.xp,
          coinsBonus: gameConfig.dailyGoalBonus.coins,
        });
      }
    },
  };
});
