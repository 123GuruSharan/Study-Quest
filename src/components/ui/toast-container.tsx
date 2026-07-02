"use client";

import React from "react";
import { useToastStore, ToastItem } from "@/stores/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, hideToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = toast.type === "success" 
            ? CheckCircle2 
            : toast.type === "error" 
            ? AlertCircle 
            : Info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-card backdrop-blur-md transition-colors duration-200",
                toast.type === "success" && "border-success/20 bg-card/95 text-text-primary",
                toast.type === "error" && "border-danger/20 bg-card/95 text-text-primary",
                toast.type === "info" && "border-border-theme bg-card/95 text-text-primary"
              )}
            >
              {/* Icon indicator */}
              <div
                className={cn(
                  "shrink-0 mt-0.5",
                  toast.type === "success" && "text-success",
                  toast.type === "error" && "text-danger",
                  toast.type === "info" && "text-accent"
                )}
              >
                <Icon size={16} />
              </div>

              {/* Toast content */}
              <div className="flex-1 space-y-0.5">
                {toast.title && (
                  <h5 className="text-xs font-bold tracking-tight text-text-primary">
                    {toast.title}
                  </h5>
                )}
                <p className="text-[11px] font-medium leading-relaxed text-text-secondary">
                  {toast.message}
                </p>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => hideToast(toast.id)}
                className="shrink-0 p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary/50 hover:text-text-primary transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
