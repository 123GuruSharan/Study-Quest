import { Profile, ProfileStatus } from "../types/profile";

export function mapDbRowToProfile(row: any): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    timezone: row.timezone || "UTC",
    status: (row.status as ProfileStatus) || "NEEDS_SETUP",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
}

export function mapProfileToDbRow(profile: Partial<Profile>): any {
  const row: any = {};

  if (profile.id !== undefined) row.id = profile.id;
  if (profile.username !== undefined) row.username = profile.username;
  if (profile.displayName !== undefined) row.display_name = profile.displayName;
  if (profile.firstName !== undefined) row.first_name = profile.firstName;
  if (profile.lastName !== undefined) row.last_name = profile.lastName;
  if (profile.avatarUrl !== undefined) row.avatar_url = profile.avatarUrl;
  if (profile.bio !== undefined) row.bio = profile.bio;
  if (profile.timezone !== undefined) row.timezone = profile.timezone;
  if (profile.status !== undefined) row.status = profile.status;
  if (profile.lastLoginAt !== undefined) row.last_login_at = profile.lastLoginAt;

  return row;
}
