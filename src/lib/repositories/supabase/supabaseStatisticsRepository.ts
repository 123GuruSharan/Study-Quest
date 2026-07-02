import { supabase } from "@/lib/supabaseClient";
import { StudySessionLog } from "@/types/statistics";
import { safeDbWrite } from "@/game/systems/syncSystem";

export class SupabaseStatisticsRepository {
  async getHistoryLogs(): Promise<StudySessionLog[]> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from("statistics")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      date: item.date,
      minutesFocused: item.minutes_focused,
      xpEarned: item.xp_earned,
      missionsCompleted: item.missions_completed || 0,
      phoneUsageMinutes: item.phone_usage_minutes,
    }));
  }

  async saveHistoryLogs(logs: StudySessionLog[]): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (logs.length === 0) {
      await safeDbWrite("statistics", "clear", {}, "delete");
      return;
    }

    for (const log of logs) {
      const id = log.id || `stat_${log.date}_${user.id.substring(0, 8)}`;
      await safeDbWrite("statistics", id, {
        id,
        user_id: user.id,
        date: log.date,
        minutes_focused: log.minutesFocused,
        xp_earned: log.xpEarned,
        missions_completed: log.missionsCompleted || 0,
        phone_usage_minutes: log.phoneUsageMinutes,
      });
    }
  }
}

export const supabaseStatisticsRepository = new SupabaseStatisticsRepository();
