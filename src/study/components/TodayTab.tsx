"use client";

import React, { useEffect, useState } from "react";
import { useStudyStore } from "../stores/studyStore";
import { StudyBlock, SessionStatus } from "../types/study";
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  RotateCcw,
  Calendar,
  AlertCircle,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  HelpCircle,
  FileCode,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Day12DsaProblemsWidget,
  Day12CheatSheetWidget,
  Day12AsyncProjectWidget,
  Day12FinalChecklistWidget,
} from "./Day12InteractiveContent";
import {
  Day13DsaProblemsWidget,
  Day13CheatSheetWidget,
  Day13AsyncProjectWidget,
  Day13FinalChecklistWidget,
} from "./Day13InteractiveContent";
import {
  Day14DsaProblemsWidget,
  Day14CheatSheetWidget,
  Day14AsyncProjectWidget,
  Day14FinalChecklistWidget,
} from "./Day14InteractiveContent";
import {
  Day15DsaProblemsWidget,
  Day15CheatSheetWidget,
  Day15AsyncProjectWidget,
  Day15FinalChecklistWidget,
} from "./Day15InteractiveContent";
import {
  Day16DsaProblemsWidget,
  Day16CheatSheetWidget,
  Day16AsyncProjectWidget,
  Day16FinalChecklistWidget,
} from "./Day16InteractiveContent";
import {
  Day17DsaProblemsWidget,
  Day17CheatSheetWidget,
  Day17AsyncProjectWidget,
  Day17FinalChecklistWidget,
} from "./Day17InteractiveContent";
import {
  Day18DsaProblemsWidget,
  Day18CheatSheetWidget,
  Day18AsyncProjectWidget,
  Day18FinalChecklistWidget,
} from "./Day18InteractiveContent";
import {
  Day19DsaProblemsWidget,
  Day19CheatSheetWidget,
  Day19AsyncProjectWidget,
  Day19FinalChecklistWidget,
} from "./Day19InteractiveContent";
import {
  Day20DsaProblemsWidget,
  Day20CheatSheetWidget,
  Day20AsyncProjectWidget,
  Day20FinalChecklistWidget,
} from "./Day20InteractiveContent";
import {
  Day21DsaProblemsWidget,
  Day21CheatSheetWidget,
  Day21AsyncProjectWidget,
  Day21FinalChecklistWidget,
} from "./Day21InteractiveContent";
import {
  Day22DsaProblemsWidget,
  Day22CheatSheetWidget,
  Day22AsyncProjectWidget,
  Day22FinalChecklistWidget,
} from "./Day22InteractiveContent";
import {
  Day23DsaProblemsWidget,
  Day23CheatSheetWidget,
  Day23AsyncProjectWidget,
  Day23FinalChecklistWidget,
} from "./Day23InteractiveContent";
import {
  Day24DsaProblemsWidget,
  Day24CheatSheetWidget,
  Day24AsyncProjectWidget,
  Day24FinalChecklistWidget,
} from "./Day24InteractiveContent";
import {
  Day25DsaProblemsWidget,
  Day25CheatSheetWidget,
  Day25AsyncProjectWidget,
  Day25FinalChecklistWidget,
} from "./Day25InteractiveContent";
import {
  Day26DsaProblemsWidget,
  Day26CheatSheetWidget,
  Day26AsyncProjectWidget,
  Day26FinalChecklistWidget,
} from "./Day26InteractiveContent";
import {
  Day27MockInterviewWidget,
  Day27CheatSheetWidget,
  Day27AsyncProjectWidget,
  Day27FinalChecklistWidget,
} from "./Day27InteractiveContent";
import {
  Day28DsaProblemsWidget,
  Day28CheatSheetWidget,
  Day28AsyncProjectWidget,
  Day28FinalChecklistWidget,
} from "./Day28InteractiveContent";
import {
  Day29DsaTimedChallengeWidget,
  Day29CheatSheetWidget,
  Day29AsyncProjectWidget,
  Day29FinalChecklistWidget,
} from "./Day29InteractiveContent";
import {
  Day30FinalDsaAssessmentWidget,
  Day30CheatSheetWidget,
  Day30AsyncProjectWidget,
  Day30FinalChecklistWidget,
} from "./Day30InteractiveContent";

const subjectColors = {
  DSA: {
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badge: "bg-blue-500 text-white",
    dot: "bg-blue-500",
    border: "border-l-blue-500",
  },
  WEBDEV: {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badge: "bg-emerald-500 text-white",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
  },
  INTERVIEW: {
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    badge: "bg-purple-500 text-white",
    dot: "bg-purple-500",
    border: "border-l-purple-500",
  },
  PROJECT: {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badge: "bg-amber-500 text-white",
    dot: "bg-amber-500",
    border: "border-l-amber-500",
  },
  REVIEW: {
    bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    badge: "bg-indigo-500 text-white",
    dot: "bg-indigo-500",
    border: "border-l-indigo-500",
  },
};

export function TodayTab() {
  const {
    studyBlocks,
    activeSession,
    currentDay,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    extendSession,
    updateBlockStatus,
    moveBlockToTomorrow,
    setReviewModalOpen,
    resetDayProgress,
  } = useStudyStore();

  const activeBlock = studyBlocks.find((b) => b.id === activeSession?.blockId);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Live timer tick
  useEffect(() => {
    if (!activeSession || !activeBlock || activeSession.isPaused) return;

    const totalSeconds = activeBlock.durationMinutes * 60;
    const initialElapsed = activeSession.elapsedSeconds || 0;
    setSecondsLeft(Math.max(0, totalSeconds - initialElapsed));

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, activeBlock]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = studyBlocks.filter((b) => b.status === "Completed").length;
  const isAllCompleted = completedCount === studyBlocks.length;

  return (
    <div className="space-y-6">
      
      {/* Active Session Live Floating Banner */}
      {activeSession && activeBlock && (
        <div className="bg-gradient-to-r from-accent/15 via-blue-500/10 to-purple-500/10 border-2 border-accent/40 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden animate-[fadeIn_300ms_ease]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-white shadow-md font-bold">
                <Clock className="animate-spin" size={24} style={{ animationDuration: "10s" }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${subjectColors[activeBlock.subject].bg}`}>
                    {activeBlock.subject}
                  </span>
                  <span className="text-xs text-text-secondary font-medium">• {activeBlock.topic}</span>
                </div>
                <h3 className="text-lg font-extrabold text-text-primary mt-0.5">
                  CURRENT SESSION: {activeBlock.title}
                </h3>
              </div>
            </div>

            {/* Timer Display & Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="bg-card border border-border-theme px-4 py-2 rounded-xl text-center shadow-xs">
                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Remaining</div>
                <div className="text-2xl font-black font-mono tracking-tight text-accent">
                  {formatTimer(secondsLeft)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeSession.isPaused ? (
                  <Button
                    onClick={resumeSession}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl flex items-center gap-1.5"
                  >
                    <Play size={16} /> Resume
                  </Button>
                ) : (
                  <Button
                    onClick={pauseSession}
                    variant="secondary"
                    className="border-border-theme font-bold h-10 px-4 rounded-xl flex items-center gap-1.5"
                  >
                    <Pause size={16} /> Pause
                  </Button>
                )}

                <Button
                  onClick={() => completeSession(activeBlock.id)}
                  className="bg-accent hover:bg-accent/90 text-white font-bold h-10 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} /> Complete
                </Button>

                <Button
                  onClick={() => extendSession(15)}
                  variant="ghost"
                  className="text-xs font-bold text-text-secondary hover:text-text-primary h-10 px-2.5 rounded-xl border border-border-theme/40"
                  title="Extend session by 15 mins"
                >
                  +15m
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner & Adaptive Prompt */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border-theme/60 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase tracking-wider">
            <Calendar size={14} className="text-accent" />
            <span>DAY {currentDay} — PLACEMENT PREPARATION TIMELINE</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Follow your structured hourly schedule. Focus on mastery over question quantity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => resetDayProgress(currentDay)}
            variant="secondary"
            className="text-xs font-bold h-10 px-4 rounded-xl border-border-theme text-text-secondary hover:text-text-primary transition-all"
          >
            <RotateCcw size={14} className="mr-1.5" /> Reset Day
          </Button>

          <Button
            onClick={() => setReviewModalOpen(true)}
            className="bg-gradient-to-r from-accent to-purple-600 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs hover:opacity-95 transition-all"
          >
            <Sparkles size={14} className="mr-1.5" /> Finish Day & Review
          </Button>
        </div>
      </div>

      {/* Adaptive Scheduling Banner if Ahead */}
      {completedCount > 3 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-300">
          <Zap size={18} className="text-emerald-500 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">You are ahead of schedule today!</span> Optional bonus: Try 1 extra LeetCode medium problem or review interview recall questions.
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="relative space-y-4">
        {/* Timeline connector vertical line for desktop */}
        <div className="hidden sm:block absolute left-[85px] top-4 bottom-4 w-0.5 bg-border-theme/60 z-0" />

        {studyBlocks.map((block, index) => {
          const isCurrentActive = activeSession?.blockId === block.id;
          const isDone = block.status === "Completed";
          const isSkipped = block.status === "Skipped";

          return (
            <div
              key={block.id}
              className={`relative z-10 flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                isCurrentActive
                  ? "bg-accent/5 border-accent shadow-md ring-2 ring-accent/20"
                  : isDone
                  ? "bg-slate-50/50 dark:bg-slate-900/30 border-border-theme/40 opacity-80"
                  : isSkipped
                  ? "bg-slate-100/40 dark:bg-slate-900/10 border-border-theme/30 opacity-60"
                  : "bg-card border-border-theme hover:border-border-theme/80 shadow-xs"
              }`}
            >
              {/* Time Indicator Column */}
              <div className="sm:w-28 shrink-0 flex flex-row sm:flex-col items-center sm:items-start justify-between w-full">
                <span className="text-xs font-black text-text-primary tracking-tight font-mono">
                  {block.startTime} – {block.endTime}
                </span>
                <span className="text-[10px] font-bold text-text-secondary mt-0.5">
                  ({block.durationMinutes} mins)
                </span>
              </div>

              {/* Main Content Details */}
              <div className="flex-1 space-y-3 min-w-0 w-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${subjectColors[block.subject].bg}`}>
                      {block.subject}
                    </span>
                    <span className="text-xs font-bold text-text-secondary">
                      {block.topic}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : isCurrentActive
                        ? "bg-accent/15 text-accent animate-pulse"
                        : isSkipped
                        ? "bg-slate-200 dark:bg-slate-800 text-text-secondary"
                        : "bg-slate-100 dark:bg-slate-800 text-text-secondary"
                    }`}
                  >
                    {block.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-text-primary tracking-tight">
                    {block.title}
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {block.description}
                  </p>
                </div>

                {/* Learn Points Bullet List */}
                {block.learnPoints.length > 0 && (
                  <div className="space-y-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-border-theme/40 text-xs">
                    <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider block mb-1">
                      Learning Objectives:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-text-secondary">
                      {block.learnPoints.map((point, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${subjectColors[block.subject].dot}`} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Tasks */}
                {block.codeTasks.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <FileCode size={13} className="text-accent" /> Hands-on Coding Tasks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {block.codeTasks.map((task, i) => (
                        <span key={i} className="bg-card border border-border-theme px-2.5 py-1 rounded-lg text-text-secondary font-mono text-[11px]">
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Targeted Problems */}
                {block.problems.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <BookOpen size={13} className="text-accent" /> Targeted Problems:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {block.problems.map((prob) => (
                        <a
                          key={prob.id}
                          href={prob.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded-xl border border-border-theme bg-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-text-primary font-medium text-xs group"
                        >
                          <span className="truncate">{prob.name}</span>
                          <ExternalLink size={12} className="text-text-secondary group-hover:text-accent shrink-0 ml-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview Questions */}
                {block.interviewQuestions.length > 0 && (
                  <div className="space-y-1 text-xs bg-purple-500/5 border border-purple-500/20 p-3 rounded-xl">
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle size={13} /> Interview Self-Recall Questions:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                      {block.interviewQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Special Day 12, Day 13 & Day 14 Interactive Content Widgets */}
                {block.id === "d12_block_5" && <Day12DsaProblemsWidget />}
                {block.id === "d12_block_6" && <Day12CheatSheetWidget />}
                {block.id === "d12_block_12" && <Day12AsyncProjectWidget />}
                {block.id === "d12_block_13" && <Day12FinalChecklistWidget />}

                {block.id === "d13_block_5" && <Day13DsaProblemsWidget />}
                {block.id === "d13_block_6" && <Day13CheatSheetWidget />}
                {block.id === "d13_block_12" && <Day13AsyncProjectWidget />}
                {block.id === "d13_block_13" && <Day13FinalChecklistWidget />}

                {block.id === "d14_block_5" && <Day14DsaProblemsWidget />}
                {block.id === "d14_block_6" && <Day14CheatSheetWidget />}
                {block.id === "d14_block_12" && <Day14AsyncProjectWidget />}
                {block.id === "d14_block_13" && <Day14FinalChecklistWidget />}

                {block.id === "d15_block_5" && <Day15DsaProblemsWidget />}
                {block.id === "d15_block_6" && <Day15CheatSheetWidget />}
                {block.id === "d15_block_12" && <Day15AsyncProjectWidget />}
                {block.id === "d15_block_13" && <Day15FinalChecklistWidget />}

                {block.id === "d16_block_5" && <Day16DsaProblemsWidget />}
                {block.id === "d16_block_6" && <Day16CheatSheetWidget />}
                {block.id === "d16_block_13" && <Day16AsyncProjectWidget />}
                {block.id === "d16_block_14" && <Day16FinalChecklistWidget />}

                {block.id === "d17_block_5" && <Day17DsaProblemsWidget />}
                {block.id === "d17_block_6" && <Day17CheatSheetWidget />}
                {block.id === "d17_block_13" && <Day17AsyncProjectWidget />}
                {block.id === "d17_block_14" && <Day17FinalChecklistWidget />}

                {block.id === "d18_block_5" && <Day18DsaProblemsWidget />}
                {block.id === "d18_block_6" && <Day18CheatSheetWidget />}
                {block.id === "d18_block_13" && <Day18AsyncProjectWidget />}
                {block.id === "d18_block_14" && <Day18FinalChecklistWidget />}

                {block.id === "d19_block_5" && <Day19DsaProblemsWidget />}
                {block.id === "d19_block_6" && <Day19CheatSheetWidget />}
                {block.id === "d19_block_13" && <Day19AsyncProjectWidget />}
                {block.id === "d19_block_14" && <Day19FinalChecklistWidget />}

                {block.id === "d20_block_5" && <Day20DsaProblemsWidget />}
                {block.id === "d20_block_6" && <Day20CheatSheetWidget />}
                {block.id === "d20_block_13" && <Day20AsyncProjectWidget />}
                {block.id === "d20_block_14" && <Day20FinalChecklistWidget />}

                {block.id === "d21_block_5" && <Day21DsaProblemsWidget />}
                {block.id === "d21_block_6" && <Day21CheatSheetWidget />}
                {block.id === "d21_block_13" && <Day21AsyncProjectWidget />}
                {block.id === "d21_block_14" && <Day21FinalChecklistWidget />}

                {block.id === "d22_block_5" && <Day22DsaProblemsWidget />}
                {block.id === "d22_block_6" && <Day22CheatSheetWidget />}
                {block.id === "d22_block_13" && <Day22AsyncProjectWidget />}
                {block.id === "d22_block_14" && <Day22FinalChecklistWidget />}

                {block.id === "d23_block_5" && <Day23DsaProblemsWidget />}
                {block.id === "d23_block_6" && <Day23CheatSheetWidget />}
                {block.id === "d23_block_13" && <Day23AsyncProjectWidget />}
                {block.id === "d23_block_14" && <Day23FinalChecklistWidget />}

                {block.id === "d24_block_5" && <Day24DsaProblemsWidget />}
                {block.id === "d24_block_6" && <Day24CheatSheetWidget />}
                {block.id === "d24_block_13" && <Day24AsyncProjectWidget />}
                {block.id === "d24_block_14" && <Day24FinalChecklistWidget />}

                {block.id === "d25_block_5" && <Day25DsaProblemsWidget />}
                {block.id === "d25_block_6" && <Day25CheatSheetWidget />}
                {block.id === "d25_block_13" && <Day25AsyncProjectWidget />}
                {block.id === "d25_block_14" && <Day25FinalChecklistWidget />}

                {block.id === "d26_block_5" && <Day26DsaProblemsWidget />}
                {block.id === "d26_block_6" && <Day26CheatSheetWidget />}
                {block.id === "d26_block_13" && <Day26AsyncProjectWidget />}
                {block.id === "d26_block_14" && <Day26FinalChecklistWidget />}

                {block.id === "d27_block_5" && <Day27MockInterviewWidget />}
                {block.id === "d27_block_6" && <Day27CheatSheetWidget />}
                {block.id === "d27_block_13" && <Day27AsyncProjectWidget />}
                {block.id === "d27_block_14" && <Day27FinalChecklistWidget />}

                {block.id === "d28_block_5" && <Day28DsaProblemsWidget />}
                {block.id === "d28_block_6" && <Day28CheatSheetWidget />}
                {block.id === "d28_block_13" && <Day28AsyncProjectWidget />}
                {block.id === "d28_block_14" && <Day28FinalChecklistWidget />}

                {block.id === "d29_block_5" && <Day29DsaTimedChallengeWidget />}
                {block.id === "d29_block_6" && <Day29CheatSheetWidget />}
                {block.id === "d29_block_13" && <Day29AsyncProjectWidget />}
                {block.id === "d29_block_14" && <Day29FinalChecklistWidget />}

                {block.id === "d30_block_5" && <Day30FinalDsaAssessmentWidget />}
                {block.id === "d30_block_6" && <Day30CheatSheetWidget />}
                {block.id === "d30_block_13" && <Day30AsyncProjectWidget />}
                {block.id === "d30_block_14" && <Day30FinalChecklistWidget />}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-theme/40">
                  {!isDone && (
                    <>
                      {!isCurrentActive ? (
                        <Button
                          onClick={() => startSession(block.id)}
                          size="sm"
                          className="bg-accent hover:bg-accent/90 text-white font-bold h-8 text-xs rounded-xl flex items-center gap-1.5"
                        >
                          <Play size={13} /> Start Session
                        </Button>
                      ) : (
                        <Button
                          onClick={() => completeSession(block.id)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs rounded-xl flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} /> Complete Now
                        </Button>
                      )}

                      <Button
                        onClick={() => updateBlockStatus(block.id, "Completed")}
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs font-medium rounded-xl border-border-theme text-text-secondary hover:text-text-primary"
                      >
                        Quick Complete
                      </Button>

                      <Button
                        onClick={() => updateBlockStatus(block.id, "Needs Revision")}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-medium rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                      >
                        Needs Revision
                      </Button>

                      <Button
                        onClick={() => moveBlockToTomorrow(block.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-medium rounded-xl text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 ml-auto"
                      >
                        Move to Tomorrow
                      </Button>
                    </>
                  )}

                  {isDone && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 size={16} />
                      <span>Completed! +25 XP</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
