"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

/**
 * Gate route at (/). Redirects authenticated/anonymous sessions client-side.
 */
export default function Home() {
  const router = useRouter();
  const { status } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    } else if (status === "verifying") {
      router.replace("/verify-email");
    } else if (status === "anonymous") {
      router.replace("/login");
    }
  }, [status, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200 select-none">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_75%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">
          Verifying security keys...
        </span>
      </div>
    </div>
  );
}
