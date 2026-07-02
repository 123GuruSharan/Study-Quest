import { supabase } from "@/lib/supabaseClient";
import { Mission } from "@/types/mission";
import { safeDbWrite } from "@/game/systems/syncSystem";

export class SupabaseMissionRepository {
  async getMissions(): Promise<Mission[]> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      subject: item.subject,
      difficulty: item.difficulty,
      deadline: item.deadline,
      status: item.status,
      xpReward: item.xp_reward,
      coinReward: item.coin_reward,
      missionPoints: item.mission_points,
      locked: item.locked,
      proofRequired: item.proof_required,
      proofUploaded: item.proof_uploaded,
      proofFileName: item.proof_file_name,
      startedAt: item.started_at,
      completedAt: item.completed_at,
      createdAt: item.createdAt || item.created_at,
      notes: item.notes,
      priority: item.priority || "Medium",
      energyCost: item.energyCost || 15,
    }));
  }

  async saveMissions(missions: Mission[]): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    if (missions.length === 0) {
      // Clear missions in sync table
      await safeDbWrite("missions", "clear", {}, "delete");
      return;
    }

    for (const m of missions) {
      await safeDbWrite("missions", m.id, {
        id: m.id,
        user_id: user.id,
        title: m.title,
        description: m.description || "",
        subject: m.subject,
        difficulty: m.difficulty,
        deadline: m.deadline,
        status: m.status,
        xp_reward: m.xpReward,
        coin_reward: m.coinReward,
        mission_points: m.missionPoints,
        locked: m.locked,
        proof_required: m.proofRequired,
        proof_uploaded: m.proofUploaded,
        proof_file_name: m.proofFileName || "",
        started_at: m.startedAt || null,
        completed_at: m.completedAt || null,
        created_at: m.createdAt || new Date().toISOString(),
      });
    }
  }
}

export const supabaseMissionRepository = new SupabaseMissionRepository();
