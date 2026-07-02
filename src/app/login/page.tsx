"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Import local illustration
import illustration from "./image.png";

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuthStore();
  const { showToast } = useToastStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loading = status === "initializing";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Please enter both email and password.", "error", "Validation Error");
      return;
    }

    const success = await login(email.trim(), password.trim());
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-white dark:bg-slate-950 transition-colors duration-200 select-none overflow-hidden font-sans">
      
      {/* Left Column: Authentic Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
              Ready to start your success story?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Signin to our website and continue leafing through your favorite literature today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 pt-4">
            
            {/* Email Address */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 py-1.5 focus-within:border-[#96cdfb] transition-all">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="janedoe@mail.com"
                disabled={loading}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-0 focus:border-none"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 py-1.5 focus-within:border-[#96cdfb] transition-all">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-[#96cdfb] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-0 focus:border-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-5 bg-[#96cdfb] hover:bg-[#85c1f9] active:bg-[#72b5f7] text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                New reader?{" "}
                <Link href="/signup" className="font-bold text-[#96cdfb] hover:underline">
                  Create account
                </Link>
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* Right Column: Illustration Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#faf9f6] dark:bg-slate-900 relative">
        <Image
          src={illustration}
          alt="Study Illustration"
          priority
          fill
          sizes="50vw"
          className="object-cover object-bottom"
        />
      </div>

    </div>
  );
}
