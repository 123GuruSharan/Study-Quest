import { EncyclopediaChapter } from "./types";

export const chapter09: EncyclopediaChapter = {
  id: "combo",
  chapterNumber: 9,
  title: "Combo Multiplier",
  icon: "Flame",
  description: "Dynamic multiplier bonuses for consecutive mission completions.",
  readingTime: 2,
  keywords: ["combo", "multiplier", "boost", "consecutive", "completions"],
  sections: [
    {
      type: "text",
      content: "Completing tasks in quick succession builds a Combo. The active combo boost scales up your XP payouts, rewarding focused bursts of productivity."
    },
    {
      type: "table",
      title: "Combo Tiers & Boost Multipliers",
      table: {
        headers: ["Successive Completions", "XP Multiplier Boost"],
        rows: [
          ["1 Completion", "1.0x (Standard payout)"],
          ["2 Completions", "1.2x (20% XP bonus)"],
          ["3 Completions", "1.5x (50% XP bonus)"],
          ["4+ Completions", "2.0x (100% XP bonus - Capped)"]
        ]
      }
    },
    {
      type: "warning",
      content: "Be careful! Missing daily targets or logging phone overuse immediately resets your active Combo Multiplier back to 1.0x!"
    }
  ],
  didYouKnow: "At a 2.0x Combo, completed missions and timer focus sessions yield exactly double their base XP rewards! Protect your combo to maximize leveling speed.",
  related: ["xp", "streak", "penalties"]
};
