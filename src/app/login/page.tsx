"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
      
      {/* CSS Float Keyframe Injection */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(-20%); }
          50% { transform: translateY(-12px) translateX(-20%); }
        }
      `}</style>

      {/* Left Column: Form Panel (40%) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-screen bg-slate-50/30 dark:bg-slate-950/20 border-r border-border-theme/40 relative z-10">
        
        {/* Top Branding Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white shadow-xs">
            <Sparkles size={18} className="animate-[pulse_3s_infinite]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-text-primary">
              StudyQuest
            </h1>
            <p className="text-[9px] text-text-secondary uppercase tracking-widest font-bold mt-0.5">
              Level Up Your Mind.
            </p>
          </div>
        </div>

        {/* Center Auth Card */}
        <div className="my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">
              Welcome Back
            </h2>
            <p className="text-xs text-text-secondary">
              Continue your StudyQuest.
            </p>
          </div>

          {/* Premium Glass Card */}
          <div className="bg-card border border-border-theme/50 shadow-xl rounded-2xl p-6 sm:p-8 space-y-5 backdrop-blur-md">
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-text-secondary/60">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    disabled={loading}
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-accent hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-text-secondary/60">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full h-10 pl-9 pr-10 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-text-secondary/60 hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Box */}
              <div className="flex items-center justify-between pt-1 select-none">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-border-theme text-accent focus:ring-accent focus:ring-opacity-25"
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-bold rounded-xl bg-accent hover:bg-accent/90 active:bg-accent-hover text-white transition-all cursor-pointer mt-2"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </Button>

            </form>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-xs text-text-secondary">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-accent hover:underline">
            Create Account
          </Link>
        </div>

      </div>

      {/* Right Column: Illustration Panel (60%) */}
      <div className="hidden lg:flex w-[60%] bg-[#FAFBFC] relative overflow-hidden">
        {/* Soft Vignette Overlay Mask to Blend Background Boundaries */}
        <div
          className="absolute bottom-0 right-0 w-[140%] h-[120%] pointer-events-none animate-[float_6s_ease-in-out_infinite]"
          style={{
            maskImage: "radial-gradient(circle at 60% 60%, black 50%, transparent 95%)",
            WebkitMaskImage: "radial-gradient(circle at 60% 60%, black 50%, transparent 95%)",
          }}
        >
          <Image
            src={illustration}
            alt="Study Illustration"
            priority
            fill
            sizes="60vw"
            className="object-contain object-left-bottom"
          />
        </div>
      </div>

    </div>
  );
}
