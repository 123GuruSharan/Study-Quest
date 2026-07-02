import { EncyclopediaChapter } from "./types";

export const chapter18: EncyclopediaChapter = {
  id: "levels-roadmap",
  chapterNumber: 18,
  title: "Levels & Ranks Timeline",
  icon: "Award",
  description: "XP milestones, character levels config, and Sage titles roadmap.",
  readingTime: 2,
  keywords: ["levels", "ranks", "sage", "scholar", "xp", "milestones"],
  sections: [
    {
      type: "text",
      content: "As you accumulate XP, your character advances through 20 distinct academic levels. Each level unlocks a new player title, changing how your profile appears on the dashboard."
    },
    {
      type: "table",
      title: "Ranks Progression Roadmap",
      table: {
        headers: ["Level", "Cumulative XP Required", "Player Rank Title"],
        rows: [
          ["Level 1", "0 XP", "Novice Mind"],
          ["Level 2", "200 XP", "Initiate Scholar"],
          ["Level 3", "500 XP", "Apprentice Thinker"],
          ["Level 4", "1,000 XP", "Journeyman Brain"],
          ["Level 5", "2,000 XP", "Adept Academic"],
          ["Level 6", "4,000 XP", "Elite Scholar"],
          ["Level 7", "7,000 XP", "Master Sage"],
          ["Level 10", "22,000 XP", "Arch-Scholar"],
          ["Level 15", "67,000 XP", "Enlightened Thinker"],
          ["Level 20", "140,000 XP", "Grandmaster Sage"]
        ]
      }
    },
    {
      type: "tip",
      content: "Each level-up reduces the relative damage you take from penalties (as your base XP pools increase) and unlocks new shop items!"
    }
  ],
  didYouKnow: "Reaching Level 20 unlocks the ultimate rank: 'Grandmaster Sage', which is displayed in glowing text on user profile pages.",
  related: ["xp", "welcome"]
};
