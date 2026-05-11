import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addAreaToRepo,
  addProcessToRepo,
  addCapabilityToRepo,
  addTemplateToRepo,
  type ProcessArea,
  type Process,
  type Capability,
  type Template,
  type TemplateStep,
} from "@/data/repo";

interface DraftTemplate {
  tpl: Template;
  capabilityIds: string[];
  steps: TemplateStep[];
}

interface DraftsState {
  areas: ProcessArea[];
  processes: Process[];
  capabilities: Capability[];
  templates: DraftTemplate[];
  version: number;
  hydrated: boolean;
  hydrate: () => void;
  addArea: (a: ProcessArea) => void;
  addProcess: (p: Process) => void;
  addCapability: (c: Capability) => void;
  addTemplate: (t: DraftTemplate) => void;
  isDraft: (kind: "area" | "process" | "capability" | "template", id: string | number) => boolean;
}

export const useDraftsStore = create<DraftsState>()(
  persist(
    (set, get) => ({
      areas: [],
      processes: [],
      capabilities: [],
      templates: [],
      version: 0,
      hydrated: false,
      hydrate: () => {
        if (get().hydrated) return;
        for (const a of get().areas) addAreaToRepo(a);
        for (const p of get().processes) addProcessToRepo(p);
        for (const c of get().capabilities) addCapabilityToRepo(c);
        for (const t of get().templates) addTemplateToRepo(t.tpl, t.capabilityIds, t.steps);
        set({ hydrated: true, version: get().version + 1 });
      },
      addArea: (a) => {
        addAreaToRepo(a);
        set((s) => ({ areas: [...s.areas, a], version: s.version + 1 }));
      },
      addProcess: (p) => {
        addProcessToRepo(p);
        set((s) => ({ processes: [...s.processes, p], version: s.version + 1 }));
      },
      addCapability: (c) => {
        addCapabilityToRepo(c);
        set((s) => ({ capabilities: [...s.capabilities, c], version: s.version + 1 }));
      },
      addTemplate: (t) => {
        addTemplateToRepo(t.tpl, t.capabilityIds, t.steps);
        set((s) => ({ templates: [...s.templates, t], version: s.version + 1 }));
      },
      isDraft: (kind, id) => {
        const s = get();
        if (kind === "area") return s.areas.some((a) => a.id === id);
        if (kind === "process") return s.processes.some((p) => p.id === id);
        if (kind === "capability") return s.capabilities.some((c) => c.id === id);
        return s.templates.some((t) => t.tpl.id === id);
      },
    }),
    {
      name: "bpml-drafts-v2",
      partialize: (s) => ({
        areas: s.areas,
        processes: s.processes,
        capabilities: s.capabilities,
        templates: s.templates,
      }),
    },
  ),
);
