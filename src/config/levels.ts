export interface LevelDefinition {
  level: number;
  xpRequired: number;
  rankName: string;
}

export const levelsConfig: LevelDefinition[] = [
  { level: 1, xpRequired: 0, rankName: "Novice Mind" },
  { level: 2, xpRequired: 200, rankName: "Initiate Scholar" },
  { level: 3, xpRequired: 500, rankName: "Apprentice Thinker" },
  { level: 4, xpRequired: 1000, rankName: "Journeyman Brain" },
  { level: 5, xpRequired: 2000, rankName: "Adept Academic" },
  { level: 6, xpRequired: 4000, rankName: "Elite Scholar" },
  { level: 7, xpRequired: 7000, rankName: "Master Sage" },
  { level: 8, xpRequired: 11000, rankName: "Grand Sage" },
  { level: 9, xpRequired: 16000, rankName: "Supreme Thinker" },
  { level: 10, xpRequired: 22000, rankName: "Arch-Scholar" },
  { level: 11, xpRequired: 29000, rankName: "High Scholar" },
  { level: 12, xpRequired: 37000, rankName: "Lore Keeper" },
  { level: 13, xpRequired: 46000, rankName: "Intellect Dynamo" },
  { level: 14, xpRequired: 56000, rankName: "Thought Leader" },
  { level: 15, xpRequired: 67000, rankName: "Enlightened Thinker" },
  { level: 16, xpRequired: 79000, rankName: "Cognitive Knight" },
  { level: 17, xpRequired: 92000, rankName: "Mind Overlord" },
  { level: 18, xpRequired: 106000, rankName: "Mental Giant" },
  { level: 19, xpRequired: 121000, rankName: "Ascended Scholar" },
  { level: 20, xpRequired: 140000, rankName: "Grandmaster Sage" },
];
