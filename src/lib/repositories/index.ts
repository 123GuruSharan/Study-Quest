import { supabaseUserRepository } from "./supabase/supabaseUserRepository";
import { supabaseMissionRepository } from "./supabase/supabaseMissionRepository";
import { supabaseStatisticsRepository } from "./supabase/supabaseStatisticsRepository";
import { supabaseAchievementRepository } from "./supabase/supabaseAchievementRepository";
import { supabaseRewardRepository } from "./supabase/supabaseRewardRepository";
import { supabaseJourneyRepository } from "./supabase/supabaseJourneyRepository";

import { userRepository as localUserRepository } from "./userRepository";
import { missionRepository as localMissionRepository } from "./missionRepository";
import { statisticsRepository as localStatisticsRepository } from "./statisticsRepository";
import { achievementRepository as localAchievementRepository } from "./achievementRepository";

import { RewardItem } from "@/config/rewards";
import { JourneyEntry } from "@/types/journey";

class LocalRewardRepository {
  async getRewards(): Promise<RewardItem[]> {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("studyquest_custom_shop");
    return data ? JSON.parse(data) : [];
  }
  async saveRewards(rewards: RewardItem[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem("studyquest_custom_shop", JSON.stringify(rewards));
  }
}

class LocalJourneyRepository {
  async getJourneyEntries(): Promise<JourneyEntry[]> {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("studyquest_journey_log");
    return data ? JSON.parse(data) : [];
  }
  async saveJourneyEntries(entries: JourneyEntry[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem("studyquest_journey_log", JSON.stringify(entries));
  }
}

const useSupabase = process.env.NEXT_PUBLIC_STORAGE_PROVIDER === "supabase" || !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export const userRepository = useSupabase ? supabaseUserRepository : localUserRepository;
export const missionRepository = useSupabase ? supabaseMissionRepository : localMissionRepository;
export const statisticsRepository = useSupabase ? supabaseStatisticsRepository : localStatisticsRepository;
export const achievementRepository = useSupabase ? supabaseAchievementRepository : localAchievementRepository;
export const rewardRepository = useSupabase ? supabaseRewardRepository : new LocalRewardRepository();
export const journeyRepository = useSupabase ? supabaseJourneyRepository : new LocalJourneyRepository();
