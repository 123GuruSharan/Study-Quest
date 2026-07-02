import { EncyclopediaChapter } from "./types";

export const chapter10: EncyclopediaChapter = {
  id: "streak",
  chapterNumber: 10,
  title: "Streak System",
  icon: "TrendingUp",
  description: "Consecutive daily fire tiers and multiplier bonuses.",
  readingTime: 2,
  keywords: ["streak", "days", "tiers", "fire", "multiplier", "flame"],
  sections: [
    {
      type: "text",
      content: "The Streak System measures long-term consistency. Logging in and completing study sessions on successive days advances your Fire Streak tier, providing a permanent multiplier boost to your study outputs."
    },
    {
      type: "table",
      title: "Fire Streak Tiers & Boosts",
      table: {
        headers: ["Streak Length", "Streak Tier Rank", "XP Multiplier Boost"],
        rows: [
          ["0 - 6 Days", "Initiate Flame", "1.0x (No bonus)"],
          ["7 - 29 Days", "Bronze Flame", "1.1x (10% XP bonus)"],
          ["30 - 99 Days", "Silver Flame", "1.25x (25% XP bonus)"],
          ["100 - 364 Days", "Golden Flame", "1.5x (50% XP bonus)"],
          ["365+ Days", "Immortal", "2.0x (100% XP bonus - Capped)"]
        ]
      }
    },
    {
      type: "warning",
      content: "Missing an active study day resets your streak counter to 0! Keep the fire burning to protect your streak rank."
    }
  ],
  didYouKnow: "Streak multipliers stack multiplicatively with Combo boosts. A 2.0x Combo stacked with a 1.5x Golden Flame streak yield a massive 3.0x final XP multiplier!",
  related: ["xp", "combo", "daily-goals"]
};
