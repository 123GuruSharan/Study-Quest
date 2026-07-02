import { storageProvider } from "../storage";
import { UserAchievementLog } from "@/types/achievement";

export class AchievementRepository {
  private key = "studyquest_achievements_unlocked";

  async getAchievementLogs(): Promise<UserAchievementLog[] | null> {
    return storageProvider.getItem<UserAchievementLog[]>(this.key);
  }

  async saveAchievementLogs(logs: UserAchievementLog[]): Promise<void> {
    await storageProvider.setItem<UserAchievementLog[]>(this.key, logs);
  }
}

export const achievementRepository = new AchievementRepository();
