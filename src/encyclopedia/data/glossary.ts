import { GlossaryTerm } from "./types";

export const glossaryData: GlossaryTerm[] = [
  {
    term: "XP (Experience Points)",
    definition: "Core metric representing academic progress. Reaching specific thresholds triggers level-ups and rank advancement.",
    category: "Progression",
    symbol: "XP"
  },
  {
    term: "MP (Mission Points)",
    definition: "A load index assigned to missions according to task difficulty. Earning 6 MP daily is required to complete Daily Targets.",
    category: "Missions",
    symbol: "MP"
  },
  {
    term: "Combo Multiplier",
    definition: "A temporary multiplier boost (1.0x to 2.0x) awarded for completing missions successively. Resets on phone overuse or missed daily goals.",
    category: "Boosts"
  },
  {
    term: "Streak Tier",
    definition: "Consecutive daily fire rank tiers (Initiate, Bronze, Silver, Gold, Immortal) earned by completing targets on successive calendar days.",
    category: "Boosts"
  },
  {
    term: "Deep Work (Focus Interval)",
    definition: "A structured study interval (standard 25 minutes work followed by 5 minutes rest) to maintain high concentration.",
    category: "Focus Timer"
  },
  {
    term: "Mission Lock",
    definition: "Transitioning a mission from Draft to Locked. A locked mission is active in the study queue and can be linked to the Focus Timer.",
    category: "Missions"
  },
  {
    term: "Boss HP",
    definition: "The remaining health points of the weekly boss. Completed tasks inflict damage, reducing the boss HP to 0 for a victory.",
    category: "Combat"
  },
  {
    term: "Contribution Graph (Heatmap)",
    definition: "A calendar grid showing your study consistency. Cell color intensities scale from light gray to dark blue according to study hours.",
    category: "Analytics"
  }
];
