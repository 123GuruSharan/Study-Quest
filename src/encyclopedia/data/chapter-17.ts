import { EncyclopediaChapter } from "./types";

export const chapter17: EncyclopediaChapter = {
  id: "penalties",
  chapterNumber: 17,
  title: "Penalties & Deductions",
  icon: "AlertTriangle",
  description: "Rules regarding phone overuse, task expiry, late submissions, and missed goals.",
  readingTime: 2,
  keywords: ["penalties", "deductions", "phone overuse", "expiry", "missed goals", "reset"],
  sections: [
    {
      type: "text",
      content: "StudyQuest enforces strict rules to keep you accountable. Failing to adhere to rules triggers XP deductions and resets your multipliers."
    },
    {
      type: "table",
      title: "Active Penalty Formulas",
      table: {
        headers: ["Violation Type", "XP Deduction Penalty", "Multiplier Consequences"],
        rows: [
          ["Phone Overuse", "-10 XP per 10 mins over limit", "Resets Combo multiplier to 1.0x"],
          ["Missed Daily Goal", "-15 XP", "Resets Combo multiplier to 1.0x"],
          ["Expired Mission", "-50 XP", "Decrements active XP score"],
          ["Late Submission", "-20 XP", "None"]
        ]
      }
    },
    {
      type: "warning",
      content: "If a penalty causes your XP to drop below 0 for your level, your level will not decrease, but your XP will pool at 0 in your current level progress bar."
    }
  ],
  didYouKnow: "Exceeding your screen time limit by 60 minutes deducts -60 XP and instantly kills your 2.0x combo! Track screen time to avoid this.",
  related: ["xp", "combo", "streak"]
};
