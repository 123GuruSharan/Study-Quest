import { supabase } from "@/lib/supabase";
import { AuthenticatedUser, AuthError, AuthErrorCode } from "../types/auth";
import { mapSupabaseUser } from "../utils/authMapper";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

const isPlaceholderUrl = (url?: string) => {
  if (!url) return true;
  return (
    url.includes("ktjxxjvzmejqlxqsehkx") ||
    url.includes("placeholder") ||
    url.includes("example.com")
  );
};

const isMockAuthMode = () => {
  if (process.env.NEXT_PUBLIC_STORAGE_PROVIDER === "local") return true;
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") return true;
  return isPlaceholderUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
};

export class AuthService {
  private static MOCK_SESSION_KEY = "studyquest_mock_session";

  /**
   * Translates raw Supabase Auth errors into standardized domain AuthError objects.
   */
  private static mapError(err: any): AuthError {
    const rawMessage = err?.message || err?.toString() || "";
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

  private createMockSession(email: string, isConfirmed: boolean = true): AuthenticatedUser {
    const user: AuthenticatedUser = {
      id: "demo-user-id",
      email: email || "hero@studyquest.app",
      emailConfirmed: isConfirmed,
      isAuthenticated: true,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AuthService.MOCK_SESSION_KEY, JSON.stringify(user));
    }
    return user;
  }

  private getMockSessionUser(): AuthenticatedUser | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(AuthService.MOCK_SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthenticatedUser;
    } catch {
      return null;
    }
  }

  /**
   * Authenticate a user with email and password.
   */
  async login(email: string, password: string): Promise<{ user: AuthenticatedUser | null; error?: AuthError }> {
    if (isMockAuthMode()) {
      const user = this.createMockSession(email, true);
      return { user };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: mapSupabaseUser(data.user) };
    } catch (err: any) {
      const mappedErr = AuthService.mapError(err);
      if (mappedErr.code === "NETWORK") {
        const user = this.createMockSession(email, true);
        return { user };
      }
      return { user: null, error: mappedErr };
    }
  }

  /**
   * Register a user with email and password.
   */
  async signup(email: string, password: string): Promise<{ user: AuthenticatedUser | null; error?: AuthError }> {
    if (isMockAuthMode()) {
      const user = this.createMockSession(email, false);
      return { user };
    }

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
      const mappedErr = AuthService.mapError(err);
      if (mappedErr.code === "NETWORK") {
        const user = this.createMockSession(email, false);
        return { user };
      }
      return { user: null, error: mappedErr };
    }
  }

  /**
   * Sign out the current user session.
   */
  async logout(): Promise<{ error?: AuthError }> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AuthService.MOCK_SESSION_KEY);
    }
    if (isMockAuthMode()) {
      return {};
    }

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
    const mockUser = this.getMockSessionUser();
    if (mockUser || isMockAuthMode()) {
      const verifiedUser = this.createMockSession(mockUser?.email || "hero@studyquest.app", true);
      return { user: verifiedUser };
    }

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
    if (isMockAuthMode()) {
      return {};
    }

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
    if (isMockAuthMode()) {
      return {};
    }

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
    const mockUser = this.getMockSessionUser();
    if (mockUser || isMockAuthMode()) {
      return { user: mockUser };
    }

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
   */
  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const mockUser = this.getMockSessionUser();
    if (mockUser) return mockUser;

    if (isMockAuthMode()) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      return mapSupabaseUser(user);
    } catch {
      return null;
    }
  }

  /**
   * Get the active session.
   */
  async getSession(): Promise<Session | null> {
    const mockUser = this.getMockSessionUser();
    if (mockUser) {
      return {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
        token_type: "bearer",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          aud: "authenticated",
          role: "authenticated",
          email_confirmed_at: mockUser.emailConfirmed ? new Date().toISOString() : null,
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString(),
        },
      } as Session;
    }

    if (isMockAuthMode()) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  }

  /**
   * Subscribes to changes in authentication state.
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    if (isMockAuthMode()) {
      return {
        unsubscribe: () => {},
      };
    }
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
      return subscription;
    } catch {
      return {
        unsubscribe: () => {},
      };
    }
  }
}

export const authService = new AuthService();

