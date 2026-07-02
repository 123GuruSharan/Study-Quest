"use client";

import React, { useState } from "react";
import { Zap, Coins, Swords, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { gameConfig } from "@/config/game";
import { missionRewardsConfig } from "@/config/rewards";
import { calculateBossDamage } from "@/config/bosses";

export function FormulaPlayground() {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Epic">("Medium");
  const [comboCount, setComboCount] = useState<number>(2);
  const [streakDays, setStreakDays] = useState<number>(7);

  // Base configurations from single source config
  const getBaseStats = () => {
    const rewards = missionRewardsConfig.difficultyRewards[difficulty];
    return {
      xp: rewards.xp,
      coins: rewards.coins,
      mp: rewards.missionPoints,
      boss: calculateBossDamage(difficulty),
    };
  };

  const base = getBaseStats();

  // Combo rules calculation from gameConfig
  const getComboMultiplier = () => {
    const sortedCombos = [...gameConfig.comboRules.multipliers].sort(
      (a, b) => b.completionsCount - a.completionsCount
    );
    for (const rule of sortedCombos) {
      if (comboCount >= rule.completionsCount) {
        return rule.multiplier;
      }
    }
    return 1.0;
  };

  const comboMult = getComboMultiplier();

  // Streak rules calculation from gameConfig
  const getStreakTier = () => {
    const sortedTiers = [...gameConfig.streakRules.tiers].sort((a, b) => b.days - a.days);
    for (const tier of sortedTiers) {
      if (streakDays >= tier.days) {
        return tier;
      }
    }
    return gameConfig.streakRules.tiers[0];
  };

  const activeTier = getStreakTier();
  const streakMult = activeTier.multiplier;

  // Outputs
  const finalXp = Math.round(base.xp * comboMult * streakMult);
  const finalCoins = base.coins; // Coin payouts are flat
  const bossDamage = base.boss; // Boss damage is flat

  const getStreakTierName = () => {
    return activeTier.tierName;
  };

  return (
    <Card className="p-5 border-border-theme bg-card shadow-sm space-y-5 my-6">
      <div>
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
          🔮 Test Payout Simulator
        </h4>
        <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
          Configure combo multipliers and streak tier values to calculate potential payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Difficulty Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Task Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e: any) => setDifficulty(e.target.value)}
            className="w-full h-9 rounded-lg border border-border-theme bg-card px-2 text-xs text-text-secondary focus-visible:outline-none cursor-pointer"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Epic">Epic</option>
          </select>
        </div>

        {/* Combo Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            <span>Combo Completions</span>
            <span className="text-accent">{comboCount} tasks</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={comboCount}
            onChange={(e) => setComboCount(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-[9px] text-text-secondary/70">
            <span>1 task (1.0x)</span>
            <span>4+ tasks (2.0x)</span>
          </div>
        </div>

        {/* Streak Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            <span>Consecutive Days</span>
            <span className="text-accent">{streakDays} days</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="1"
            value={streakDays}
            onChange={(e) => setStreakDays(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-[9px] text-text-secondary/70">
            <span>0 days</span>
            <span>100+ days (Golden)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-theme/40 text-center">
        <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
          <span className="text-[9px] font-bold text-accent uppercase tracking-widest block">
            Estimated XP
          </span>
          <span className="text-lg font-black text-text-primary mt-1 flex items-center justify-center gap-1">
            <Zap size={13} className="text-accent" />
            +{finalXp}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
            Estimated Coins
          </span>
          <span className="text-lg font-black text-text-primary mt-1 flex items-center justify-center gap-1">
            <Coins size={13} className="text-amber-500" />
            +{finalCoins}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
          <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">
            Boss Damage
          </span>
          <span className="text-lg font-black text-text-primary mt-1 flex items-center justify-center gap-1">
            <Swords size={13} className="text-rose-500" />
            -{bossDamage}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
          <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
            Mission Points
          </span>
          <span className="text-lg font-black text-text-primary mt-1 flex items-center justify-center gap-1">
            <Star size={13} className="text-purple-500" />
            +{base.mp} MP
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] text-text-secondary/80 bg-slate-50 dark:bg-slate-900/35 p-3 rounded-lg border border-border-theme/40 gap-2">
        <span className="flex items-center gap-1">
          <strong>Streak Rank:</strong> {getStreakTierName()} ({streakMult.toFixed(2)}x Boost)
        </span>
        <span className="flex items-center gap-1">
          <strong>Combo Boost:</strong> {comboMult.toFixed(1)}x Multiplier
        </span>
      </div>
    </Card>
  );
}
