export type MissionStatus = "Draft" | "Locked" | "Completed" | "Expired" | "Cancelled";
export type MissionDifficulty = "Easy" | "Medium" | "Hard" | "Epic";
export type MissionPriority = "Low" | "Medium" | "High" | "Critical";

export interface Mission {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: MissionDifficulty;
  deadline: string; // ISO String
  status: MissionStatus;
  
  // Rewards
  xpReward: number;
  coinReward: number;
  missionPoints: number;
  
  // Rules / Lock
  locked: boolean;
  proofRequired: boolean;
  proofUploaded: boolean;
  proofFileName?: string;
  
  // Metadata / Timeline
  createdAt: string;
  completedAt?: string;
  startedAt?: string;
  pausedAt?: string;
  notes?: string;

  // Future expansion fields
  priority?: MissionPriority;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  difficultyReason?: string;
  energyCost?: number;
  repeatable?: boolean;
  category?: string;
}
