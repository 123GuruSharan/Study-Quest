import { create } from "zustand";
import { Profile, ProfileError } from "../types/profile";
import { profileService } from "../services/ProfileService";
import { useToastStore } from "@/stores/toastStore";

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: ProfileError | null;
  
  // Actions
  loadProfile: (userId: string) => Promise<boolean>;
  setupProfile: (
    userId: string,
    data: {
      username: string;
      displayName: string;
      firstName?: string | null;
      lastName?: string | null;
      bio?: string | null;
      avatarFile?: File | null;
    }
  ) => Promise<boolean>;
  updateProfile: (userId: string, profile: Partial<Profile>) => Promise<boolean>;
  uploadAvatar: (userId: string, file: File) => Promise<string | null>;
  refreshProfile: (userId: string) => Promise<void>;
  refreshAvatar: (userId: string, file: File) => Promise<void>;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => {
  return {
    profile: null,
    loading: false,
    error: null,

    loadProfile: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const profile = await profileService.loadProfile(userId);
        set({ profile, loading: false });
        return !!profile;
      } catch (err: any) {
        set({ error: err, loading: false });
        useToastStore.getState().showToast(
          err.message || "Failed to load player profile.",
          "error",
          "Profile Error"
        );
        return false;
      }
    },

    setupProfile: async (userId: string, data) => {
      set({ loading: true, error: null });
      try {
        const profile = await profileService.setupProfile(userId, data);
        set({ profile, loading: false });
        useToastStore.getState().showToast(
          "Your player identity has been established!",
          "success",
          "Profile Created"
        );
        return true;
      } catch (err: any) {
        set({ error: err, loading: false });
        useToastStore.getState().showToast(
          err.message || "Failed to complete player profile.",
          "error",
          "Setup Failed"
        );
        return false;
      }
    },

    updateProfile: async (userId: string, profileData) => {
      set({ loading: true, error: null });
      try {
        const updated = await profileService.updateProfile(userId, profileData);
        set({ profile: updated, loading: false });
        useToastStore.getState().showToast(
          "Your profile changes have been saved.",
          "success",
          "Profile Updated"
        );
        return true;
      } catch (err: any) {
        set({ error: err, loading: false });
        useToastStore.getState().showToast(
          err.message || "Failed to save profile changes.",
          "error",
          "Save Failed"
        );
        return false;
      }
    },

    uploadAvatar: async (userId: string, file) => {
      set({ loading: true, error: null });
      try {
        const avatarPath = await profileService.uploadAvatar(userId, file);
        const currentProfile = get().profile;
        if (currentProfile) {
          const updated = await profileService.updateProfile(userId, {
            avatarUrl: avatarPath,
          });
          set({ profile: updated });
        }
        set({ loading: false });
        useToastStore.getState().showToast(
          "Your avatar has been updated successfully.",
          "success",
          "Avatar Saved"
        );
        return avatarPath;
      } catch (err: any) {
        set({ error: err, loading: false });
        useToastStore.getState().showToast(
          err.message || "Failed to upload avatar.",
          "error",
          "Upload Failed"
        );
        return null;
      }
    },

    refreshProfile: async (userId: string) => {
      try {
        const profile = await profileService.loadProfile(userId);
        set({ profile });
      } catch (err) {
        console.warn("Silent profile refresh failed:", err);
      }
    },

    refreshAvatar: async (userId: string, file) => {
      try {
        const avatarPath = await profileService.uploadAvatar(userId, file);
        const currentProfile = get().profile;
        if (currentProfile) {
          const updated = await profileService.updateProfile(userId, {
            avatarUrl: avatarPath,
          });
          set({ profile: updated });
        }
      } catch (err) {
        console.warn("Silent avatar refresh failed:", err);
      }
    },

    clear: () => {
      set({ profile: null, error: null, loading: false });
    },
  };
});
