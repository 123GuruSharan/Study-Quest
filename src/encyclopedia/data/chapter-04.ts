import { EncyclopediaChapter } from "./types";

export const chapter04: EncyclopediaChapter = {
  id: "coins",
  chapterNumber: 4,
  title: "Coins Economy",
  icon: "Coins",
  description: "Gold coins purpose, acquisition, and spending rules in the custom Reward Shop.",
  readingTime: 2,
  keywords: ["coins", "gold", "shop", "economy", "rewards", "purchase"],
  sections: [
    {
      type: "text",
      content: "Coins represent the primary economic currency of StudyQuest. Earning gold coins allows you to redeem self-defined custom rewards, turning hard-won coins into actual real-life satisfaction."
    },
    {
      type: "list",
      title: "Acquisition Methods",
      items: [
        "Missions: Completing a mission pays out gold coins based on difficulty.",
        "Focus Payouts: Completing Pomodoro sessions awards a standard focus coin count.",
        "Daily Loot Chests: Opening daily chests rewards random coin rolls.",
        "Target Bonuses: Completing your targets awards extra bonus coins."
      ]
    },
    {
      type: "tip",
      content: "Spend your coins responsibly! Custom rewards are user-defined items (like 'Play 1 Hour of Video Games' or 'Treat Yourself to Coffee'). The coins economy relies on self-discipline to make the game mechanics function effectively."
    }
  ],
  didYouKnow: "In future updates, a marketplace and NPC item shops will let you buy pets, titles, and inventory customization themes directly using your accumulated gold coins.",
  related: ["xp", "shop", "chest"]
};
