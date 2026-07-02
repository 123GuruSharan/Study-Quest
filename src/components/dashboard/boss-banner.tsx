"use client";

import React from "react";
import { Flame, Clock, Sparkles, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useUiStore } from "@/stores/uiStore";
import { calculateBossDamage, getBossForDefeatedCount, getWeeklyTimeRemaining } from "@/config/bosses";

export function BossBanner() {
  const { user } = useUserStore();
  const { missions } = useMissionStore();
  const { setActiveTab } = useUiStore();

  const defeatedCount = user?.bossesDefeatedCount || 0;
  const activeBoss = getBossForDefeatedCount(defeatedCount);

  // Resolve current HP from user state, capping at maxHp
  const currentHp = user?.bossHp !== undefined ? Math.min(user.bossHp, activeBoss.maxHp) : activeBoss.maxHp;
  const maxHp = activeBoss.maxHp;
  const hpPercentage = Math.max(0, Math.round((currentHp / maxHp) * 100));

  // Calculate today's boss damage dynamically from today's completed missions
  const todayStr = new Date().toDateString();
  const completedToday = missions.filter(
    (m) => m.status === "Completed" && m.completedAt && new Date(m.completedAt).toDateString() === todayStr
  );
  const bossDamageToday = completedToday.reduce(
    (acc, m) => acc + calculateBossDamage(m.difficulty),
    0
  );

  return (
    <div className="relative overflow-hidden rounded-card border border-slate-800 bg-slate-950 text-white p-6 shadow-xl select-none">
      {/* Background gradients and details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(37,99,235,0.15),transparent_55%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Mesh lines for a Vercel feel */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
 
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Boss Info / Left Panel */}
        <div className="flex-1 space-y-3.5 w-full">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-danger/10 text-danger border border-danger/20">
              <Flame size={15} className="fill-current" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-danger">
              Weekly Boss Battle
            </span>
          </div>
 
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {activeBoss.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {activeBoss.challengeText}
            </p>
          </div>
 
          {/* Boss HP Bar */}
          <div className="space-y-1.5 max-w-md">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                Boss Health
                <span className="text-[9px] text-slate-500 font-medium font-sans">
                  (Reduced by completing study missions)
                </span>
              </span>
              <span className="font-mono text-danger font-bold">
                {currentHp.toLocaleString()} / {maxHp.toLocaleString()} HP ({hpPercentage}%)
              </span>
            </div>
            <Progress
              value={currentHp}
              max={maxHp}
              className="h-1.5 bg-slate-900 border border-slate-800"
              barClassName="bg-danger"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold pt-1">
              <span>{Math.max(0, maxHp - currentHp).toLocaleString()} total damage dealt</span>
              <span>{bossDamageToday.toLocaleString()} damage dealt today</span>
            </div>
          </div>
        </div>
 
        {/* Boss Loot / Timer Panel & CTA Button */}
        <div className="flex flex-row sm:flex-col lg:items-end justify-between lg:justify-center w-full lg:w-auto shrink-0 gap-4 border-t border-slate-850 pt-4 lg:border-t-0 lg:pt-0">
          <div className="space-y-1 lg:text-right">
            {/* Time Left */}
            <div className="flex items-center lg:justify-end gap-1.5 text-xs text-slate-400 font-medium">
              <Clock size={13} className="text-slate-400" />
              <span>{getWeeklyTimeRemaining()}</span>
            </div>
 
            {/* Loot details */}
            <div className="flex items-center lg:justify-end gap-1.5 text-xs text-accent">
              <Sparkles size={13} className="text-amber-500 fill-amber-500" />
              <span className="font-bold text-amber-500 font-mono tracking-tight text-[11px]">
                +{activeBoss.rewardXP} XP +{activeBoss.rewardCoins} Coins
              </span>
            </div>
          </div>
 
          <Button
            variant="primary"
            size="md"
            onClick={() => setActiveTab("boss")}
            className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/30 gap-2 shrink-0 self-center cursor-pointer"
          >
            <Sword size={15} />
            <span>Engage Battle</span>
          </Button>
        </div>
 
      </div>
    </div>
  );
}
