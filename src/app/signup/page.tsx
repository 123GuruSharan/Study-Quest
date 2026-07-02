"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Import the local illustration from the login folder
import illustration from "../login/image.png";

export default function SignupPage() {
  const router = useRouter();
  const { signup, status } = useAuthStore();
  const { showToast } = useToastStore();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loading = status === "initializing";

  // Password criteria regex: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      showToast("Please fill out all required fields.", "error", "Validation Error");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      showToast("Please enter a valid email address.", "error", "Validation Error");
      return;
    }

    if (!passwordRegex.test(password)) {
      showToast(
        "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.",
        "error",
        "Weak Password"
      );
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error", "Validation Error");
      return;
    }

    if (!acceptTerms) {
      showToast("You must accept the Terms of Service to continue.", "error", "Validation Error");
      return;
    }

    const success = await signup(email.trim(), password);
    if (success) {
      // Store signup details locally for profile completion
      localStorage.setItem("studyquest_signup_fullname", fullName.trim());
      localStorage.setItem("studyquest_signup_username", username.trim());
      router.push("/verify-email");
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
              Create Your Account
            </h2>
            <p className="text-xs text-text-secondary">
              Start leveling up your mind today.
            </p>
          </div>

          {/* Premium Glass Card */}
          <div className="bg-card border border-border-theme/50 shadow-xl rounded-2xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
            <form onSubmit={handleSignup} className="space-y-3.5">
              
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-text-secondary/60">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    disabled={loading}
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-text-secondary/60">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="janedoe"
                    disabled={loading}
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-text-secondary/60">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    disabled={loading}
                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-text-secondary/60">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full h-9 pl-9 pr-10 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-text-secondary/60 hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-text-secondary/60">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full h-9 pl-9 pr-10 rounded-xl border border-border-theme bg-card text-xs focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-hidden transition-all text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-text-secondary/60 hover:text-text-primary"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Accept Terms Checkbox */}
              <div className="flex items-center gap-2.5 pt-1.5 select-none">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-border-theme text-accent focus:ring-accent focus:ring-opacity-25"
                />
                <label htmlFor="agreeTerms" className="text-xs text-text-secondary font-medium cursor-pointer">
                  I agree to the <span className="font-bold text-accent hover:underline">Terms & Conditions</span>
                </label>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-bold rounded-xl bg-accent hover:bg-accent/90 active:bg-accent-hover text-white transition-all cursor-pointer mt-1"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

            </form>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-xs text-text-secondary">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-accent hover:underline">
            Sign In
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
