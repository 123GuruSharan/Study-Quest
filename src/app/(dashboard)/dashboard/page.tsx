"use client";

import React, { useEffect, useState } from "react";
import { HeroCard } from "@/components/dashboard/hero-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BossBanner } from "@/components/dashboard/boss-banner";
import { SurpriseChest } from "@/components/dashboard/surprise-chest";
import { XPChart } from "@/components/dashboard/xp-chart";
import { MissionCard } from "@/components/dashboard/mission-card";
import { AchievementCard } from "@/components/dashboard/achievement-card";
import { CreateMissionModal } from "@/components/dashboard/create-mission-modal";
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer";
import { CustomShop } from "@/components/dashboard/custom-shop";
import { LifeCalendar } from "@/components/dashboard/life-calendar";
import { JourneyTimeline } from "@/components/dashboard/journey-timeline";
import { WeeklySummaryCard } from "@/components/dashboard/weekly-summary-card";
import { SubjectIntelligenceCard } from "@/components/dashboard/subject-intelligence-card";
import { DailySummaryModal } from "@/components/dashboard/daily-summary-modal";
import { WeeklyReportModal } from "@/components/dashboard/weekly-report-modal";
import { RuleBookView } from "@/encyclopedia/components/rule-book-view";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { useUiStore } from "@/stores/uiStore";
import { calculateBossStats, parseBossCombatLog, formatLogTimestamp, BossCombatLogEntry, calculateBossDamage, getBossForDefeatedCount } from "@/config/bosses";
import { gameConfig } from "@/config/game";
import { streakEngine } from "@/game/systems/streakEngine";

import { achievementsConfig } from "@/config/achievements";
import { levelsConfig } from "@/config/levels";
import { penaltySystem } from "@/game/systems/penaltySystem";
import { notificationSystem } from "@/game/systems/notificationSystem";

import {
  Flame,
  Zap,
  Clock,
  Smartphone,
  Star,
  Plus,
  ArrowUpRight,
  X,
  PlusCircle,
  MinusCircle,
  Trophy,
  BarChart2,
  Target,
  Award,
  Swords
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { loadUser, user, achievements, setPhoneUsage, isLoading: isUserLoading, journeyLog } = useUserStore();
  const { loadMissions, missions, dailyQuests, triggerMidnightReset, isLoading: isMissionsLoading } = useMissionStore();

  const defeatedCount = user?.bossesDefeatedCount || 0;
  const combatStats = calculateBossStats(journeyLog, defeatedCount);
  const combatLogs = journeyLog
    .map(parseBossCombatLog)
    .filter((l): l is BossCombatLogEntry => l !== null);
  const { loadHistoryLogs } = useStatisticsStore();

  // Resolve current streak details dynamically using the gameplay engine
  const userStreak = user?.streak ?? 0;
  const streakTier = streakEngine.getStreakTier(userStreak);
  const nextTierInfo = streakEngine.getNextStreakTier(userStreak);

  const {
    isCreateMissionModalOpen,
    setCreateMissionModalOpen,
    activeTab,
    setActiveTab,
    notifications,
    clearNotification,
    clearAllNotifications
  } = useUiStore();

  // Modals open toggles
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);
  const [missionFilter, setMissionFilter] = useState("All");

  // Sync tab query param if provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get("tab");
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, [setActiveTab]);

  useEffect(() => {
    loadUser();
    loadMissions();
    loadHistoryLogs();

    const cleanupNotifications = notificationSystem.initializeListeners(
      useUiStore.getState().addNotification
    );

    return () => {
      cleanupNotifications();
    };
  }, [loadUser, loadMissions, loadHistoryLogs]);

  if (isMissionsLoading || isUserLoading || !user || typeof user.streak === "undefined") {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-text-secondary">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-semibold">Loading gameplay loop...</span>
      </div>
    );
  }

  // Calculate today's completions for summary stats
  const todayStr = new Date().toDateString();
  const completedToday = missions.filter(
    (m) => m.status === "Completed" && m.completedAt && new Date(m.completedAt).toDateString() === todayStr
  );

  const xpToday = completedToday.reduce((acc, m) => acc + m.xpReward, 0);
  const mpToday = completedToday.reduce((acc, m) => acc + m.missionPoints, 0);
  const hoursToday = completedToday.reduce(
    (acc, m) => acc + (m.estimatedHours || (m.difficulty === "Easy" ? 0.5 : m.difficulty === "Medium" ? 1.0 : 2.0)),
    0
  );

  // Evaluate daily boss damage from completed missions

  const bossDamageToday = completedToday.reduce(
    (acc, m) => acc + calculateBossDamage(m.difficulty),
    0
  );

  // Map achievements definitions
  const displayAchievements = achievementsConfig.map((def) => {
    const log = achievements.find((l) => l.achievementId === def.id);
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      tier: def.tier,
      progress: log ? log.progressPercentage : 0,
      completed: log ? log.progressPercentage === 100 : false,
    };
  });

  // Handle phone overuse inputs
  const handlePhoneAdjustment = async (delta: number) => {
    const nextMins = Math.max(0, user.phoneUsageMinutes + delta);
    await setPhoneUsage(nextMins);

    const penaltyXP = penaltySystem.calculatePhoneUsagePenalty(nextMins);
    const prevXP = penaltySystem.calculatePhoneUsagePenalty(user.phoneUsageMinutes);

    if (penaltyXP > prevXP) {
      const deduction = penaltyXP - prevXP;
      await useUserStore.getState().removeXp(deduction);
      penaltySystem.applyPenalty("phone", { minutesUsed: nextMins });
    }
  };

  const formatMins = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem} mins`;
  };

  const activeMissions = missions.filter((m) => m.status !== "Completed" && m.status !== "Cancelled");

  // Package recap values
  const summaryPayload = {
    xpEarned: xpToday,
    coinsEarned: completedToday.reduce((acc, m) => acc + m.coinReward, 0),
    studyHours: hoursToday,
    phoneMinutes: user.phoneUsageMinutes,
    missionsCount: completedToday.length,
    bossDamage: bossDamageToday,
    streakDays: user.streak,
  };

  const weeklyRecapPayload = {
    totalHours: missions
      .filter((m) => m.status === "Completed")
      .reduce((acc, m) => acc + (m.estimatedHours || 1), 0),
    completionRate: missions.length > 0
      ? Math.round((missions.filter((m) => m.status === "Completed").length / missions.length) * 100)
      : 100,
    bestSubject: "Algorithms",
    weakestSubject: "Languages",
    consistencyScore: 94,
  };

  return (
    <div className="space-y-6 select-none animate-[fadeIn_200ms_ease] pb-10">
      {/* Toast Alert Stack */}
      <div className="fixed top-24 right-6 z-50 pointer-events-none space-y-2.5 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start gap-3 p-4 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
              <div className="flex-1 min-w-0">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-accent mb-0.5">
                  {n.title}
                </h5>
                <p className="text-[10px] text-slate-300 leading-normal">
                  {n.message}
                </p>
              </div>
              <button
                onClick={() => clearNotification(n.id)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer shrink-0"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activeTab === "dashboard" ? (
        <>
          {/* Row 1: Hero Block */}
          <div className="w-full animate-[fadeIn_200ms_ease]">
            <HeroCard />
          </div>

          {/* Row 2: Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Streak Card */}
            <Card 
              className="flex flex-col justify-between h-full hover:border-accent/30 group cursor-help select-none bg-gradient-to-br from-card to-amber-50/20 dark:to-amber-950/5"
              title="Study streaks increase when you complete at least one mission or focus session on consecutive days. Missing an entire day resets the streak."
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/85 flex items-center gap-1">
                  <Flame size={12} className="text-amber-500 fill-amber-500 animate-pulse" />
                  Study Streak
                </span>
                <div className="p-2 rounded-xl shrink-0 bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Flame size={16} className="fill-current animate-[pulse_2s_infinite]" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-extrabold tracking-tight text-text-primary font-sans">
                  {userStreak} {userStreak === 1 ? "Day" : "Days"}
                </h4>
                {userStreak === 0 ? (
                  <p className="text-[10px] text-text-secondary leading-relaxed pt-1.5 border-t border-border-theme/40 font-medium">
                    Complete your first mission today to begin your study streak.
                  </p>
                ) : (
                  <div className="space-y-0.5 pt-1.5 border-t border-border-theme/40 text-[9px] text-text-secondary font-medium">
                    <div className="flex justify-between">
                      <span>Tier:</span>
                      <span className="font-bold text-text-primary">{streakTier.tierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplier:</span>
                      <span className="font-bold text-accent">{streakTier.multiplier.toFixed(2)}x</span>
                    </div>
                    {nextTierInfo.nextTier ? (
                      <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold pt-0.5">
                        <span>Next: {nextTierInfo.nextTier.tierName}</span>
                        <span>{nextTierInfo.daysRemaining} days left</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-success font-semibold pt-0.5">
                        <span>Max Tier Reached!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Combo Multiplier */}
            <StatsCard
              title="Combo Boost"
              value={`${(user.comboMultiplier ?? 1.0).toFixed(1)}x Boost`}
              description="Rises on consecutive study completions."
              icon={Zap}
              iconColorClass="text-accent bg-accent/10 border-accent/20"
              tooltip="Combo Boost - Increases consecutive mission completion rewards. Resets if a mission is cancelled."
            />

            {/* Focus hours */}
            <StatsCard
              title="Focus Hours"
              value={`${(user.studyHours ?? 0.0).toFixed(1)} Hours`}
              description={user.studyHours > 0 ? "Total accumulated study hours." : "No focus sessions completed yet."}
              icon={Clock}
              iconColorClass="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
              tooltip="Focus Hours - Total accumulated study hours across completed missions and custom focus sessions."
            />

            {/* Phone screen limit (Interactive Penalty Test) */}
            <Card 
              className="flex flex-col justify-between h-full hover:border-accent/30 group cursor-help select-none"
              title="Screen Limit - Allowed phone usage limit per day. Exceeding this limit deducts XP."
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/80">
                  Screen Limit
                </span>
                <div className="p-2 rounded-xl shrink-0 bg-red-500/10 border border-red-500/20 text-red-500">
                  <Smartphone size={16} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-extrabold tracking-tight text-text-primary font-sans flex items-center justify-between">
                  <span>{formatMins(user.phoneUsageMinutes)}</span>
                </h4>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-border-theme/40">
                  <button
                    onClick={() => handlePhoneAdjustment(-15)}
                    className="text-[10px] font-bold text-text-secondary hover:text-text-primary flex items-center gap-1 cursor-pointer"
                    title="Reduce phone usage"
                  >
                    <MinusCircle size={13} />
                    <span>-15m</span>
                  </button>
                  <span className="text-[10px] text-text-secondary/40">|</span>
                  <button
                    onClick={() => handlePhoneAdjustment(15)}
                    className="text-[10px] font-bold text-text-secondary hover:text-text-primary flex items-center gap-1 cursor-pointer"
                    title="Deduct XP on over limit"
                  >
                    <PlusCircle size={13} />
                    <span>+15m</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Mission Points */}
            <StatsCard
              title="Mission Points"
              value={`${mpToday} / 6 MP`}
              description="Today's goal progress index."
              icon={Star}
              iconColorClass="text-purple-500 bg-purple-500/10 border-purple-500/20"
              tooltip="Mission Points - Points earned from completed missions today. Reach 6 MP to unlock the Daily Loot Chest."
            />
          </div>

          {/* Row 3: Split Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side: Graphs, Timer and Active Missions (2/3 columns) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recharts Analytics Panel */}
              <XPChart />

              {/* Active Daily Quests Checklist */}
              <Card className="p-5 border-border-theme select-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      Today's Quest Objectives
                    </h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      Complete all objectives to earn the Daily Rare Chest
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dailyQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors duration-200 ${
                        quest.completed
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-card border-border-theme text-text-secondary"
                      }`}
                    >
                      <span className="font-semibold">{quest.text}</span>
                      <span className="font-bold font-mono">
                        {quest.completed ? "✓ Done" : "In Progress"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Missions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                      Today's Active Missions
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Commit targets, run Pomodoro timers, and claim loot rewards
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs gap-1 cursor-pointer"
                    onClick={() => setCreateMissionModalOpen(true)}
                  >
                    <Plus size={14} />
                    <span>Create Mission</span>
                  </Button>
                </div>

                {activeMissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-[fadeIn_300ms_ease]">
                    {activeMissions.slice(0, 3).map((mission) => (
                      <div key={mission.id}>
                        <MissionCard mission={mission} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-border-theme select-none min-h-[120px] bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2">
                      <Plus size={16} />
                    </div>
                    <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                      No active missions today
                    </h5>
                    <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed">
                      Formulate your first study commitment! Click the "Create Mission" button above to embark on a new quest.
                    </p>
                  </Card>
                )}
              </div>

              {/* Boss Fight Banner (Dragon combat damageHP) */}
              <BossBanner />

              {/* Life Calendar Heatmap */}
              <LifeCalendar />

            </div>

            {/* Right Side: Pomodoro, Surprise Chest & Summary controls (1/3 column) */}
            <div className="space-y-6 h-full flex flex-col">
              
              {/* Pomodoro Focus Timer */}
              <div className="grow-0">
                <PomodoroTimer />
              </div>

              {/* Surprise Chest */}
              <div className="grow-0">
                <SurpriseChest />
              </div>

              {/* Manual summaries trigger buttons */}
              <Card className="p-4 border-border-theme space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block">
                  Recaps Verification Panel
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsDailySummaryOpen(true)}
                    className="flex-1 text-[10px] font-bold gap-1 cursor-pointer"
                  >
                    <BarChart2 size={12} />
                    <span>Daily Summary</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsWeeklyReportOpen(true)}
                    className="flex-1 text-[10px] font-bold gap-1 cursor-pointer"
                  >
                    <Trophy size={12} />
                    <span>Weekly Sunday</span>
                  </Button>
                </div>
              </Card>

              {/* Achievements Container */}
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                      Unlocked Achievements
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Milestone badges and honors
                    </p>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[10px] font-bold text-accent hover:text-accent/80 flex items-center gap-1 cursor-pointer"
                    >
                      Clear Alerts
                    </button>
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  {displayAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id}>
                      <AchievementCard {...achievement} />
                    </div>
                  ))}
                  
                  <Card
                    onClick={() => setActiveTab("achievements")}
                    className="p-3 text-center border-dashed border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-accent/40 select-none cursor-pointer group"
                  >
                    <span className="text-[11px] font-bold text-text-secondary group-hover:text-accent flex items-center justify-center gap-1">
                      View Journey Timeline
                      <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Card>
                </div>
              </div>

            </div>

          </div>
        </>
      ) : activeTab === "shop" ? (
        <CustomShop />
      ) : activeTab === "achievements" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_200ms_ease]">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
              Achievements Honors
            </h3>
            <div className="space-y-3">
              {displayAchievements.map((achievement) => (
                <div key={achievement.id}>
                  <AchievementCard {...achievement} />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <JourneyTimeline />
          </div>
        </div>
      ) : activeTab === "calendar" ? (
        <div className="space-y-6 animate-[fadeIn_200ms_ease]">
          <LifeCalendar />
          <JourneyTimeline />
        </div>
      ) : activeTab === "missions" ? (
        <div className="space-y-6 animate-[fadeIn_200ms_ease]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
                Player Missions
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Manage, lock, and complete your custom study tasks.
              </p>
            </div>
            <button
              onClick={() => setCreateMissionModalOpen(true)}
              className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl shadow-md hover:bg-accent-hover transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Create Mission</span>
            </button>
          </div>

          <div className="flex gap-2 border-b border-border-theme pb-2 overflow-x-auto">
            {["All", "Draft", "Locked", "Completed"].map((statusFilter) => {
              const count = statusFilter === "All"
                ? missions.length
                : missions.filter((m) => m.status === statusFilter).length;
              const isActive = missionFilter === statusFilter;
              return (
                <button
                  key={statusFilter}
                  onClick={() => setMissionFilter(statusFilter)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <span>{statusFilter}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-accent/20 text-accent" : "bg-slate-100 dark:bg-slate-800 text-text-secondary"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {(() => {
            const filtered = missionFilter === "All"
              ? missions
              : missions.filter((m) => m.status === missionFilter);

            if (filtered.length === 0) {
              return (
                <Card className="p-8 flex flex-col justify-center items-center text-center border-border-theme bg-card max-w-md mx-auto mt-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border-theme flex items-center justify-center text-text-secondary mb-3">
                    <Target size={18} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    No {missionFilter === "All" ? "" : missionFilter.toLowerCase()} missions found
                  </h3>
                  <p className="text-[10px] text-text-secondary leading-relaxed mt-1 mb-4">
                    {missionFilter === "All"
                      ? "Create your very first mission to initiate your StudyQuest adventure."
                      : `You don't have any missions currently marked as ${missionFilter.toLowerCase()}.`}
                  </p>
                  <button
                    onClick={() => setCreateMissionModalOpen(true)}
                    className="px-3.5 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    Create Mission
                  </button>
                </Card>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            );
          })()}
        </div>
      ) : activeTab === "levels" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_200ms_ease]">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
                Levels & Rankings
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Observe your academic rank progression as you earn XP.
              </p>
            </div>

            <Card className="p-6 border-border-theme bg-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Current Level
                  </h4>
                  <p className="text-lg font-black text-text-primary">
                    Level {user.level}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary">{user.rankName}</span>
                  <span className="text-text-primary">{user.xp} XP (Total)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((user.xp / 140000) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-text-secondary italic pt-1">
                  Keep completing missions to level up and unlock Sage titles!
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              StudyQuest Tier Progression
            </h3>
            <Card className="border-border-theme bg-card divide-y divide-border-theme overflow-hidden rounded-2xl max-h-[600px] overflow-y-auto">
              {levelsConfig.map((lvl) => {
                const isCurrent = lvl.level === user.level;
                const isPassed = user.level > lvl.level;
                return (
                  <div
                    key={lvl.level}
                    className={`flex items-center justify-between p-4 transition-colors ${
                      isCurrent
                        ? "bg-accent/5 dark:bg-accent/10"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? "bg-accent text-white"
                          : isPassed
                            ? "bg-success/15 text-success border border-success/20"
                            : "bg-slate-100 dark:bg-slate-800 text-text-secondary border border-border-theme"
                      }`}>
                        {lvl.level}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isCurrent ? "text-accent" : "text-text-primary"}`}>
                          {lvl.rankName}
                        </p>
                        <p className="text-[10px] text-text-secondary">
                          Requires {lvl.xpRequired.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded-full bg-accent/15 border border-accent/20">
                        Current Rank
                      </span>
                    )}
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      ) : activeTab === "boss" ? (
        <div className="space-y-6 animate-[fadeIn_200ms_ease]">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
              Boss Battles Arena
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Defeat weekly bosses by locking and completing study sessions!
            </p>
          </div>

          <BossBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel: Combat Intelligence (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-border-theme bg-card space-y-6 select-none">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 border-b border-border-theme pb-3">
                    <Flame size={14} className="text-danger fill-current" />
                    Combat Intelligence
                  </h4>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Bosses Slayed</span>
                      <span className="text-lg font-black text-text-primary">{combatStats.bossesDefeated}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Total Damage</span>
                      <span className="text-lg font-black text-danger">{combatStats.totalDamageDealt.toLocaleString()} HP</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary">Damage This Week</span>
                      <span className="font-bold text-text-primary font-mono">{combatStats.damageThisWeek.toLocaleString()} HP</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary">Average Damage / Hit</span>
                      <span className="font-bold text-text-primary font-mono">{combatStats.averageDamagePerMission.toLocaleString()} HP</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary">Strongest Hit</span>
                      <span className="font-bold text-danger font-mono">{combatStats.strongestHit.toLocaleString()} HP</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-text-secondary">Last Damage Dealt</span>
                      <span className="font-bold text-text-primary font-mono">{combatStats.lastHit.toLocaleString()} HP</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-theme space-y-2.5">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Tactical Directives</span>
                  <ul className="space-y-2 text-[10px] text-text-secondary leading-relaxed list-disc pl-4">
                    <li>Completing Easy missions inflicts {calculateBossDamage("Easy")} HP damage.</li>
                    <li>Completing Medium missions inflicts {calculateBossDamage("Medium")} HP damage.</li>
                    <li>Completing Hard missions inflicts {calculateBossDamage("Hard")} HP damage.</li>
                    <li>Completing Epic missions inflicts {calculateBossDamage("Epic")} HP damage.</li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* Right Panel: Combat History (2/3 width) */}
            <div className="lg:col-span-2">
              <Card className="p-6 border-border-theme bg-card flex flex-col h-[400px]">
                <div className="border-b border-border-theme pb-3 mb-4 shrink-0 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                    <Swords size={14} className="text-accent" />
                    ⚔ Combat Log History
                  </h4>
                  <span className="text-[10px] font-bold text-text-secondary bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {combatLogs.length} hits logged
                  </span>
                </div>

                <div className="grow overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                  {combatLogs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
                        No active combat logs recorded yet. Slay study targets and complete missions to damage the boss and log hits here!
                      </p>
                    </div>
                  ) : (
                    combatLogs.map((log) => {
                      if (log.isMilestone) {
                        return (
                          <div key={log.id} className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/15 flex items-start justify-between gap-4 select-none">
                            <div className="space-y-1">
                              <h5 className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                <Trophy size={14} className="text-amber-500 shrink-0 animate-bounce" />
                                {log.title}
                              </h5>
                              <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
                                {log.description}
                              </p>
                            </div>
                            <span className="text-[9px] text-text-secondary font-semibold shrink-0">
                              {formatLogTimestamp(log.timestamp)}
                            </span>
                          </div>
                        );
                      }

                      const damageDealt = log.damageDealt || 0;
                      const damageColor = damageDealt >= 1200 ? "text-rose-600 dark:text-rose-400" : damageDealt >= 600 ? "text-orange-500" : "text-emerald-500";
                      return (
                        <div key={log.id} className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/20 dark:bg-slate-900/10 hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-all flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-text-secondary block">
                              Completed {log.difficulty} Mission
                            </span>
                            <h5 className="text-xs font-bold text-text-primary leading-tight">
                              "{log.missionTitle}"
                            </h5>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1.5 text-[10px] text-text-secondary font-medium">
                              <span className="text-accent">+{log.xpEarned} XP</span>
                              <span>•</span>
                              <span className="text-amber-500">+{log.coinsEarned} Coins</span>
                              <span>•</span>
                              <span className="text-purple-500">{log.missionPoints} MP</span>
                              {log.comboMultiplier !== undefined && log.comboMultiplier > 1.0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-rose-500 font-bold">Combo {log.comboMultiplier}x</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 space-y-1">
                            <span className={`text-sm font-black font-mono tracking-tight block ${damageColor}`}>
                              -{damageDealt} HP
                            </span>
                            <span className="text-[9px] text-text-secondary font-semibold block">
                              {formatLogTimestamp(log.timestamp)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : activeTab === "statistics" ? (
        <div className="space-y-6 animate-[fadeIn_200ms_ease]">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
              Detailed Study Statistics
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Review history logs and study session breakdowns.
            </p>
          </div>

          {/* Row 1: Weekly Summary & Subject Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <WeeklySummaryCard />
            </div>
            <div className="lg:col-span-2">
              <SubjectIntelligenceCard />
            </div>
          </div>

          {/* Row 2: Graph charts */}
          <div className="grid grid-cols-1 gap-6">
            <XPChart />
          </div>
        </div>
      ) : activeTab === "rules" ? (
        <RuleBookView />
      ) : null}

      {/* Create Mission Modal overlay */}
      <CreateMissionModal
        isOpen={isCreateMissionModalOpen}
        onClose={() => setCreateMissionModalOpen(false)}
      />

      {/* Daily recap popup */}
      <DailySummaryModal
        isOpen={isDailySummaryOpen}
        onClose={() => setIsDailySummaryOpen(false)}
        data={summaryPayload}
      />

      {/* Weekly Sunday recap popup */}
      <WeeklyReportModal
        isOpen={isWeeklyReportOpen}
        onClose={() => setIsWeeklyReportOpen(false)}
        data={weeklyRecapPayload}
      />
    </div>
  );
}
