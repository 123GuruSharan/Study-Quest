export interface JourneyEntry {
  id: string;
  title: string;
  category: "mission" | "streak" | "level" | "achievement" | "boss" | "placement" | "reward" | "other";
  description: string;
  timestamp: string; // ISO String
}
