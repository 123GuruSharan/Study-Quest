export type ProfileStatus = "NEEDS_SETUP" | "ACTIVE" | "SUSPENDED";

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null; // Stores relative storage path inside bucket
  bio: string | null;
  timezone: string;
  status: ProfileStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export type ProfileErrorCode =
  | "USERNAME_TAKEN"
  | "USERNAME_INVALID"
  | "USERNAME_RESERVED"
  | "BIO_TOO_LONG"
  | "AVATAR_TOO_LARGE"
  | "AVATAR_INVALID_TYPE"
  | "NOT_FOUND"
  | "NETWORK"
  | "PERMISSION_DENIED"
  | "UNKNOWN";

export interface ProfileError {
  code: ProfileErrorCode;
  message: string;
}
