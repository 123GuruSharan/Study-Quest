"use client";

import React, { useEffect, useState } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Zap, 
  Coins, 
  CheckCircle, 
  Settings, 
  BookOpen, 
  Award, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useFocusStore } from "@/stores/focusStore";
import { focusTimerEngine, getFocusAnalytics } from "@/game/systems/focusTimerEngine";
import { calculateBossDamage } from "@/config/bosses";

export function PomodoroTimer() {
  const { user } = useUserStore();
  const { missions } = useMissionStore();
  
  const {
    mode,
    preset,
    durationMinutes,
    remainingSeconds,
    isRunning,
    isPaused,
    associatedMissionId,
    history,
    startedSessionsCount,
    showSummaryModal,
    summaryRewards,
    setPreset,
    setAssociatedMissionId,
    closeSummaryModal,
  } = useFocusStore();

  const [customVal, setCustomVal] = useState(25);
  const [showConfig, setShowConfig] = useState(false);

  // Sync running timer and elapsed offsets on mount
  useEffect(() => {
    focusTimerEngine.syncRunningTimer();
  }, []);

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl && 
        (activeEl.tagName === "INPUT" || 
         activeEl.tagName === "TEXTAREA" || 
         activeEl.tagName === "SELECT")
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (!isRunning) {
          focusTimerEngine.startTimer();
        } else if (isPaused) {
          focusTimerEngine.resumeTimer();
        } else {
          focusTimerEngine.pauseTimer();
        }
      } else if (e.code === "Escape") {
        e.preventDefault();
        focusTimerEngine.resetTimer();
      } else if (e.code === "Enter") {
        e.preventDefault();
        if (!isRunning) {
          focusTimerEngine.startTimer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning, isPaused]);

  // Filter locked missions to associate
  const lockedMissions = missions.filter((m) => m.status === "Locked");
  const activeMission = missions.find((m) => m.id === associatedMissionId);

  // Format digital clock
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${pad(m)}:${pad(s)}`;
  };

  // Progress offsets calculation
  const totalDurationSeconds = mode === "work" ? durationMinutes * 60 : 5 * 60;
  const progressRatio = totalDurationSeconds > 0 ? remainingSeconds / totalDurationSeconds : 0;
  const strokeDashoffset = progressRatio * 283;

  // Analytics
  const analytics = getFocusAnalytics(history, startedSessionsCount);

  // Change preset with warning confirmation if running
  const handlePresetChange = (p: typeof preset, val?: number) => {
    if (isRunning) {
      const confirmChange = window.confirm(
        "A focus session is currently running. Changing duration will reset the timer. Proceed?"
      );
      if (!confirmChange) return;
    }
    focusTimerEngine.resetTimer();
    setPreset(p, val);
  };

  return (
    <Card className="p-5 flex flex-col justify-between text-center bg-card border-border-theme relative select-none shadow-md">
      
      {/* Timer Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <Clock size={12} className="text-accent" />
          Focus Command
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Configure Presets"
          >
            <Settings size={13} />
          </button>
          <Badge 
            variant={mode === "work" ? "primary" : "success"} 
            className="text-[9px] uppercase font-extrabold tracking-wider"
          >
            {mode === "work" ? "Deep Work" : "Rest Mode"}
          </Badge>
        </div>
      </div>

      {/* Preset / Duration Selector Panel */}
      {showConfig && (
        <div className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border-theme/40 rounded-xl p-3 mb-4 space-y-2.5 text-left animate-[fadeIn_150ms_ease]">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Select Preset</span>
          <div className="grid grid-cols-4 gap-1.5">
            {(["deep_work", "flow", "ultra_focus", "custom"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  if (p === "custom") {
                    handlePresetChange("custom", customVal);
                  } else {
                    handlePresetChange(p);
                  }
                }}
                className={`py-1 px-1.5 text-[9px] font-bold rounded-lg border transition-all text-center cursor-pointer ${
                  preset === p
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-border-theme/60 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {p === "deep_work" && "25m"}
                {p === "flow" && "50m"}
                {p === "ultra_focus" && "90m"}
                {p === "custom" && "Custom"}
              </button>
            ))}
          </div>

          {preset === "custom" && (
            <div className="space-y-1.5 pt-1.5 border-t border-border-theme/40">
              <div className="flex justify-between items-center text-[9px] text-text-secondary font-bold">
                <span>Duration:</span>
                <span className="text-accent">{customVal} minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="5"
                value={customVal}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomVal(val);
                  handlePresetChange("custom", val);
                }}
                className="w-full accent-accent h-1 rounded-lg bg-slate-200 dark:bg-slate-800 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Associated Mission Selector */}
      {mode === "work" && (
        <div className="w-full mb-4 space-y-2 text-left">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Attached Mission Target</span>
          <select
            value={associatedMissionId}
            onChange={(e) => setAssociatedMissionId(e.target.value)}
            disabled={lockedMissions.length === 0}
            className="w-full h-9 rounded-lg border border-border-theme bg-card px-2.5 text-xs text-text-secondary focus-visible:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-medium"
          >
            <option value="">
              {lockedMissions.length === 0 ? "No locked missions available." : "-- Select Locked Mission --"}
            </option>
            {lockedMissions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.difficulty})
              </option>
            ))}
          </select>

          {activeMission && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-[9px] text-text-secondary font-semibold space-y-1.5 animate-[fadeIn_150ms_ease]">
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="text-text-primary font-bold">{activeMission.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rewards:</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-accent">
                    <Zap size={9} className="fill-current" />
                    +{activeMission.xpReward} XP
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-500">
                    <Coins size={9} className="fill-current" />
                    +{activeMission.coinReward} Coins
                  </span>
                  <span className="flex items-center gap-0.5 text-purple-500">
                    <Sparkles size={9} className="fill-current" />
                    +{activeMission.missionPoints} MP
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Boss Attack:</span>
                <span className="text-danger font-bold">-{calculateBossDamage(activeMission.difficulty)} HP Damage</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Circular Timer Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="var(--border-theme)"
            strokeWidth="3.5"
            fill="transparent"
            className="opacity-25"
          />
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke={mode === "work" ? "var(--accent)" : "#10B981"}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={283 - strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Clock Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black font-mono tracking-tight text-text-primary">
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">
            {mode === "work" ? (isPaused ? "Paused" : "Focusing") : "Break"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2.5 mb-5">
        {mode === "break" ? (
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => focusTimerEngine.skipBreak()}
              className="flex-1 text-[10px] font-bold cursor-pointer h-9 rounded-xl"
            >
              Skip Break
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                focusTimerEngine.skipBreak();
                focusTimerEngine.startTimer();
              }}
              className="flex-1 text-[10px] font-bold cursor-pointer h-9 rounded-xl flex items-center gap-1"
            >
              <Play size={11} />
              <span>Next Session</span>
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled={!isRunning}
              onClick={() => focusTimerEngine.resetTimer()}
              className="w-9 h-9 p-0 rounded-xl shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reset Timer (Esc)"
            >
              <RotateCcw size={13} />
            </Button>

            {!isRunning ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => focusTimerEngine.startTimer()}
                className="h-9 px-6 rounded-xl flex items-center gap-1.5 text-[11px] font-bold cursor-pointer shadow-lg shadow-blue-500/10"
              >
                <Play size={12} className="fill-current" />
                <span>Start Session</span>
              </Button>
            ) : isPaused ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => focusTimerEngine.resumeTimer()}
                className="h-9 px-6 rounded-xl flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Play size={12} className="fill-current" />
                <span>Resume</span>
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => focusTimerEngine.pauseTimer()}
                className="h-9 px-6 rounded-xl flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Pause size={12} />
                <span>Pause</span>
              </Button>
            )}
          </>
        )}
      </div>

      {/* Session Analytics Dashboard Grid */}
      <div className="pt-4 border-t border-border-theme/40 w-full text-left space-y-2.5">
        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Focus Analytics</span>
        
        {history.length === 0 ? (
          <div className="p-3 text-center border border-dashed border-border-theme/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
            <p className="text-[10px] text-text-secondary leading-relaxed font-medium">
              No focus sessions yet. Complete your first Deep Work session to begin your productivity journey.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-text-secondary">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/30">
              <span className="text-[8px] text-text-secondary/70 uppercase tracking-wider block">Today's Focus</span>
              <span className="text-xs font-black text-text-primary font-mono">{analytics.todayFocusMinutes} mins</span>
              <span className="text-[8px] block text-text-secondary/60">({analytics.todaySessionsCount} sessions)</span>
            </div>
            
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/30">
              <span className="text-[8px] text-text-secondary/70 uppercase tracking-wider block">Completion Rate</span>
              <span className="text-xs font-black text-accent font-mono">{analytics.completionRate}%</span>
              <span className="text-[8px] block text-text-secondary/60">({history.length}/{startedSessionsCount} total)</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/30">
              <span className="text-[8px] text-text-secondary/70 uppercase tracking-wider block">Average Session</span>
              <span className="text-xs font-black text-text-primary font-mono">{analytics.averageSession} mins</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/30">
              <span className="text-[8px] text-text-secondary/70 uppercase tracking-wider block">Weekly Volume</span>
              <span className="text-xs font-black text-emerald-500 font-mono">{analytics.weeklyFocusHours} hours</span>
            </div>
          </div>
        )}
      </div>

      {/* Completion Summary Modal overlay */}
      {showSummaryModal && summaryRewards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease] p-4">
          <Card className="p-6 max-w-md w-full text-center border-border-theme bg-card relative overflow-hidden animate-[scaleIn_200ms_ease] space-y-4">
            
            {/* Visual sparkle header */}
            <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto text-success">
              <CheckCircle size={22} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-text-primary tracking-tight">Focus Session Complete!</h3>
              <p className="text-xs text-text-secondary">
                Outstanding progress! You successfully completed your <b>{summaryRewards.preset.replace("_", " ")}</b> preset.
              </p>
            </div>

            {/* Payout summaries card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-border-theme rounded-2xl flex items-center justify-around">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-text-secondary">Duration</span>
                <span className="text-sm font-black text-text-primary block font-mono">{summaryRewards.duration} mins</span>
              </div>
              <div className="h-6 w-px bg-border-theme/60" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-text-secondary">XP Gained</span>
                <span className="text-sm font-black text-accent block font-mono">+{summaryRewards.xp} XP</span>
              </div>
              <div className="h-6 w-px bg-border-theme/60" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-text-secondary">Coins</span>
                <span className="text-sm font-black text-amber-500 block font-mono">+{summaryRewards.coins} Coins</span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  closeSummaryModal();
                  focusTimerEngine.startTimer(); // Immediately start break
                }}
                className="w-full font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                <span>Start 5-Minute Break</span>
                <ArrowRight size={13} />
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => closeSummaryModal()}
                  className="flex-1 font-bold text-xs h-9 rounded-xl cursor-pointer"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
            
          </Card>
        </div>
      )}

    </Card>
  );
}
