import { storageProvider } from "../storage";
import { Mission } from "@/types/mission";

export class MissionRepository {
  private key = "studyquest_missions";

  async getMissions(): Promise<Mission[] | null> {
    return storageProvider.getItem<Mission[]>(this.key);
  }

  async saveMissions(missions: Mission[]): Promise<void> {
    await storageProvider.setItem<Mission[]>(this.key, missions);
  }
}

export const missionRepository = new MissionRepository();
