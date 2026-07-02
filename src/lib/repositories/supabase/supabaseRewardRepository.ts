import { supabase } from "@/lib/supabaseClient";
import { RewardItem } from "@/config/rewards";
import { safeDbWrite } from "@/game/systems/syncSystem";

export class SupabaseRewardRepository {
  async getRewards(): Promise<RewardItem[]> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("user_id", user.id);

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      cost: item.cost,
      type: item.type as any,
    }));
  }

  async saveRewards(rewards: RewardItem[]): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (rewards.length === 0) {
      await safeDbWrite("rewards", "clear", {}, "delete");
      return;
    }

    for (const r of rewards) {
      await safeDbWrite("rewards", r.id, {
        id: r.id,
        user_id: user.id,
        name: r.name,
        description: r.description || "",
        cost: r.cost,
        type: r.type,
      });
    }
  }
}

export const supabaseRewardRepository = new SupabaseRewardRepository();
