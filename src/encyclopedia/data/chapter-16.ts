import { EncyclopediaChapter } from "./types";

export const chapter16: EncyclopediaChapter = {
  id: "calendar",
  chapterNumber: 16,
  title: "Calendar Heatmap",
  icon: "Calendar",
  description: "How study heatmaps work and how to track your productivity over time.",
  readingTime: 2,
  keywords: ["calendar", "heatmap", "contribution", "grid", "history", "logs"],
  sections: [
    {
      type: "text",
      content: "The Calendar tab features a contribution grid layout (similar to GitHub commits). Each square represents a single calendar day, with color intensity reflecting your study hours on that day."
    },
    {
      type: "list",
      title: "Color Coding System",
      items: [
        "Light/Gray cells: 0 hours studied.",
        "Soft Blue cells: 0.1 to 1.5 study hours.",
        "Medium Blue cells: 1.6 to 3.0 study hours.",
        "Deep Accent Blue cells: 3.0+ study hours (High-intensity focus days)."
      ]
    },
    {
      type: "tip",
      content: "Hover over any block in the calendar grid to see exactly how many hours and phone overuse minutes you recorded on that specific date."
    }
  ],
  didYouKnow: "Consistency is key. Keeping the calendar colored in soft blue is much better for long-term retention than having one deep blue cell followed by a week of empty cells!",
  related: ["statistics", "streak"]
};
