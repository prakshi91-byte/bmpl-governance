import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoleId } from "@/data/repo";

interface UIState {
  navCollapsed: boolean;
  toggleNav: () => void;
  setNavCollapsed: (v: boolean) => void;
  currentRole: RoleId;
  setCurrentRole: (r: RoleId) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (v: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      navCollapsed: false,
      toggleNav: () => set((s) => ({ navCollapsed: !s.navCollapsed })),
      setNavCollapsed: (v) => set({ navCollapsed: v }),
      currentRole: "global-admin",
      setCurrentRole: (r) => set({ currentRole: r }),
      rightPanelOpen: true,
      setRightPanelOpen: (v) => set({ rightPanelOpen: v }),
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "bpml-ui" },
  ),
);

export const ROLE_PERMS: Record<RoleId, { canEdit: boolean; canAdmin: boolean }> = {
  "global-admin": { canEdit: true, canAdmin: true },
  "domain-admin": { canEdit: true, canAdmin: false },
  "project-manager": { canEdit: true, canAdmin: false },
  viewer: { canEdit: false, canAdmin: false },
};
