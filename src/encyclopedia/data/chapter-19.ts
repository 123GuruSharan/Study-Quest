import { EncyclopediaChapter } from "./types";

export const chapter19: EncyclopediaChapter = {
  id: "fair-play",
  chapterNumber: 19,
  title: "Fair Play & Sync",
  icon: "ShieldAlert",
  description: "Account guidelines, anti-cheating, and cloud synchronization rules.",
  readingTime: 1,
  keywords: ["fair play", "sync", "cheating", "account", "guidelines", "integrity"],
  sections: [
    {
      type: "text",
      content: "StudyQuest relies on your personal integrity. Because this is a self-improvement game, cheating or creating fake missions only cheats your own real-world progress."
    },
    {
      type: "list",
      title: "Core Guidelines",
      items: [
        "One Account per Player: All logs and ranks are synchronized to your single user profile in the Supabase cloud.",
        "Cloud Sync Integrity: Do not edit or modify network payloads to artificially increase coins or XP balances.",
        "Real Progress Only: Only complete tasks you have actually finished in real life. Keep the quest lines honest!"
      ]
    },
    {
      type: "warning",
      content: "Altering client-side storage keys directly to modify XP values may desynchronize your local state from Supabase, leading to profile initialization failures!"
    }
  ],
  didYouKnow: "StudyQuest's sync system uses safe database write locks to ensure your progress is securely saved and synced across all your devices.",
  related: ["welcome", "future"]
};
