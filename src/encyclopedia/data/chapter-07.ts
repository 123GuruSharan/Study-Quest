import { EncyclopediaChapter } from "./types";

export const chapter07: EncyclopediaChapter = {
  id: "daily-goals",
  chapterNumber: 7,
  title: "Daily Goals",
  icon: "Compass",
  description: "The core targets checklist, midnight resets, and completion bonuses.",
  readingTime: 2,
  keywords: ["daily", "goals", "targets", "reset", "bonus", "chest", "timezone"],
  sections: [
    {
      type: "text",
      content: "Each day, the game generates a set of Daily Targets. Completing all three targets is crucial to keep your streak burning and claim a major payout boost."
    },
    {
      type: "list",
      title: "Daily Target Objectives",
      items: [
        "Earn 300 XP: Acquired from study sessions, timer ticks, and mission payouts.",
        "Complete 6 Mission Points: Calculated from completed tasks today.",
        "Claim Daily Loot Chest: Log in and click to open the surprise chest."
      ]
    },
    {
      type: "tip",
      content: "All Daily Goals are calculated using your browser's local timezone. The targets list resets automatically at local midnight."
    }
  ],
  didYouKnow: "Failing to complete your daily goals resets your active combo back to 1.0x and inflicts a minor XP penalty. Stay consistent to protect your stats!",
  related: ["mp", "xp", "chest", "penalties"]
};
