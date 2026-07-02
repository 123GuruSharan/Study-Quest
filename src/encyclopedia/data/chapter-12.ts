import { EncyclopediaChapter } from "./types";

export const chapter12: EncyclopediaChapter = {
  id: "chest",
  chapterNumber: 12,
  title: "Surprise Chest",
  icon: "Gift",
  description: "Loot drop rates, claim restrictions, and midnight cooldowns.",
  readingTime: 2,
  keywords: ["chest", "loot", "daily chest", "surprise", "rewards", "midnight"],
  sections: [
    {
      type: "text",
      content: "The Surprise Chest is a daily log-in reward. You can claim it once every calendar day. The cooldown resets at local midnight."
    },
    {
      type: "table",
      title: "Loot Roll Probabilities & Rewards",
      table: {
        headers: ["Loot Roll Tier", "Probability", "Coins Payout Payout"],
        rows: [
          ["Common Payout", "50% Chance", "10 - 20 Coins"],
          ["Uncommon Payout", "30% Chance", "21 - 35 Coins"],
          ["Rare Payout", "15% Chance", "36 - 50 Coins"],
          ["Legendary Payout", "5% Chance", "75 - 100 Coins"]
        ]
      }
    },
    {
      type: "tip",
      content: "Opening the chest is required to complete your Daily Targets! Even if you roll a Common chest, it keeps your daily completion bonus within reach."
    }
  ],
  didYouKnow: "In future updates, legendary chest drops will include rare inventory avatar borders and titles you can display on your player profile.",
  related: ["coins", "daily-goals"]
};
