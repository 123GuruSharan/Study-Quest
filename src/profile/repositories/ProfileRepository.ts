import { supabase } from "@/lib/supabase";
import { Profile } from "../types/profile";
import { mapDbRowToProfile, mapProfileToDbRow } from "../utils/profileMapper";

export class ProfileRepository {
  /**
   * Fetches the profile from Supabase by user ID.
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) return null;

    return mapDbRowToProfile(data);
  }

  /**
   * Updates or inserts a profile in the profiles table.
   */
  async updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile> {
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
  }

  /**
   * Checks if a username already exists in the profiles table.
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc("check_username_exists", { username_to_check: username.toLowerCase().trim() });

    if (error) {
      const { data: selData, error: selError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username.toLowerCase().trim())
        .maybeSingle();

      if (selError) {
        throw selError;
      }
      return !!selData;
    }

    return !!data;
  }

  /**
   * Uploads an avatar image WebP Blob to the 'avatars' storage bucket.
   * Path: avatars/<userId>/profile.webp
   */
  async uploadAvatar(userId: string, fileBlob: Blob): Promise<string> {
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
  }

  /**
   * Deletes an avatar file from the 'avatars' storage bucket.
   */
  async deleteAvatar(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (error) {
      throw error;
    }
  }

  /**
   * Resolves the public URL for an avatar path in the 'avatars' bucket.
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

export const profileRepository = new ProfileRepository();
export default profileRepository;
