import { create } from "zustand";
import { StudySessionLog } from "@/types/statistics";
import { statisticsRepository } from "@/lib/repositories";
import { eventSystem, EVENTS } from "@/game/systems/eventSystem";
import { logGameplayMutation } from "@/game/diagnostics";
import { useUserStore } from "./userStore";

interface StatisticsState {
  historyLogs: StudySessionLog[];
  isLoading: boolean;
  loadHistoryLogs: () => Promise<void>;
  logFocusSession: (minutes: number, xpEarned: number) => Promise<void>;
  updatePhoneUsageLog: (minutes: number) => Promise<void>;
}

// Helper to get local date string YYYY-MM-DD
const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
};

export const useStatisticsStore = create<StatisticsState>((set, get) => {
  // Listen for phone usage updates
  eventSystem.subscribe(EVENTS.PHONE_USAGE_UPDATED, (payload: { minutesUsed: number }) => {
    const todayStr = getLocalDateStr();
    const { historyLogs } = get();

    const updated = historyLogs.map((log) => {
      if (log.date === todayStr) {
        return {
          ...log,
          phoneUsageMinutes: payload.minutesUsed,
        };
      }
      return log;
    });

    const todayLogExists = historyLogs.some((l) => l.date === todayStr);
    if (!todayLogExists) {
      const newLog: StudySessionLog = {
        id: `log_${Date.now()}`,
        date: todayStr,
        minutesFocused: 0,
        xpEarned: 0,
        missionsCompleted: 0,
        phoneUsageMinutes: payload.minutesUsed,
      };
      updated.push(newLog);
    }

    set({ historyLogs: updated });
    statisticsRepository.saveHistoryLogs(updated);
    useUserStore.getState().updateStreakFromHistory(updated);
  });

  return {
    historyLogs: [],
    isLoading: true,

    loadHistoryLogs: async () => {
      set({ isLoading: true });
      const stored = await statisticsRepository.getHistoryLogs();
      const finalLogs = stored && stored.length > 0 ? stored : [];
      set({ historyLogs: finalLogs, isLoading: false });
      await useUserStore.getState().updateStreakFromHistory(finalLogs);
    },

    logFocusSession: async (minutes, xpEarned) => {
      const todayStr = getLocalDateStr();
      const { historyLogs } = get();

      const updated = historyLogs.map((log) => {
        if (log.date === todayStr) {
          return {
            ...log,
            minutesFocused: log.minutesFocused + minutes,
            xpEarned: log.xpEarned + xpEarned,
          };
        }
        return log;
      });

      const todayLogExists = historyLogs.some((l) => l.date === todayStr);
      if (!todayLogExists) {
        const newLog: StudySessionLog = {
          id: `log_${Date.now()}`,
          date: todayStr,
          minutesFocused: minutes,
          xpEarned: xpEarned,
          missionsCompleted: 0,
          phoneUsageMinutes: 0,
        };
        updated.push(newLog);
      }

      set({ historyLogs: updated });
      await statisticsRepository.saveHistoryLogs(updated);
      await useUserStore.getState().updateStreakFromHistory(updated);

      logGameplayMutation({
        mutation: "Log Focus Session",
        previousState: historyLogs,
        supabasePayload: updated,
        dbResponse: "Success (safeDbWrite queued or sent)",
        finalState: updated,
      });
    },

    updatePhoneUsageLog: async (minutes) => {
      eventSystem.publish(EVENTS.PHONE_USAGE_UPDATED, { minutesUsed: minutes });
    },
  };
});
