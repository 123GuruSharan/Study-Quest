import { storageProvider } from "../storage";
import { StudySessionLog } from "@/types/statistics";

export class StatisticsRepository {
  private key = "studyquest_statistics_history";

  async getHistoryLogs(): Promise<StudySessionLog[] | null> {
    return storageProvider.getItem<StudySessionLog[]>(this.key);
  }

  async saveHistoryLogs(logs: StudySessionLog[]): Promise<void> {
    await storageProvider.setItem<StudySessionLog[]>(this.key, logs);
  }
}

export const statisticsRepository = new StatisticsRepository();
