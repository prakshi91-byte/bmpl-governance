import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addAreaToRepo,
  addCapabilityToRepo,
  addTemplateToRepo,
  type ProcessArea,
  type ProcessCapability,
  type Template,
  type TemplateStep,
} from "@/data/repo";

interface DraftTemplate {
  tpl: Template;
  processIds: string[];
  steps: TemplateStep[];
}

interface DraftsState {
  areas: ProcessArea[];
  capabilities: ProcessCapability[];
  templates: DraftTemplate[];
  /** Increments on every mutation so list views can re-render. */
  version: number;
  /** True after persisted drafts have been pushed back into repo arrays. */
  hydrated: boolean;
  hydrate: () => void;
  addArea: (a: ProcessArea) => void;
  addCapability: (c: ProcessCapability) => void;
  addTemplate: (t: DraftTemplate) => void;
  isDraft: (kind: "area" | "capability" | "template", id: string | number) => boolean;
}

export const useDraftsStore = create<DraftsState>()(
  persist(
    (set, get) => ({
      areas: [],
      capabilities: [],
      templates: [],
      version: 0,
      hydrated: false,
      hydrate: () => {
        if (get().hydrated) return;
        for (const a of get().areas) addAreaToRepo(a);
        for (const c of get().capabilities) addCapabilityToRepo(c);
        for (const t of get().templates) addTemplateToRepo(t.tpl, t.processIds, t.steps);
        set({ hydrated: true, version: get().version + 1 });
      },
      addArea: (a) => {
        addAreaToRepo(a);
        set((s) => ({ areas: [...s.areas, a], version: s.version + 1 }));
      },
      addCapability: (c) => {
        addCapabilityToRepo(c);
        set((s) => ({ capabilities: [...s.capabilities, c], version: s.version + 1 }));
      },
      addTemplate: (t) => {
        addTemplateToRepo(t.tpl, t.processIds, t.steps);
        set((s) => ({ templates: [...s.templates, t], version: s.version + 1 }));
      },
      isDraft: (kind, id) => {
        const s = get();
        if (kind === "area") return s.areas.some((a) => a.id === id);
        if (kind === "capability") return s.capabilities.some((c) => c.id === id);
        return s.templates.some((t) => t.tpl.id === id);
      },
    }),
    {
      name: "bpml-drafts",
      partialize: (s) => ({ areas: s.areas, capabilities: s.capabilities, templates: s.templates }),
    },
  ),
);
