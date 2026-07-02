"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Coins, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

import { chestSystem, ChestReward } from "@/game/systems/chestSystem";
import { eventSystem, EVENTS } from "@/game/systems/eventSystem";
import { useUserStore } from "@/stores/userStore";

export function SurpriseChest() {
  const { user, claimDailyChest } = useUserStore();
  const [loot, setLoot] = useState<ChestReward | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const isClaimedToday = user?.lastChestClaimedAt === new Date().toDateString();

  // Clear loot preview if already claimed previously
  useEffect(() => {
    if (isClaimedToday && !loot) {
      setLoot(null);
    }
  }, [isClaimedToday, loot]);

  // Live countdown timer until local midnight
  useEffect(() => {
    if (!isClaimedToday) return;

    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isClaimedToday]);

  const handleOpenChest = async () => {
    if (!isClaimedToday) {
      const reward = chestSystem.openChest("daily");
      setLoot(reward);
      await claimDailyChest(reward.xp, reward.coins);
      eventSystem.publish(EVENTS.CHEST_OPENED, { xp: reward.xp, coins: reward.coins });
    }
  };

  return (
    <Card
      onClick={handleOpenChest}
      className={`relative flex flex-col items-center justify-center text-center p-6 h-full min-h-[220px] bg-slate-900 border-slate-800 text-white select-none overflow-hidden glow-chest group ${
        !isClaimedToday ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Background soft blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />

      {/* Opening beam of light */}
      <AnimatePresence>
        {isClaimedToday && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.8, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 bottom-12 w-32 bg-gradient-to-t from-accent/40 via-blue-500/10 to-transparent blur-md origin-bottom pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        
        {/* Chest 3D container */}
        <div className="relative w-28 h-20 flex flex-col justify-end items-center mb-4 perspective-500">
          
          {/* Lid (Top Half) */}
          <motion.div
            className="absolute top-4 w-20 h-7 bg-gradient-to-b from-slate-700 via-slate-850 to-slate-900 border-x border-t border-slate-500 rounded-t-lg origin-bottom z-20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            animate={isClaimedToday ? { rotateX: -75, y: -6, z: -10 } : { rotateX: 0, y: 0, z: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
          >
            {/* Lid Trim */}
            <div className="absolute inset-x-3 bottom-0 h-full border-x border-slate-400 opacity-60 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-slate-400" />
          </motion.div>

          {/* Base (Bottom Half) */}
          <div className="w-20 h-10 bg-slate-850 border border-slate-650 rounded-b-md relative z-10 shadow-lg">
            {/* Base Trim */}
            <div className="absolute inset-x-3 top-0 h-full border-x border-slate-400 opacity-60 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-slate-400" />
            
            {/* Lock mechanism */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400 border border-slate-300 rounded-b-xs shadow-md z-30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Glowing lock when closed */}
            {!isClaimedToday && (
              <span className="absolute -inset-1 rounded-md bg-accent/15 blur-xs group-hover:bg-accent/35 transition-colors pointer-events-none" />
            )}
          </div>

          {/* Sparkles when open */}
          <AnimatePresence>
            {isClaimedToday && (
              <div className="absolute inset-0 z-15 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                >
                  <Sparkles className="text-amber-400 animate-pulse" size={24} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>

        {/* Dynamic Chest Text / Rewards */}
        <div className="space-y-1 relative z-10 w-full min-h-[48px]">
          <AnimatePresence mode="wait">
            {!isClaimedToday ? (
              <motion.div
                key="closed-text"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Surprise Chest
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Click to claim Daily Chest
                </p>
              </motion.div>
            ) : loot ? (
              <motion.div
                key="open-loot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded-md mb-1.5 animate-[bounce_2s_infinite]">
                  <Coins size={11} className="text-amber-400 fill-current" />
                  <span className="text-[11px] font-bold text-amber-400 font-mono">+{loot.coins} Coins</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-950/40 border border-blue-900/50 px-2 py-0.5 rounded-md">
                  <Gift size={11} className="text-blue-400" />
                  <span className="text-[11px] font-bold text-blue-400 font-mono">+{loot.xp} XP Boost</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="claimed-text"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Already Claimed
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  Next Chest in {timeLeft || "--h --m --s"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </Card>
  );
}
