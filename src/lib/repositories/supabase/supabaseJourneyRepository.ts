import { supabase } from "@/lib/supabaseClient";
import { JourneyEntry } from "@/types/journey";
import { safeDbWrite } from "@/game/systems/syncSystem";

export class SupabaseJourneyRepository {
  async getJourneyEntries(): Promise<JourneyEntry[]> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from("journey_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false });

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category as any,
      description: item.description,
      timestamp: item.timestamp,
    }));
  }

  async saveJourneyEntries(entries: JourneyEntry[]): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (entries.length === 0) {
      await safeDbWrite("journey_logs", "clear", {}, "delete");
      return;
    }

    for (const entry of entries) {
      await safeDbWrite("journey_logs", entry.id, {
        id: entry.id,
        user_id: user.id,
        title: entry.title,
        category: entry.category,
        description: entry.description || "",
        timestamp: entry.timestamp,
      });
    }
  }
}

export const supabaseJourneyRepository = new SupabaseJourneyRepository();
