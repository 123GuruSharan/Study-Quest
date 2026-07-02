import { EncyclopediaChapter } from "./types";

export const chapter03: EncyclopediaChapter = {
  id: "xp",
  chapterNumber: 3,
  title: "XP System",
  icon: "Zap",
  description: "How Experience Points are earned, calculated, and used to rank up your character.",
  readingTime: 2,
  keywords: ["xp", "experience", "formula", "level", "ranks", "multiplier"],
  sections: [
    {
      type: "text",
      content: "Experience Points (XP) are the core metric of your academic progression. Reaching XP milestones automatically levels up your profile, moving you to higher scholar ranks."
    },
    {
      type: "list",
      title: "XP Generation Sources",
      items: [
        "Mission Completions: Rewards scale according to task difficulty.",
        "Focus Session Completions: Pomodoro work intervals award standard base XP.",
        "Achievements: Unlocking honors badges awards substantial chunks of XP.",
        "Daily Target Bonus: Completing all targets awards a flat +50 XP bonus."
      ]
    },
    {
      type: "formula",
      title: "XP Reward Payout Formula",
      formula: {
        expression: "Final XP = Base XP * Combo Multiplier * Streak Multiplier",
        variables: [
          { name: "Base XP", desc: "XP defined by the mission difficulty or focus timer duration." },
          { name: "Combo Multiplier", desc: "Active combo boost multiplier from successive task completions (1.0x to 2.0x)." },
          { name: "Streak Multiplier", desc: "XP boost tier depending on consecutive days active (1.0x to 2.0x)." }
        ],
        example: "A Medium Mission (120 XP) completed with a 1.2x Combo boost and a 1.1x Streak tier yields: 120 * 1.2 * 1.1 = 158.4 (rounded to 158 XP)."
      }
    }
  ],
  didYouKnow: "You can use the Interactive Formula Playground below to simulate final payouts for different combinations of difficulty, streak, and combo parameters.",
  related: ["loop", "combo", "streak"]
};
