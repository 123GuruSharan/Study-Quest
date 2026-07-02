import { EncyclopediaChapter } from "./types";

export const chapter14: EncyclopediaChapter = {
  id: "shop",
  chapterNumber: 14,
  title: "Reward Shop",
  icon: "ShoppingBag",
  description: "Redeeming custom rewards, catalog item management, and self-discipline rules.",
  readingTime: 2,
  keywords: ["shop", "rewards", "purchase", "custom", "gold", "coins"],
  sections: [
    {
      type: "text",
      content: "The Reward Shop connects your study efforts with real-life rewards. You define custom items (e.g. 'Enjoy a slice of pizza' or 'Buy a video game') and purchase them using your study gold coins."
    },
    {
      type: "list",
      title: "How to Manage Custom Rewards",
      items: [
        "1. Create: Press 'Create Custom Reward', defining a title, description, and gold coin price.",
        "2. Spend: Accumulate study coins, and click 'Redeem' on a reward item to deduct coins.",
        "3. Claim: Indulge in your real-life reward guilt-free, knowing you paid for it with active focus hours!"
      ]
    },
    {
      type: "tip",
      content: "Be honest with yourself! Do not claim real-life rewards unless you've earned enough coins and clicked the redeem button. Self-discipline is the foundation of gamified productivity."
    }
  ],
  didYouKnow: "In future updates, a global Marketplace will let you buy and sell themes, badges, and avatar profiles directly with other players.",
  related: ["coins", "future"]
};
