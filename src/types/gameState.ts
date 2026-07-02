import { UserProfile } from "./user";
import { Mission } from "./mission";
import { UserAchievementLog } from "./achievement";
import { StudySessionLog } from "./statistics";
import { JourneyEntry } from "./journey";
import { RewardItem } from "@/config/rewards";

export interface GameNotification {
  id: string;
  type: "success" | "info" | "warning" | "danger" | "level_up" | "achievement";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FocusTimerState {
  isActive: boolean;
  minutesRemaining: number;
  secondsRemaining: number;
  initialMinutes: number;
  sessionType: "work" | "short_break" | "long_break";
  xpEarnedThisSession: number;
  associatedMissionId?: string; // Link active Pomodoro to locked missions
}

export interface DailyQuestItem {
  id: string;
  text: string;
  targetType: string; // e.g. "hard_missions" | "xp" | "phone_limit" | "study_hours"
  targetValue: number;
  currentValue: number;
  completed: boolean;
}

export interface GameState {
  user: UserProfile;
  missions: Mission[];
  achievements: UserAchievementLog[];
  historyLogs: StudySessionLog[];
  notifications: GameNotification[];
  timer: FocusTimerState;
  chestCooldown: string | null;
  bossHP: number;
  bossMaxHP: number;
  comboCount: number;
  journeyLog: JourneyEntry[];
  customShopItems: RewardItem[];
  dailyQuests: DailyQuestItem[];
}
