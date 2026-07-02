import { EncyclopediaChapter } from "./types";

export const chapter20: EncyclopediaChapter = {
  id: "future",
  chapterNumber: 20,
  title: "Future Roadmap",
  icon: "Compass",
  description: "Roadmap features including Guilds, Mentors, inventories, and season passes.",
  readingTime: 2,
  keywords: ["future", "roadmap", "guilds", "pvp", "ai", "inventory", "marketplace"],
  sections: [
    {
      type: "text",
      content: "StudyQuest's development is ongoing. Several major gameplay expansions are planned for future versions, further bridging productivity and RPG combat."
    },
    {
      type: "list",
      title: "Planned Features",
      items: [
        "Guilds & Parties: Group up with friends to tackle massive Raid Bosses together.",
        "Study Rooms: Real-time focus rooms where players gain double combo points for focus sessions.",
        "AI NPC Mentor: An automated guide that analyzes your focus logs and suggests optimal task schedules.",
        "Season Pass & Inventory: Earn rare badges, cosmetics, and profile themes by completing seasonal milestones."
      ]
    },
    {
      type: "tip",
      content: "Have a feature request or feedback? Reach out to the developers or click the helpfulness survey button at the bottom of the chapters!"
    }
  ],
  didYouKnow: "A multiplayer PvP mode is planned where players can engage in 'Focus Duels'—the player who records more focus minutes during a 24-hour window wins the match!",
  related: ["welcome", "shop"]
};
