import { create } from "zustand";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  title?: string;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type: ToastItem["type"], title?: string) => void;
  hideToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (message, type, title) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = { id, message, type, title };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      get().hideToast(id);
    }, 4000);
  },

  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
