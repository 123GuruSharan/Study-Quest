import { EncyclopediaChapter } from "./types";

export const chapter11: EncyclopediaChapter = {
  id: "boss",
  chapterNumber: 11,
  title: "Weekly Boss Battles",
  icon: "Swords",
  description: "Combat rules, damage indicators, health scaling, and boss progressions.",
  readingTime: 2,
  unlockedAtLevel: 2, // Unlockable at level 2!
  keywords: ["boss", "battle", "combat", "damage", "scaling", "hp"],
  sections: [
    {
      type: "text",
      content: "Weekly Bosses represent obstacles to focus. By completing missions, you deal damage to the boss. Defeating the boss clears the arena and counts toward your 'Bosses Defeated' record."
    },
    {
      type: "list",
      title: "Combat Mechanics",
      items: [
        "Inflicting Damage: Completing a locked mission inflicts direct damage equal to the task's base XP reward (Easy: 250 HP, Medium: 600 HP, Hard: 1,200 HP, Epic: 2,500 HP).",
        "Boss Scaling: The active boss begins with 25,000 HP. Each time you defeat a boss, the next boss scales up in difficulty, increasing maximum health by +5,000 HP."
      ]
    },
    {
      type: "progression",
      content: "Current boss levels: Level 1 (25K HP), Level 2 (30K HP), Level 3 (35K HP), Level 4 (40K HP), scaling indefinitely."
    }
  ],
  didYouKnow: "Boss fights reset weekly, spawning a new monster. Defeating bosses unlocks premium profile badges and rare custom items in the Reward Shop.",
  related: ["missions", "xp", "achievements"]
};
