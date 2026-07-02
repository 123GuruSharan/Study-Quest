import { profileRepository } from "../repositories/ProfileRepository";
import { Profile, ProfileError, ProfileErrorCode, ProfileStatus } from "../types/profile";
import { resizeAndConvertToWebP } from "../utils/imageCompressor";

const RESERVED_USERNAMES = [
  "admin", "root", "support", "studyquest", "api", "system", "dashboard",
  "login", "signup", "settings", "profile", "auth", "help", "legal",
  "privacy", "terms", "status", "about", "contact", "blog", "guest"
];

export class ProfileService {
  /**
   * Verifies whether a username conforms to regex, is not reserved, and is not already taken.
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const clean = username.trim().toLowerCase();
    
    // Enforce strict regex: 3-20 characters, lowercase alphanumeric and underscores
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(clean)) {
      return false;
    }

    // Check reserved
    if (RESERVED_USERNAMES.includes(clean)) {
      return false;
    }

    try {
      const exists = await profileRepository.checkUsernameExists(clean);
      return !exists;
    } catch {
      return false;
    }
  }

  /**
   * Validates profile input parameters.
   */
  validateProfileInputs(username: string, displayName: string, bio: string | null): void {
    const cleanUsername = username.trim().toLowerCase();
    const regex = /^[a-z0-9_]{3,20}$/;

    if (!regex.test(cleanUsername)) {
      throw { code: "USERNAME_INVALID", message: "Username must be 3-20 characters and contain only lowercase letters, numbers, and underscores." };
    }

    if (RESERVED_USERNAMES.includes(cleanUsername)) {
      throw { code: "USERNAME_RESERVED", message: "This username is reserved and cannot be used." };
    }

    if (!displayName.trim()) {
      throw { code: "USERNAME_INVALID", message: "Display name cannot be empty." };
    }

    if (bio && bio.length > 300) {
      throw { code: "BIO_TOO_LONG", message: "Bio cannot exceed 300 characters." };
    }
  }

  /**
   * Dynamic calculation of profile completion percentage.
   */
  calculateCompletionPercentage(profile: Profile | null): number {
    if (!profile) return 0;
    
    let score = 20; // Base: Trigger created initial entry (20%)
    
    // Custom username set (not starting with default 'player_')
    if (profile.username && !profile.username.startsWith("player_")) {
      score += 20;
    }
    
    // Custom display name configured (not default 'New Player')
    if (profile.displayName && profile.displayName !== "New Player") {
      score += 20;
    }
    
    // Bio is populated
    if (profile.bio && profile.bio.trim().length > 0) {
      score += 20;
    }
    
    // Avatar is uploaded
    if (profile.avatarUrl) {
      score += 20;
    }
    
    return score;
  }

  /**
   * Loads a user profile.
   */
  async loadProfile(userId: string): Promise<Profile | null> {
    try {
      return await profileRepository.getProfile(userId);
    } catch (err: any) {
      throw ProfileService.mapError(err);
    }
  }

  /**
   * Complete setup of a user profile (moves state to ACTIVE).
   */
  async setupProfile(
    userId: string,
    data: {
      username: string;
      displayName: string;
      firstName?: string | null;
      lastName?: string | null;
      bio?: string | null;
      avatarFile?: File | null;
    }
  ): Promise<Profile> {
    try {
      this.validateProfileInputs(data.username, data.displayName, data.bio || null);

      // Verify availability if changing username
      const currentProfile = await profileRepository.getProfile(userId);
      if (!currentProfile || currentProfile.username !== data.username) {
        const available = await this.isUsernameAvailable(data.username);
        if (!available) {
          throw { code: "USERNAME_TAKEN", message: "This username is already taken." };
        }
      }

      let avatarUrl = currentProfile?.avatarUrl || null;
      if (data.avatarFile) {
        avatarUrl = await this.processAndUploadAvatar(userId, data.avatarFile);
      }

      const timezone = typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";

      const updated = await profileRepository.updateProfile(userId, {
        username: data.username.trim().toLowerCase(),
        displayName: data.displayName.trim(),
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        bio: data.bio || null,
        avatarUrl,
        timezone,
        status: "ACTIVE", // Mark as ACTIVE on complete setup
      });

      return updated;
    } catch (err: any) {
      throw ProfileService.mapError(err);
    }
  }

  /**
   * Updates an existing profile.
   */
  async updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile> {
    try {
      if (profile.username !== undefined || profile.displayName !== undefined || profile.bio !== undefined) {
        this.validateProfileInputs(
          profile.username || "temp_user",
          profile.displayName || "Temp Player",
          profile.bio || null
        );
      }

      return await profileRepository.updateProfile(userId, profile);
    } catch (err: any) {
      throw ProfileService.mapError(err);
    }
  }

  /**
   * Validates, resizes to 512x512, converts to WebP, and uploads avatar image.
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      return await this.processAndUploadAvatar(userId, file);
    } catch (err: any) {
      throw ProfileService.mapError(err);
    }
  }

  /**
   * Internal helper to compress and upload avatar.
   */
  private async processAndUploadAvatar(userId: string, file: File): Promise<string> {
    // Validate file size (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      throw { code: "AVATAR_TOO_LARGE", message: "Avatar image size must be less than 2 MB." };
    }

    // Validate type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw { code: "AVATAR_INVALID_TYPE", message: "Invalid image format. Only PNG, JPG, and WEBP are supported." };
    }

    // Resize & Compress client-side to 512x512 WebP
    const compressedBlob = await resizeAndConvertToWebP(file, 512);
    
    // Upload through repository
    return await profileRepository.uploadAvatar(userId, compressedBlob);
  }

  /**
   * Translates raw exceptions into friendly ProfileError objects.
   */
  private static mapError(err: any): ProfileError {
    const message = err.message || "An unexpected profile error occurred.";
    let code: ProfileErrorCode = "UNKNOWN";
    const msgLower = message.toLowerCase();

    if (
      err.code === "23505" ||
      msgLower.includes("unique constraint") ||
      msgLower.includes("username_idx") ||
      msgLower.includes("already exists") ||
      msgLower.includes("profiles_username_key")
    ) {
      code = "USERNAME_TAKEN";
      return { code, message: "This username is already taken. Try another." };
    }

    if (err.code && typeof err.code === "string") {
      return { code: err.code as ProfileErrorCode, message: err.message };
    }

    if (msgLower.includes("storage") || msgLower.includes("bucket") || msgLower.includes("upload")) {
      code = "PERMISSION_DENIED";
      return { code, message: "Failed to upload image. Please verify storage permissions." };
    } else if (msgLower.includes("network") || msgLower.includes("fetch")) {
      code = "NETWORK";
      return { code, message: "Connection failed. Please check your network connection." };
    }

    return { code, message };
  }
}

export const profileService = new ProfileService();
export default profileService;
