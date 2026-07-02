import { EncyclopediaChapter } from "./types";

export const chapter15: EncyclopediaChapter = {
  id: "statistics",
  chapterNumber: 15,
  title: "Statistics & Charts",
  icon: "BarChart3",
  description: "Understanding XP charts, category focus breakdowns, and study graphs.",
  readingTime: 2,
  keywords: ["statistics", "charts", "graphs", "analytics", "breakdown", "category"],
  sections: [
    {
      type: "text",
      content: "The Statistics panel details your study patterns. The charts are computed dynamically from your database statistics table logs, showing real outputs."
    },
    {
      type: "list",
      title: "Key Metrics Explained",
      items: [
        "XP gained vs. Study Hours: A line graph mapping daily study times alongside accumulated XP rewards.",
        "Category Focus: A percentage breakdown illustrating which subjects you spend the most focus minutes on.",
        "Weekly Total: Tracks cumulative hours studied over the active rolling 7-day period."
      ]
    },
    {
      type: "tip",
      content: "Ensure you assign the correct tags (e.g. Algorithms, Math, Physics) when creating missions to make the Category Focus breakdown accurate!"
    }
  ],
  didYouKnow: "A balanced Category Focus helps maintain focus, preventing burnout from studying the same topic for too long. Switch subjects every 2-3 Pomodoro blocks!",
  related: ["xp", "calendar"]
};
