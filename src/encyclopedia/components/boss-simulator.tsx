"use client";

import React, { useState, useEffect } from "react";
import { Swords, RotateCcw, ShieldAlert, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getBossForDefeatedCount } from "@/config/bosses";

export function BossSimulator() {
  const [defeatedCount, setDefeatedCount] = useState<number>(0);
  const bossData = getBossForDefeatedCount(defeatedCount);
  const maxHp = bossData.maxHp;
  const [bossHp, setBossHp] = useState<number>(maxHp);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Epic">("Medium");

  // Keep simulator HP synced if defeated count starts out at 0
  useEffect(() => {
    setBossHp(maxHp);
  }, [defeatedCount, maxHp]);

  const getDamageValue = () => {
    switch (difficulty) {
      case "Easy":
        return 250;
      case "Hard":
        return 1200;
      case "Epic":
        return 2500;
      case "Medium":
      default:
        return 600;
    }
  };

  const damage = getDamageValue();
  const pct = Math.max(0, Math.round((bossHp / maxHp) * 100));

  const handleSimulateHit = () => {
    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);

    if (nextHp === 0) {
      setTimeout(() => {
        const nextDefCount = defeatedCount + 1;
        setDefeatedCount(nextDefCount);
        const nextBoss = getBossForDefeatedCount(nextDefCount);
        setBossHp(nextBoss.maxHp);
      }, 800);
    }
  };

  const handleReset = () => {
    const firstBoss = getBossForDefeatedCount(0);
    setBossHp(firstBoss.maxHp);
    setDefeatedCount(0);
  };

  return (
    <Card className="p-5 border-border-theme bg-card shadow-sm space-y-5 my-6">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            🐉 Boss Combat Simulator
          </h4>
          <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
            Click 'Simulate Hit' to view how mission difficulties deplete the boss's HP bar.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="p-1 rounded-lg border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800/40 text-text-secondary cursor-pointer"
          title="Reset Simulator"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <div className="space-y-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40">
        <div className="flex justify-between items-end">
          <div>
            <h5 className="text-[10px] font-bold text-accent uppercase tracking-wider">
              Boss #{defeatedCount + 1}: {bossData.name}
            </h5>
            <p className="text-xs font-black text-text-primary mt-1">
              {bossHp.toLocaleString()} / {maxHp.toLocaleString()} HP
            </p>
          </div>
          <span className="text-[10px] font-bold text-text-secondary">
            {pct}% HP Remaining
          </span>
        </div>

        <Progress value={bossHp} max={maxHp} className="h-2.5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
            Select Completed Mission
          </label>
          <select
            value={difficulty}
            onChange={(e: any) => setDifficulty(e.target.value)}
            className="w-full h-9 rounded-lg border border-border-theme bg-card px-2.5 text-xs text-text-secondary focus-visible:outline-none cursor-pointer"
          >
            <option value="Easy">Easy Mission (-250 HP)</option>
            <option value="Medium">Medium Mission (-600 HP)</option>
            <option value="Hard">Hard Mission (-1200 HP)</option>
            <option value="Epic">Epic Mission (-2500 HP)</option>
          </select>
        </div>

        {/* Trigger Button */}
        <div className="flex items-end">
          <Button
            variant="primary"
            className="w-full h-9 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            onClick={handleSimulateHit}
            disabled={bossHp === 0}
          >
            <Swords size={13} />
            <span>Simulate Hit (-{damage} HP)</span>
          </Button>
        </div>
      </div>

      {defeatedCount > 0 && (
        <div className="p-3 rounded-lg bg-success/5 border border-success/15 flex items-center gap-2 text-[10px] text-success animate-[fadeIn_200ms_ease] font-bold">
          <Trophy size={14} className="text-success shrink-0" />
          <span>Boss Defeated! Spawned Boss #{defeatedCount + 1} with max HP scaled to {maxHp.toLocaleString()} HP!</span>
        </div>
      )}
    </Card>
  );
}
