"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { LoadingState } from "@/auth/types/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

import { useProfileStore } from "@/profile/stores/profileStore";

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status, initialize } = useAuthStore();
  const { profile, loadProfile } = useProfileStore();
  const [loadingState, setLoadingState] = useState<LoadingState>("initializing");
  const [profileLoaded, setProfileLoaded] = useState(false);

  // 1. Initialize auth subscription on mount
  useEffect(() => {
    const unsubscribe = initialize();
    return () => {
      unsubscribe();
    };
  }, [initialize]);

  const [gameStateLoaded, setGameStateLoaded] = useState(false);

  // 2. Fetch player profile and gameplay state once authenticated
  useEffect(() => {
    if (status === "authenticated" && user?.id) {
      loadProfile(user.id).then(async (success) => {
        if (success) {
          setProfileLoaded(true);

          // Import gameplay stores dynamically to prevent circular dependencies
          const { useUserStore } = await import("@/stores/userStore");
          const { useMissionStore } = await import("@/stores/missionStore");
          const { useStatisticsStore } = await import("@/stores/statisticsStore");

          try {
            // Load sequentially to prevent startup race conditions
            await useUserStore.getState().loadUser();
            await useMissionStore.getState().loadMissions();
            await useStatisticsStore.getState().loadHistoryLogs();
            setGameStateLoaded(true);
          } catch (err) {
            console.error("Failed to load gameplay state:", err);
            setGameStateLoaded(true); // Proceed to prevent permanent loading lock
          }
        }
      });
    } else {
      setProfileLoaded(false);
      setGameStateLoaded(false);
    }
  }, [status, user?.id, loadProfile]);

  // 3. Map store auth, profile, and gameplay status to Provider's LoadingState
  useEffect(() => {
    if (status === "initializing") {
      setLoadingState("initializing");
    } else if (status === "authenticated" && (!profileLoaded || !gameStateLoaded)) {
      setLoadingState("initializing");
    } else {
      setLoadingState("ready");
    }
  }, [status, profileLoaded, gameStateLoaded]);

  // 4. Client-side route protection and redirection logic
  useEffect(() => {
    if (loadingState !== "ready") return;

    const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Gate Route (/) redirects based on auth status
    if (pathname === "/") {
      if (status === "authenticated") {
        if (profile?.status === "NEEDS_SETUP") {
          router.replace("/complete-profile");
        } else {
          router.replace("/dashboard");
        }
      } else if (status === "verifying") {
        router.replace("/verify-email");
      } else if (status === "anonymous") {
        router.replace("/login");
      }
      return;
    }

    if (status === "anonymous") {
      // Unauthenticated users trying to hit private routes must go to /login
      if (!isPublicRoute && pathname !== "/verify-email" && pathname !== "/complete-profile") {
        router.replace("/login");
      }
    } else if (status === "verifying") {
      // Authenticated but unverified users must be locked in /verify-email
      if (pathname !== "/verify-email") {
        router.replace("/verify-email");
      }
    } else if (status === "authenticated") {
      if (profile?.status === "NEEDS_SETUP") {
        // Authenticated users with pending setups are locked in /complete-profile
        if (pathname !== "/complete-profile") {
          router.replace("/complete-profile");
        }
      } else {
        // Authenticated and verified users visiting auth/signup/verify/complete-profile pages are sent to dashboard
        // Exclude /reset-password so users can complete their recovery session password reset
        if ((isPublicRoute && pathname !== "/reset-password") || pathname === "/verify-email" || pathname === "/complete-profile") {
          router.replace("/dashboard");
        }
      }
    }
  }, [status, profile, loadingState, pathname, router]);

  // Render Splash Loader Screen during initialization
  if (loadingState === "initializing") {
    const splashMessage = status === "authenticated" && !profileLoaded
      ? "Retrieving player credentials..."
      : status === "authenticated" && !gameStateLoaded
      ? "Hydrating gameplay records..."
      : "Authorising secure connection...";

    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200 select-none">
        {/* Glow background */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_75%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
          <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">
            {splashMessage}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
export default AuthProvider;
