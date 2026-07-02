import { EncyclopediaChapter } from "./types";

export const chapter06: EncyclopediaChapter = {
  id: "mp",
  chapterNumber: 6,
  title: "Mission Points",
  icon: "Star",
  description: "Mission Points (MP) allocation per difficulty and their role in daily targets progress.",
  readingTime: 1,
  keywords: ["mp", "mission points", "daily goal", "index", "targets"],
  sections: [
    {
      type: "text",
      content: "Mission Points (MP) represent the weight or scale of completed tasks. While XP measures character leveling, MP acts as your daily load completion index, ensuring you focus on completing a balanced mix of tasks."
    },
    {
      type: "list",
      title: "MP Allocations by Difficulty",
      items: [
        "Easy Missions: 1 MP (Quick checklist items).",
        "Medium Missions: 2 MP (Standard study sessions).",
        "Hard Missions: 3 MP (Detailed exams preparation or heavy projects).",
        "Epic Missions: 5 MP (Major milestones or multi-hour sessions)."
      ]
    },
    {
      type: "tip",
      content: "Your daily target requires completing 6 Mission Points. This can be achieved by completing two Hard missions, three Medium missions, or one Epic plus one Easy mission!"
    }
  ],
  didYouKnow: "You can track your active MP count in real time in the top-right corner of the dashboard screen.",
  related: ["missions", "daily-goals"]
};
