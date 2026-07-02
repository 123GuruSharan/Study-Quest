import { supabase } from "@/lib/supabaseClient";
import { UserAchievementLog } from "@/types/achievement";
import { safeDbWrite } from "@/game/systems/syncSystem";

export class SupabaseAchievementRepository {
  async getAchievementLogs(): Promise<UserAchievementLog[]> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id);

    if (error || !data) return [];

    return data.map((item) => ({
      achievementId: item.achievement_id,
      unlockedAt: item.unlocked_at,
      claimed: item.claimed,
      progressPercentage: item.progress_percentage,
    }));
  }

  async saveAchievementLogs(logs: UserAchievementLog[]): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (logs.length === 0) {
      await safeDbWrite("achievements", "clear", {}, "delete");
      return;
    }

    for (const log of logs) {
      const id = `ach_${log.achievementId}_${user.id.substring(0, 8)}`;
      await safeDbWrite("achievements", id, {
        id,
        user_id: user.id,
        achievement_id: log.achievementId,
        unlocked_at: log.unlockedAt || "",
        claimed: log.claimed,
        progress_percentage: log.progressPercentage,
      });
    }
  }
}

export const supabaseAchievementRepository = new SupabaseAchievementRepository();
