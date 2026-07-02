"use client";

import React from "react";
import { Sparkles, Compass, CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { levelSystem } from "@/game/systems/levelSystem";
import { gameConfig } from "@/config/game";

interface HeroCardProps {
  quote?: string;
}

export function HeroCard({
  quote = "Small progress every day creates extraordinary results.",
}: HeroCardProps) {
  const { user } = useUserStore();
  const xp = user?.xp ?? 0;
  const { missions } = useMissionStore();
  const { historyLogs } = useStatisticsStore();

  // Compute live level statistics
  const levelDetails = levelSystem.calculateLevelDetails(xp);
  const remainingXP = levelDetails.xpRequiredForNextLevel - levelDetails.xpInCurrentLevel;

  // Calculate today's gains based on completed tasks
  const todayStr = new Date().toDateString();
  const completedToday = missions.filter(
    (m) => m.status === "Completed" && m.completedAt && new Date(m.completedAt).toDateString() === todayStr
  );

  const xpToday = completedToday.reduce((acc, m) => acc + m.xpReward, 0);
  const mpToday = completedToday.reduce((acc, m) => acc + m.missionPoints, 0);

  // Daily target configurations
  const xpTarget = gameConfig.dailyTargets.xp;
  const mpTarget = gameConfig.dailyTargets.missionPoints;

  const xpBonus = Math.max(0, xpToday - xpTarget);
  const mpBonus = Math.max(0, mpToday - mpTarget);

  // Today's goals progress array
  const todayMissions = [
    {
      id: "xp_goal",
      label: "Today's XP",
      detail: xpToday >= xpTarget
        ? `${xpToday} XP earned (Goal: ${xpTarget} XP) • Bonus +${xpBonus}`
        : `${xpToday} / ${xpTarget} XP earned (${xpTarget - xpToday} XP remaining)`,
      completed: xpToday >= xpTarget,
    },
    {
      id: "mp_goal",
      label: "Mission Points Today",
      detail: mpToday >= mpTarget
        ? `${mpToday} MP earned (Goal: ${mpTarget} MP) • Bonus +${mpBonus}`
        : `${mpToday} / ${mpTarget} MP earned (${mpTarget - mpToday} MP remaining)`,
      completed: mpToday >= mpTarget,
    },
    {
      id: "chest_goal",
      label: "Daily Loot Chest",
      detail: !!user?.lastChestClaimedAt && user.lastChestClaimedAt === new Date().toDateString()
        ? "Daily Chest opened! ✓"
        : "Chest locked (Unlock by meeting daily XP & MP targets)",
      completed: !!user?.lastChestClaimedAt && user.lastChestClaimedAt === new Date().toDateString(),
    },
  ];

  // Contextual Insights calculation
  const getContextualInsight = () => {
    // 1. Check if there are completed missions today and find top subject focus
    if (completedToday.length > 0) {
      const subjectHours: { [key: string]: number } = {};
      completedToday.forEach((m) => {
        const hours = m.estimatedHours || (m.difficulty === "Easy" ? 0.5 : m.difficulty === "Medium" ? 1.0 : m.difficulty === "Hard" ? 2.0 : 4.0);
        subjectHours[m.subject] = (subjectHours[m.subject] || 0) + hours;
      });
      let topSubject = "";
      let maxHours = 0;
      Object.entries(subjectHours).forEach(([subj, hrs]) => {
        if (hrs > maxHours) {
          maxHours = hrs;
          topSubject = subj;
        }
      });
      if (topSubject) {
        return `Most of today's focus time was spent on ${topSubject}.`;
      }
    }

    // 2. Check focus duration comparison with yesterday
    const todayDateStr = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayDateStr = yesterdayDate.toISOString().split("T")[0];

    const todayLog = historyLogs.find((l) => l.date === todayDateStr);
    const yesterdayLog = historyLogs.find((l) => l.date === yesterdayDateStr);

    if (todayLog && yesterdayLog && todayLog.minutesFocused > yesterdayLog.minutesFocused) {
      const diff = todayLog.minutesFocused - yesterdayLog.minutesFocused;
      return `You studied ${diff} minutes longer than yesterday. Awesome progress!`;
    }

    // 3. Boss progress proximity
    if (user?.bossHp && user.bossHp > 0) {
      const hardDamage = 1200; // Hard difficulty damage
      const remainingMissions = Math.ceil(user.bossHp / hardDamage);
      if (remainingMissions <= 3) {
        return `Only ${remainingMissions} Hard ${remainingMissions === 1 ? "mission" : "missions"} remain to defeat the weekly boss!`;
      }
    }

    return quote;
  };

  const insight = getContextualInsight();

  return (
    <Card className="overflow-hidden relative border-border-theme bg-gradient-to-br from-card to-slate-50/50 dark:to-slate-900/10 select-none">
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10 p-6">
        {/* Left Side: Level Progress & Quote */}
        <div className="md:col-span-3 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Badge variant="primary" className="font-bold py-1 px-3">
                Level {levelDetails.level}
              </Badge>
              <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5" title="XP is earned by completing study missions.">
                {levelDetails.rankName}
                <HelpCircle size={13} className="text-text-secondary/50 cursor-help" />
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-text-primary">
                    {levelDetails.percentage}%
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {levelDetails.xpInCurrentLevel.toLocaleString()} / {levelDetails.xpRequiredForNextLevel.toLocaleString()} XP
                  </p>
                </div>
                <div className="text-right">
                  {remainingXP > 0 ? (
                    <p className="text-xs font-semibold text-accent dark:text-blue-400">
                      {remainingXP.toLocaleString()} XP remaining to Level {levelDetails.level + 1}
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-success">
                      Max level reached!
                    </p>
                  )}
                </div>
              </div>
              <Progress value={levelDetails.xpInCurrentLevel} max={levelDetails.xpRequiredForNextLevel} className="h-2.5" />
            </div>
          </div>

          <div className="border-l-2 border-accent/20 pl-4 py-1 mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1 mb-1 select-none">
              <Sparkles size={12} className="animate-pulse" />
              <span>Character Insight</span>
            </p>
            <p className="text-sm italic font-medium text-text-secondary leading-relaxed">
              "{insight}"
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-[1px] bg-border-theme h-full self-stretch md:col-span-1 justify-self-center opacity-70" />

        {/* Right Side: Today's Mission Objectives */}
        <div className="md:col-span-1 flex flex-col justify-center space-y-4">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Compass size={16} className="text-accent" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Daily Targets
              </h4>
            </div>
            
            <ul className="space-y-3.5">
              {todayMissions.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  {item.completed ? (
                    <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-text-secondary/55 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span
                      className={
                        item.completed
                          ? "text-xs text-text-secondary/70 line-through font-medium"
                          : "text-xs font-semibold text-text-primary"
                      }
                    >
                      {item.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
