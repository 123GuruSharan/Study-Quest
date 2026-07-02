export interface AuthenticatedUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  isAuthenticated: boolean;
}

export type AuthStatus = "initializing" | "authenticated" | "anonymous" | "verifying" | "error";

export type LoadingState = "initializing" | "checking" | "ready" | "error";

export type AuthErrorCode =
  | "EMAIL_EXISTS"
  | "INVALID_PASSWORD"
  | "INVALID_EMAIL"
  | "WEAK_PASSWORD"
  | "NOT_VERIFIED"
  | "NETWORK"
  | "UNKNOWN";

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}
