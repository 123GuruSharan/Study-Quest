import { EncyclopediaChapter } from "./types";

export const chapter05: EncyclopediaChapter = {
  id: "missions",
  chapterNumber: 5,
  title: "Missions",
  icon: "Target",
  description: "Task lifecycles, difficulty configurations, and dynamic payout values.",
  readingTime: 2,
  keywords: ["missions", "difficulty", "easy", "medium", "hard", "epic", "legendary"],
  sections: [
    {
      type: "text",
      content: "Missions are your custom tasks. A mission advances through several stages: Draft (planning), Locked (active queue), and Completed (payouts collected) or Expired (deadline passed)."
    },
    {
      type: "table",
      title: "Mission Difficulties & Base Payouts",
      table: {
        headers: ["Difficulty", "Base XP", "Base Coins", "Mission Points (MP)", "Boss Damage"],
        rows: [
          ["Easy", "50 XP", "5 Coins", "1 MP", "250 HP"],
          ["Medium", "120 XP", "10 Coins", "2 MP", "600 HP"],
          ["Hard", "250 XP", "20 Coins", "3 MP", "1,200 HP"],
          ["Epic", "500 XP", "45 Coins", "5 MP", "2,500 HP"]
        ]
      }
    },
    {
      type: "warning",
      content: "Missions have a scheduled completion date. If a mission's date passes without completion, it expires, causing a flat XP deduction penalty!"
    }
  ],
  didYouKnow: "A Hard mission inflicts 1,200 HP damage to the weekly boss—almost 5 times more than an Easy mission. Prioritize Hard missions to defeat bosses faster!",
  related: ["mp", "boss", "penalties"]
};
