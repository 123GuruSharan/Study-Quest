import { eventSystem, EVENTS } from "./eventSystem";
import { timerSystem } from "./timerSystem";
import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { useFocusStore, CompletedSession } from "@/stores/focusStore";

export function playCompletionSound() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Play a nice success double tone
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    osc.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.error("Failed to play audio:", err);
  }
}

export class FocusTimerEngine {
  private intervalId: NodeJS.Timeout | null = null;

  startTimer() {
    const store = useFocusStore.getState();
    if (store.isRunning) return;

    useFocusStore.setState({ 
      isRunning: true, 
      isPaused: false, 
      lastTickTimestamp: Date.now(),
      startedSessionsCount: store.startedSessionsCount + 1
    });
    
    // If a mission is attached and hasn't started yet, mark it started
    if (store.associatedMissionId) {
      const missionStore = useMissionStore.getState();
      const mission = missionStore.missions.find((m) => m.id === store.associatedMissionId);
      if (mission && !mission.startedAt) {
        useMissionStore.setState((state) => ({
          missions: state.missions.map((m) =>
            m.id === store.associatedMissionId ? { ...m, startedAt: new Date().toISOString() } : m
          ),
        }));
      }
    }

    console.group("Timer Started");
    console.log("Preset:", store.preset);
    console.log("Duration:", store.durationMinutes, "minutes");
    console.log("Attached Mission ID:", store.associatedMissionId || "None");
    console.groupEnd();

    this.tick();
  }

  pauseTimer() {
    const store = useFocusStore.getState();
    if (!store.isRunning || store.isPaused) return;

    useFocusStore.setState({ isPaused: true });
    this.clearTickInterval();

    console.group("Timer Paused");
    console.log("Remaining Seconds:", store.remainingSeconds);
    console.groupEnd();
  }

  resumeTimer() {
    const store = useFocusStore.getState();
    if (!store.isRunning || !store.isPaused) return;

    useFocusStore.setState({ isPaused: false, lastTickTimestamp: Date.now() });

    console.group("Timer Resumed");
    console.log("Remaining Seconds:", store.remainingSeconds);
    console.groupEnd();

    this.tick();
  }

  resetTimer() {
    const store = useFocusStore.getState();
    this.clearTickInterval();

    const durationSeconds = store.durationMinutes * 60;
    useFocusStore.setState({
      isRunning: false,
      isPaused: false,
      remainingSeconds: durationSeconds,
      lastTickTimestamp: 0,
      associatedMissionId: "",
    });

    console.group("Timer Reset");
    console.log("Reset to Duration:", store.durationMinutes, "minutes");
    console.groupEnd();
  }

  skipBreak() {
    const store = useFocusStore.getState();
    if (store.mode !== "break") return;

    this.clearTickInterval();
    useFocusStore.setState({
      mode: "work",
      isRunning: false,
      isPaused: false,
      remainingSeconds: store.durationMinutes * 60,
    });

    console.log("Timer Break Skipped");
  }

  // Ticks every second
  private tick() {
    this.clearTickInterval();

    this.intervalId = setInterval(() => {
      const store = useFocusStore.getState();
      if (!store.isRunning || store.isPaused) {
        this.clearTickInterval();
        return;
      }

      const now = Date.now();
      const lastTick = store.lastTickTimestamp || now;
      const elapsed = Math.max(1, Math.floor((now - lastTick) / 1000));
      const nextRemaining = Math.max(0, store.remainingSeconds - elapsed);

      useFocusStore.setState({
        remainingSeconds: nextRemaining,
        lastTickTimestamp: now,
      });

      if (nextRemaining === 0) {
        this.clearTickInterval();
        this.handleTimerComplete();
      }
    }, 1000);
  }

  private clearTickInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Sync remaining seconds if page was closed/refreshed
  syncRunningTimer() {
    const store = useFocusStore.getState();
    if (!store.isRunning || store.isPaused || !store.lastTickTimestamp) return;

    const now = Date.now();
    const elapsed = Math.floor((now - store.lastTickTimestamp) / 1000);
    if (elapsed > 0) {
      const nextRemaining = Math.max(0, store.remainingSeconds - elapsed);
      useFocusStore.setState({
        remainingSeconds: nextRemaining,
        lastTickTimestamp: now,
      });

      console.group("Timer Synced Post-Hydration");
      console.log("Elapsed while offline:", elapsed, "seconds");
      console.log("New remaining:", nextRemaining, "seconds");
      console.groupEnd();

      if (nextRemaining === 0) {
        this.handleTimerComplete();
      } else {
        this.tick();
      }
    } else {
      this.tick();
    }
  }

  private async handleTimerComplete() {
    const store = useFocusStore.getState();
    const userStore = useUserStore.getState();
    const currentMode = store.mode;

    useFocusStore.setState({
      isRunning: false,
      isPaused: false,
    });

    if (currentMode === "work") {
      const minutesFocused = store.durationMinutes;
      const hoursFocused = parseFloat((minutesFocused / 60).toFixed(2));
      const comboMultiplier = userStore.user?.comboMultiplier || 1.0;

      let xpGained = 25;
      let coinsGained = 2;
      let missionCompleted = false;

      console.group("Timer Completed & Processing Rewards");

      if (store.associatedMissionId) {
        const missionStore = useMissionStore.getState();
        const mission = missionStore.missions.find((m) => m.id === store.associatedMissionId);
        if (mission) {
          xpGained = mission.xpReward;
          coinsGained = mission.coinReward;
          missionCompleted = true;

          console.log("Completing attached mission:", mission.title);
          await missionStore.completeMission(store.associatedMissionId);
        }
      } else {
        // No mission selected: Award default 25 XP and 2 Coins
        xpGained = timerSystem.calculateFocusXP(minutesFocused, comboMultiplier);
        coinsGained = timerSystem.calculateFocusCoins(minutesFocused);

        console.log("No mission attached. Awarding standard focus payouts.");
        await userStore.addXp(xpGained);
        await userStore.addCoins(coinsGained);
        await userStore.addStudyHours(hoursFocused);
        await useStatisticsStore.getState().logFocusSession(minutesFocused, xpGained);
        await userStore.checkAchievements();

        await userStore.addJourneyEntry(
          "Focus Session Completed",
          `Logged ${minutesFocused} focus minutes. Earned +${xpGained} XP and +${coinsGained} Coins.`,
          "mission"
        );
      }

      // Add to completed sessions history
      const newSession: CompletedSession = {
        id: `session_${Date.now()}`,
        preset: store.preset,
        durationMinutes: minutesFocused,
        missionId: store.associatedMissionId || null,
        completedAt: new Date().toISOString(),
        xpEarned: xpGained,
        coinsEarned: coinsGained,
      };

      const updatedHistory = [newSession, ...store.history];
      
      // Calculate today's stats from history
      const todayStr = new Date().toDateString();
      const todaySessions = updatedHistory.filter(
        (s) => new Date(s.completedAt).toDateString() === todayStr
      );
      const completedToday = todaySessions.length;
      const focusMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

      useFocusStore.setState({
        history: updatedHistory,
        completedSessionsToday: completedToday,
        focusMinutesToday: focusMinutesToday,
        showSummaryModal: true,
        summaryRewards: { xp: xpGained, coins: coinsGained, duration: minutesFocused, preset: store.preset },
        mode: "break",
        remainingSeconds: 5 * 60, // Suggest 5 min break
        associatedMissionId: "",  // Clear attached mission
      });

      console.log("Rewards Granted: XP =", xpGained, ", Coins =", coinsGained);
      console.log("Database & Local State Saved");
      console.groupEnd();

      // Play beep
      playCompletionSound();

      // Trigger completion events / sounds
      eventSystem.publish(EVENTS.FOCUS_SESSION_COMPLETED, newSession);
    } else {
      // Break completed: switch back to work
      useFocusStore.setState({
        mode: "work",
        remainingSeconds: store.durationMinutes * 60,
      });
      console.log("Break Completed. Ready for next session.");
      playCompletionSound();
    }
  }
}

export const focusTimerEngine = new FocusTimerEngine();

export function getFocusAnalytics(history: CompletedSession[], startedCount: number) {
  const todayStr = new Date().toDateString();
  const todaySessions = history.filter(
    (s) => new Date(s.completedAt).toDateString() === todayStr
  );

  const todaySessionsCount = todaySessions.length;
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Average Session
  const averageSession = history.length > 0 
    ? Math.round(history.reduce((acc, s) => acc + s.durationMinutes, 0) / history.length)
    : 0;

  // Longest Session
  const longestSession = history.length > 0
    ? Math.max(...history.map((s) => s.durationMinutes))
    : 0;

  // Completion Rate
  const totalCompleted = history.length;
  const totalStarted = Math.max(totalCompleted, startedCount);
  const completionRate = totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 100;

  // Weekly Focus
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklySessions = history.filter(
    (s) => new Date(s.completedAt).getTime() >= oneWeekAgo
  );
  const weeklyFocusHours = parseFloat((weeklySessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1));

  return {
    todaySessionsCount,
    todayFocusMinutes,
    averageSession,
    longestSession,
    completionRate,
    weeklyFocusHours,
  };
}
