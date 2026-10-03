import { supabase } from "@/lib/supabase";
import { Profile } from "../types/profile";
import { mapDbRowToProfile, mapProfileToDbRow } from "../utils/profileMapper";

const isPlaceholderUrl = (url?: string) => {
  if (!url) return true;
  return (
    url.includes("ktjxxjvzmejqlxqsehkx") ||
    url.includes("placeholder") ||
    url.includes("example.com")
  );
};

const isMockMode = () => {
  if (process.env.NEXT_PUBLIC_STORAGE_PROVIDER === "local") return true;
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") return true;
  return isPlaceholderUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
};

export class ProfileRepository {
  private LOCAL_KEY = "studyquest_user_profile_data";

  private getLocalProfile(userId: string): Profile {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.LOCAL_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as Profile;
        } catch {}
      }
    }

    const defaultProfile: Profile = {
      id: userId,
      username: "hero_player",
      displayName: "Study Quest Hero",
      firstName: "Hero",
      lastName: "Player",
      avatarUrl: null,
      bio: "Conquering tasks and leveling up daily!",
      timezone: "UTC",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(defaultProfile));
    }
    return defaultProfile;
  }

  /**
   * Fetches the profile from Supabase by user ID, or local storage in mock mode.
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (isMockMode()) {
      return this.getLocalProfile(userId);
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }
      if (!data) return this.getLocalProfile(userId);

      return mapDbRowToProfile(data);
    } catch {
      return this.getLocalProfile(userId);
    }
  }

  /**
   * Updates or inserts a profile in the profiles table or local storage.
   */
  async updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile> {
    if (isMockMode()) {
      const current = this.getLocalProfile(userId);
      const updated: Profile = {
        ...current,
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(updated));
      }
      return updated;
    }

    try {
      const dbPayload = mapProfileToDbRow({ ...profile, id: userId });

      const { data, error } = await supabase
        .from("profiles")
        .update(dbPayload)
        .eq("id", userId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return mapDbRowToProfile(data);
    } catch {
      const current = this.getLocalProfile(userId);
      const updated: Profile = {
        ...current,
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(updated));
      }
      return updated;
    }
  }

  /**
   * Checks if a username already exists in the profiles table or local storage.
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    if (isMockMode()) return false;

    try {
      const { data, error } = await supabase
        .rpc("check_username_exists", { username_to_check: username.toLowerCase().trim() });

      if (error) {
        const { data: selData, error: selError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username.toLowerCase().trim())
          .maybeSingle();

        if (selError) {
          return false;
        }
        return !!selData;
      }

      return !!data;
    } catch {
      return false;
    }
  }

  async uploadAvatar(userId: string, fileBlob: Blob): Promise<string> {
    if (isMockMode()) {
      return "mock_avatar_path";
    }

    try {
      const filePath = `${userId}/profile.webp`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, fileBlob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      return filePath;
    } catch {
      return "mock_avatar_path";
    }
  }

  async deleteAvatar(filePath: string): Promise<void> {
    if (isMockMode()) return;
    try {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (error) throw error;
    } catch {}
  }

  getPublicUrl(filePath: string): string {
    if (isMockMode()) return "";
    try {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch {
      return "";
    }
  }
}

export const profileRepository = new ProfileRepository();
export default profileRepository;

