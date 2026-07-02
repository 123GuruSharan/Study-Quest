import { EncyclopediaChapter } from "./types";

export const chapter02: EncyclopediaChapter = {
  id: "loop",
  chapterNumber: 2,
  title: "Gameplay Loop",
  icon: "RotateCw",
  description: "The core gameplay cycle from creating a mission to upgrading your ranks.",
  readingTime: 2,
  keywords: ["loop", "gameplay", "cycle", "steps", "flowchart"],
  sections: [
    {
      type: "text",
      content: "The gameplay cycle of StudyQuest guides your productivity from planning to execution and reward redemption. Every loop completes a chain of character-building actions."
    },
    {
      type: "list",
      title: "The Core Steps",
      items: [
        "1. Create a Mission: Outline a study task with a set difficulty and reward values.",
        "2. Lock the Mission: Activating a mission transitions it to your queue, preparing it for focus study.",
        "3. Start a Focus Session: Use the Pomodoro Timer, associating it with your locked mission.",
        "4. Complete & Claim: Once the timer completes, mark the mission as complete to unlock payouts.",
        "5. Fight the Boss: Every completed task inflicts equivalent damage to the weekly boss.",
        "6. Purchase Custom Rewards: Spend your hard-earned gold coins in the Shop to redeem self-improvement rewards."
      ]
    }
  ],
  didYouKnow: "You can click on any step in the interactive flow diagram inside the encyclopedia to see detailed tips on optimizing that stage of your workflow.",
  related: ["welcome", "missions", "boss"]
};
