import { create } from "zustand";
import { GameNotification } from "@/types/gameState";

interface UiState {
  isCreateMissionModalOpen: boolean;
  activeTab: string;
  chestState: "closed" | "open" | "claimed";
  notifications: GameNotification[];
  setCreateMissionModalOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  setChestState: (state: "closed" | "open" | "claimed") => void;
  addNotification: (notification: GameNotification) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCreateMissionModalOpen: false,
  activeTab: "dashboard",
  chestState: "closed",
  notifications: [],

  setCreateMissionModalOpen: (isOpen) => set({ isCreateMissionModalOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setChestState: (state) => set({ chestState: state }),
  
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 15), // Keep latest 15 alerts
    }));

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notification.id),
      }));
    }, 3000);
  },
    
  clearNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
    
  clearAllNotifications: () => set({ notifications: [] }),
}));
