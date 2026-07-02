import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "@/types/user";
import { safeDbWrite } from "@/game/systems/syncSystem";

export class SupabaseUserRepository {
  async getUser(): Promise<UserProfile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    console.log("[SupabaseUserRepository] getUser auth session:", { sessionExists: !!session, userId: user?.id });
    if (!user) {
      console.warn("[SupabaseUserRepository] getUser: No active auth user found.");
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("[SupabaseUserRepository] getUser query result:", { hasData: !!data, error });
    if (error || !data) {
      console.error("[SupabaseUserRepository] getUser query failed:", error);
      return null;
    }

    const loadedProfile = {
      id: data.id,
      username: data.username,
      level: data.current_level !== null && data.current_level !== undefined ? data.current_level : 1,
      rankName: data.rankName || "Novice Mind",
      xp: data.current_xp !== null && data.current_xp !== undefined ? data.current_xp : 0,
      coins: data.coins !== null && data.coins !== undefined ? data.coins : 0,
      streak: data.streak !== null && data.streak !== undefined ? data.streak : 0,
      comboMultiplier: data.comboMultiplier !== null && data.comboMultiplier !== undefined ? data.comboMultiplier : 1.0,
      studyHours: data.studyHours !== null && data.studyHours !== undefined ? data.studyHours : 0.0,
      phoneUsageMinutes: data.phoneUsageMinutes !== null && data.phoneUsageMinutes !== undefined ? data.phoneUsageMinutes : 0,
      missionPoints: data.missionPoints !== null && data.missionPoints !== undefined ? data.missionPoints : 0,
      theme: data.theme || "light",
      firstName: data.first_name,
      lastName: data.last_name,
      avatar: data.avatar,
      bio: data.bio,
      lastChestClaimedAt: data.last_chest_claimed_at,
      bossHp: data.boss_hp !== null && data.boss_hp !== undefined ? data.boss_hp : 25000,
      bossesDefeatedCount: data.bosses_defeated !== null && data.bosses_defeated !== undefined ? data.bosses_defeated : 0,
    };

    console.log("[SupabaseUserRepository] getUser - FINAL VALUES AFTER RELOAD:", {
      xp: loadedProfile.xp,
      level: loadedProfile.level,
      coins: loadedProfile.coins,
      streak: loadedProfile.streak,
      bossHp: loadedProfile.bossHp,
      bossesDefeatedCount: loadedProfile.bossesDefeatedCount,
    });

    return loadedProfile;
  }

  async saveUser(user: UserProfile): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // 1. Log Previous Values (from current store / database state)
    console.log("[SupabaseUserRepository] saveUser - PREVIOUS VALUES (in memory):", {
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      streak: user.streak,
      bossHp: user.bossHp,
      bossesDefeatedCount: user.bossesDefeatedCount,
    });

    const payload = {
      id: session.user.id,
      username: user.username,
      email: session.user.email || "",
      current_level: user.level !== null && user.level !== undefined ? user.level : 1,
      current_xp: user.xp !== null && user.xp !== undefined ? user.xp : 0,
      coins: user.coins !== null && user.coins !== undefined ? user.coins : 0,
      streak: user.streak !== null && user.streak !== undefined ? user.streak : 0,
      theme: user.theme || "light",
      first_name: user.firstName || "",
      last_name: user.lastName || "",
      avatar: user.avatar || "",
      bio: user.bio || "",
      last_chest_claimed_at: user.lastChestClaimedAt || null,
      boss_hp: user.bossHp !== null && user.bossHp !== undefined ? user.bossHp : 25000,
      bosses_defeated: user.bossesDefeatedCount !== null && user.bossesDefeatedCount !== undefined ? user.bossesDefeatedCount : 0,
    };

    console.log("[SupabaseUserRepository] saveUser - CALCULATED VALUES / SQL UPDATE PAYLOAD:", payload);

    try {
      await safeDbWrite("profiles", session.user.id, payload);
      console.log("[SupabaseUserRepository] saveUser - SUPABASE RESPONSE: Success");
    } catch (err) {
      console.error("[SupabaseUserRepository] saveUser - SUPABASE RESPONSE: Failed with error:", err);
      throw err;
    }
  }
}

export const supabaseUserRepository = new SupabaseUserRepository();
