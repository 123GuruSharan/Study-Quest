import { EncyclopediaChapter } from "./types";

export const chapter13: EncyclopediaChapter = {
  id: "achievements",
  chapterNumber: 13,
  title: "Achievements",
  icon: "Trophy",
  description: "Badges tiers, unlock milestones, and claim payouts.",
  readingTime: 2,
  keywords: ["achievements", "badges", "trophy", "milestones", "unlocked", "claim"],
  sections: [
    {
      type: "text",
      content: "Achievements recognize milestones in your StudyQuest progression. Badges are organized into five ranks: Bronze, Silver, Gold, Diamond, and Legendary. Unlocking achievements grants major XP rewards."
    },
    {
      type: "list",
      title: "Key Achievement Tiers",
      items: [
        "1. Study Milestones: Accumulate study hours (e.g. 5 hours for Apprentice, 100 hours for Scholar Legend).",
        "2. Boss Slayer: Defeat weekly bosses in the Battle Arena.",
        "3. Consistency Streak: Maintain consecutive daily focus streaks (e.g., 7-day, 30-day, 100-day streaks).",
        "4. Level Milestones: Reach level thresholds (e.g. Level 5, Level 10, Level 20)."
      ]
    },
    {
      type: "tip",
      content: "Once unlocked, you must click on the achievement inside your Achievements panel to claim its rewards. Claimed rewards are instantly added to your coins balance."
    }
  ],
  didYouKnow: "Reaching a 100-day study streak unlocks the 'Golden Streak' Diamond Achievement, yielding a massive +500 Coins and +1,000 XP!",
  related: ["xp", "boss", "streak"]
};
