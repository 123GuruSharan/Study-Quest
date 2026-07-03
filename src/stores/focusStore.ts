"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompletedSession {
  id: string;
  preset: string;
  durationMinutes: number;
  missionId: string | null;
  completedAt: string;
  xpEarned: number;
  coinsEarned: number;
}

interface FocusState {
  mode: "work" | "break";
  preset: "deep_work" | "flow" | "ultra_focus" | "custom";
  durationMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  associatedMissionId: string;
  completedSessionsToday: number;
  focusMinutesToday: number;
  lastTickTimestamp: number;
  history: CompletedSession[];
  startedSessionsCount: number;
  
  showSummaryModal: boolean;
  summaryRewards: { xp: number; coins: number; duration: number; preset: string } | null;
  
  // Immersive Focus Mode Status
  isFocusModeActive: boolean;

  setPreset: (preset: "deep_work" | "flow" | "ultra_focus" | "custom", customMinutes?: number) => void;
  setAssociatedMissionId: (missionId: string) => void;
  closeSummaryModal: () => void;
  setFocusModeActive: (active: boolean) => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      mode: "work",
      preset: "deep_work",
      durationMinutes: 25,
      remainingSeconds: 25 * 60,
      isRunning: false,
      isPaused: false,
      associatedMissionId: "",
      completedSessionsToday: 0,
      focusMinutesToday: 0,
      lastTickTimestamp: 0,
      history: [],
      startedSessionsCount: 0,
      
      showSummaryModal: false,
      summaryRewards: null,
      
      isFocusModeActive: false,

      setPreset: (preset, customMinutes) => {
        const store = get();
        if (store.isRunning) return;

        let minutes = 25;
        if (preset === "flow") minutes = 50;
        else if (preset === "ultra_focus") minutes = 90;
        else if (preset === "custom" && customMinutes !== undefined) {
          minutes = Math.max(15, Math.min(180, Math.round(customMinutes / 5) * 5));
        }

        set({
          preset,
          durationMinutes: minutes,
          remainingSeconds: minutes * 60,
        });
      },

      setAssociatedMissionId: (missionId) => {
        set({ associatedMissionId: missionId });
      },

      closeSummaryModal: () => {
        set({ showSummaryModal: false, summaryRewards: null });
      },

      setFocusModeActive: (active) => {
        set({ isFocusModeActive: active });
      },
    }),
    {
      name: "studyquest_focus_store",
      partialize: (state) => ({
        mode: state.mode,
        preset: state.preset,
        durationMinutes: state.durationMinutes,
        remainingSeconds: state.remainingSeconds,
        isRunning: state.isRunning,
        isPaused: state.isPaused,
        associatedMissionId: state.associatedMissionId,
        completedSessionsToday: state.completedSessionsToday,
        focusMinutesToday: state.focusMinutesToday,
        lastTickTimestamp: state.lastTickTimestamp,
        history: state.history,
        startedSessionsCount: state.startedSessionsCount,
        isFocusModeActive: state.isFocusModeActive,
      }),
    }
  )
);
