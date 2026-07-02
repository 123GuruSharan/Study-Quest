import { create } from "zustand";
import { AuthenticatedUser, AuthStatus } from "@/auth/types/auth";
import { authService } from "@/auth/services/AuthService";
import { useToastStore } from "./toastStore";
import { mapSupabaseUser } from "@/auth/utils/authMapper";

interface AuthState {
  user: AuthenticatedUser | null;
  status: AuthStatus;
  
  initialize: () => () => void; // Returns unsubscribe function
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  verifyEmail: () => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "initializing",

  initialize: () => {
    // Check initial session
    authService.getSession().then((session) => {
      if (session) {
        const mappedUser = mapSupabaseUser(session.user);
        if (mappedUser) {
          set({
            user: mappedUser,
            status: mappedUser.emailConfirmed ? "authenticated" : "verifying",
          });
          return;
        }
      }
      set({ user: null, status: "anonymous" });
    }).catch(() => {
      set({ user: null, status: "anonymous" });
    });

    // Listen for auth state changes
    const subscription = authService.onAuthStateChange((event, session) => {
      if (session) {
        const mappedUser = mapSupabaseUser(session.user);
        if (mappedUser) {
          set({
            user: mappedUser,
            status: mappedUser.emailConfirmed ? "authenticated" : "verifying",
          });
          
          if (event === "SIGNED_IN") {
            useToastStore.getState().showToast("Secure connection established.", "success", "Welcome");
          }
          return;
        }
      }
      
      set({ user: null, status: "anonymous" });
      if (event === "SIGNED_OUT") {
        useToastStore.getState().showToast("Session signed out successfully.", "info", "Signed Out");
      }
    });

    // Return the unsubscribe cleanup function
    return () => {
      subscription.unsubscribe();
    };
  },

  login: async (email, password) => {
    set({ status: "initializing" });
    const { user, error } = await authService.login(email, password);

    if (error) {
      set({ status: "anonymous", user: null });
      useToastStore.getState().showToast(error.message, "error", "Sign In Failed");
      return false;
    }

    if (user) {
      set({
        user,
        status: user.emailConfirmed ? "authenticated" : "verifying",
      });
      return true;
    }

    return false;
  },

  signup: async (email, password) => {
    set({ status: "initializing" });
    const { user, error } = await authService.signup(email, password);

    if (error) {
      set({ status: "anonymous", user: null });
      useToastStore.getState().showToast(error.message, "error", "Signup Failed");
      return false;
    }

    if (user) {
      set({
        user,
        status: "verifying", // Signup immediately sends verification, user is not verified yet
      });
      useToastStore.getState().showToast(
        "Verification email dispatched. Please verify your inbox.",
        "success",
        "Registration Success"
      );
      return true;
    }

    return false;
  },

  logout: async () => {
    const { error } = await authService.logout();
    if (error) {
      useToastStore.getState().showToast(error.message, "error", "Logout Fail");
      return false;
    }
    set({ user: null, status: "anonymous" });
    return true;
  },

  verifyEmail: async () => {
    set({ status: "verifying" });
    const { user, error } = await authService.verifyEmail();

    if (error) {
      useToastStore.getState().showToast(error.message, "error", "Verification Check Failed");
      set({ status: "verifying" }); // Stay in verifying state
      return false;
    }

    if (user) {
      const isConfirmed = user.emailConfirmed;
      set({
        user,
        status: isConfirmed ? "authenticated" : "verifying",
      });

      if (isConfirmed) {
        useToastStore.getState().showToast("Email address verified. Routing to dashboard...", "success", "Verified");
        return true;
      } else {
        useToastStore.getState().showToast("Verification is still pending in your inbox.", "info", "Pending");
      }
    }

    return false;
  },

  resendVerificationEmail: async (email) => {
    const { error } = await authService.resendVerificationEmail(email);

    if (error) {
      useToastStore.getState().showToast(error.message, "error", "Send Link Failed");
      return false;
    }

    useToastStore.getState().showToast("A new verification link has been sent to your email.", "success", "Dispatched");
    return true;
  },

  resetPassword: async (email) => {
    set({ status: "initializing" });
    
    // Redirect to the reset password page on this origin
    const origin = typeof window !== "undefined" ? window.location.origin : "https://studyquest.app";
    const redirectTo = `${origin}/reset-password`;

    const { error } = await authService.resetPassword(email, redirectTo);

    if (error) {
      set({ status: "anonymous" });
      useToastStore.getState().showToast(error.message, "error", "Recovery Link Error");
      return false;
    }

    set({ status: "anonymous" });
    useToastStore.getState().showToast("A recovery link has been sent to your email.", "success", "Email Sent");
    return true;
  },

  updatePassword: async (password) => {
    set({ status: "initializing" });
    const { user, error } = await authService.updatePassword(password);

    if (error) {
      set({ status: "anonymous" }); // Fall back or keep state
      useToastStore.getState().showToast(error.message, "error", "Update Password Failed");
      return false;
    }

    if (user) {
      set({
        user,
        status: "authenticated",
      });
      useToastStore.getState().showToast("Password updated successfully.", "success", "Completed");
      return true;
    }

    return false;
  },
}));
