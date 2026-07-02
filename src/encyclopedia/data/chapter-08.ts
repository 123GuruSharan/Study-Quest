import { EncyclopediaChapter } from "./types";

export const chapter08: EncyclopediaChapter = {
  id: "focus",
  chapterNumber: 8,
  title: "Focus Timer",
  icon: "Clock",
  description: "The Deep Work Pomodoro configurations, mission association, and payout logic.",
  readingTime: 2,
  keywords: ["focus", "timer", "pomodoro", "deep work", "payout", "session", "minutes"],
  sections: [
    {
      type: "text",
      content: "The Focus Timer implements the Pomodoro technique (deep work intervals followed by short breaks) to structure your study sessions and record active focus minutes."
    },
    {
      type: "list",
      title: "Focus Configurations",
      items: [
        "Work Interval: 25 minutes of deep focus.",
        "Break Interval: 5 minutes of rest.",
        "Mission Association: Link a locked mission to your active work timer."
      ]
    },
    {
      type: "tip",
      content: "If a mission is associated, completing the 25-minute Pomodoro timer automatically triggers that mission's completion in your profile, awarding its full payouts and boss damage!"
    }
  ],
  didYouKnow: "If you complete a session without an associated mission, the timer falls back to a standard focus session reward of +25 XP and +2 Coins.",
  related: ["loop", "missions"]
};
