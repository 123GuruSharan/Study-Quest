import { EncyclopediaChapter } from "./types";

export const chapter01: EncyclopediaChapter = {
  id: "welcome",
  chapterNumber: 1,
  title: "Welcome to StudyQuest",
  icon: "Sparkles",
  description: "Introduction to the philosophy of converting real-life studying into an RPG adventure.",
  readingTime: 1,
  keywords: ["intro", "welcome", "philosophy", "rpg", "progression"],
  sections: [
    {
      type: "text",
      content: "StudyQuest is not just another task manager or note-taking checklist. It is a full-scale Life RPG (Role-Playing Game). By designing your daily tasks as game missions and your focus intervals as active questing, StudyQuest bridges the gap between digital progression and real-life achievements."
    },
    {
      type: "tip",
      content: "Real studying. Real progression. No fake rewards, no artificial grinding. Your character sheet is a direct reflection of your real-life academic actions."
    }
  ],
  didYouKnow: "StudyQuest's design takes inspiration from classic tabletop games and modern dark-mode glassmorphic aesthetics to make you feel like you are opening a game codex.",
  related: ["loop", "xp"]
};
