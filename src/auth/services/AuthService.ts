import { supabase } from "@/lib/supabase";
import { AuthenticatedUser, AuthError, AuthErrorCode } from "../types/auth";
import { mapSupabaseUser } from "../utils/authMapper";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export class AuthService {
  /**
   * Translates raw Supabase Auth errors into standardized domain AuthError objects.
   */
  private static mapError(err: any): AuthError {
    const rawMessage = err?.message || "";
    const msgLower = rawMessage.toLowerCase();
    
    let code: AuthErrorCode = "UNKNOWN";
    let friendlyMessage = "An unexpected authentication error occurred. Please try again.";

    if (msgLower.includes("invalid login credentials") || msgLower.includes("invalid email or password")) {
      code = "INVALID_PASSWORD";
      friendlyMessage = "Incorrect email address or password. Please try again.";
    } else if (msgLower.includes("already registered") || msgLower.includes("email already in use") || msgLower.includes("user already exists")) {
      code = "EMAIL_EXISTS";
      friendlyMessage = "This email address is already registered. Try logging in instead.";
    } else if (msgLower.includes("email validation") || msgLower.includes("email address is invalid") || msgLower.includes("invalid email")) {
      code = "INVALID_EMAIL";
      friendlyMessage = "Please enter a valid email address.";
    } else if (msgLower.includes("password should be") || msgLower.includes("weak password") || msgLower.includes("password is too short")) {
      code = "WEAK_PASSWORD";
      friendlyMessage = "Password is too weak. It must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.";
    } else if (msgLower.includes("email not confirmed") || msgLower.includes("email confirmation required")) {
      code = "NOT_VERIFIED";
      friendlyMessage = "Your email address is not verified yet. Please check your inbox for the validation link.";
    } else if (msgLower.includes("fetch") || msgLower.includes("network") || msgLower.includes("failed to fetch") || msgLower.includes("offline")) {
      code = "NETWORK";
      friendlyMessage = "Connection failed. Please check your internet connection or verify your Supabase configuration.";
    }

    return { code, message: friendlyMessage };
  }

  /**
   * Authenticate a user with email and password.
   */
  async login(email: string, password: string): Promise<{ user: AuthenticatedUser | null; error?: AuthError }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: mapSupabaseUser(data.user) };
    } catch (err: any) {
      return { user: null, error: AuthService.mapError(err) };
    }
  }

  /**
   * Register a user with email and password.
   * Notice: We do NOT collect first name, last name, or username in Sprint 1.
   */
  async signup(email: string, password: string): Promise<{ user: AuthenticatedUser | null; error?: AuthError }> {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/`,
        },
      });

      if (error) throw error;
      return { user: mapSupabaseUser(data.user) };
    } catch (err: any) {
      return { user: null, error: AuthService.mapError(err) };
    }
  }

  /**
   * Sign out the current user session.
   */
  async logout(): Promise<{ error?: AuthError }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return {};
    } catch (err: any) {
      return { error: AuthService.mapError(err) };
    }
  }

  /**
   * Verify email status by refreshing the session token.
   */
  async verifyEmail(): Promise<{ user: AuthenticatedUser | null; error?: AuthError }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        return { user: null, error: { code: "NOT_VERIFIED", message: "No active session found." } };
      }

      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { user: mapSupabaseUser(data.user) };
    } catch (err: any) {
      return { user: null, error: AuthService.mapError(err) };
    }
  }

  /**
   * Resend the signup confirmation email to the user.
   */
  async resendVerificationEmail(email: string): Promise<{ error?: AuthError }> {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${origin}/`,
        },
      });

      if (error) throw error;
      return {};
    } catch (err: any) {
      return { error: AuthService.mapError(err) };
    }
  }

  /**
   * Trigger a password reset link sent to the user's email.
   */
  async resetPassword(email: string, redirectTo: string): Promise<{ error?: AuthError }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;
      return {};
    } catch (err: any) {
      return { error: AuthService.mapError(err) };
    }
  }

  /**
   * Update the logged-in user's password.
   */
  async updatePassword(password: string): Promise<{ user: AuthenticatedUser | null; error?: AuthError }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      return { user: mapSupabaseUser(data.user) };
    } catch (err: any) {
      return { user: null, error: AuthService.mapError(err) };
    }
  }

  /**
   * Retrieves the current user from memory or storage.
   * Useful for future Sprint 2 profile setup checks.
   */
  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return mapSupabaseUser(user);
  }

  /**
   * Get the active session.
   */
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Subscribes to changes in authentication state.
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
}

export const authService = new AuthService();
