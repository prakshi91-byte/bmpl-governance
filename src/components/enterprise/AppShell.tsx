import { cn } from "@/lib/utils";
import { useUIStore, ROLE_PERMS } from "@/stores/ui-store";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Layers,
  ListTree,
  Map as MapIcon,
  Network,
  Package,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Workflow,
} from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { repo, type RoleId } from "@/data/repo";
import { useDraftsStore } from "@/stores/drafts-store";
import { Plus } from "lucide-react";

interface RightPanelCtx {
  content: ReactNode | null;
  setContent: (n: ReactNode | null) => void;
}
const RightPanelContext = createContext<RightPanelCtx>({ content: null, setContent: () => {} });

export function useRightPanel(node: ReactNode | null, deps: unknown[] = []) {
  const ctx = useContext(RightPanelContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ctx.setContent(node);
    return () => ctx.setContent(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const NAV: { label: string; to: string; icon: typeof Home; section?: string }[] = [
  { label: "Home", to: "/", icon: Home, section: "Overview" },
  { label: "Process Hierarchy", to: "/hierarchy", icon: ListTree, section: "BPML" },
  { label: "Processes", to: "/processes", icon: Workflow, section: "BPML" },
  { label: "Capabilities", to: "/capabilities", icon: Boxes, section: "BPML" },
  { label: "Capability Templates", to: "/templates", icon: Layers, section: "BPML" },
  { label: "Template Steps", to: "/steps", icon: Network, section: "BPML" },
  { label: "Business Templates", to: "/business-templates", icon: Package, section: "Rollout" },
  { label: "Project Scope", to: "/projects", icon: Boxes, section: "Rollout" },
  { label: "Coverage Map", to: "/coverage", icon: MapIcon, section: "Rollout" },
  { label: "Administration", to: "/admin", icon: Settings, section: "System" },
];

const ROLE_LABEL: Record<RoleId, string> = {
  "global-admin": "Global Admin",
  "domain-admin": "Domain Admin",
  "project-manager": "Project Manager",
  viewer: "Viewer",
};

export function AppShell({ children }: { children: ReactNode }) {
  const navCollapsed = useUIStore((s) => s.navCollapsed);
  const toggleNav = useUIStore((s) => s.toggleNav);
  const rightPanelOpen = useUIStore((s) => s.rightPanelOpen);
  const setRightPanelOpen = useUIStore((s) => s.setRightPanelOpen);
  const role = useUIStore((s) => s.currentRole);
  const setRole = useUIStore((s) => s.setCurrentRole);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const [rightContent, setRightContent] = useState<ReactNode | null>(null);
  const ctx = useMemo(() => ({ content: rightContent, setContent: setRightContent }), [rightContent]);
  const hydrate = useDraftsStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);

  const path = useRouterState({ select: (r) => r.location.pathname });
  const sections = useMemo(() => {
    const map = new Map<string, typeof NAV>();
    for (const item of NAV) {
      const key = item.section ?? "";
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <RightPanelContext.Provider value={ctx}>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {/* LEFT NAV */}
        <aside
          className={cn(
            "flex shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200",
            navCollapsed ? "w-[56px]" : "w-[232px]",
          )}
        >
          <div className="flex h-12 items-center gap-2 border-b border-border px-3">
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            {!navCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold leading-tight">BPML Governance</div>
                <div className="truncate text-[10.5px] uppercase tracking-wide text-muted-foreground">Platform</div>
              </div>
            )}
          </div>
          <nav className="thin-scrollbar flex-1 overflow-y-auto px-2 py-3">
            {sections.map(([section, items]) => (
              <div key={section} className="mb-3">
                {!navCollapsed && (
                  <div className="px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {section}
                  </div>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        title={navCollapsed ? item.label : undefined}
                        className={cn(
                          "group flex h-8 items-center gap-2 rounded-md px-2 text-[12.5px] font-medium transition-colors",
                          active
                            ? "bg-primary-soft text-primary"
                            : "text-foreground/85 hover:bg-surface-hover",
                        )}
                      >
                        <item.icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                        {!navCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggleNav}
            className="flex h-9 items-center justify-center gap-2 border-t border-border text-[12px] text-muted-foreground hover:bg-surface-hover"
          >
            {navCollapsed ? <ChevronsRight className="size-4" /> : (
              <>
                <ChevronsLeft className="size-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </aside>

        {/* MAIN COLUMN */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar role={role} setRole={setRole} rightPanelOpen={rightPanelOpen} setRightPanelOpen={setRightPanelOpen} theme={theme} toggleTheme={toggleTheme} />
          <div className="flex min-h-0 flex-1">
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
            {rightPanelOpen && rightContent && (
              <aside className="hidden w-[340px] shrink-0 flex-col border-l border-border bg-surface lg:flex">
                <div className="thin-scrollbar flex-1 overflow-y-auto">{rightContent}</div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </RightPanelContext.Provider>
  );
}

function TopBar({
  role,
  setRole,
  rightPanelOpen,
  setRightPanelOpen,
  theme,
  toggleTheme,
}: {
  role: RoleId;
  setRole: (r: RoleId) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (v: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? repo.search(q) : null), [q]);
  const [open, setOpen] = useState(false);
  const stats = repo.stats();
  const perms = ROLE_PERMS[role];

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={`Search ${stats.capabilities} capabilities, ${stats.templates.toLocaleString()} templates…`}
          className="h-8 w-full rounded-md border border-border bg-surface-2 pl-8 pr-3 text-[13px] outline-none transition-colors focus:border-ring focus:bg-surface focus:ring-2 focus:ring-ring/20"
        />
        {open && results && (
          <div className="thin-scrollbar absolute left-0 right-0 top-10 z-50 max-h-[420px] overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-pop">
            <SearchGroup label="Domains" items={results.domains.map((d) => ({ id: d.id, name: d.name, to: `/hierarchy?domain=${d.id}` }))} />
            <SearchGroup label="Areas" items={results.areas.map((a) => ({ id: a.id, name: a.name, to: `/hierarchy?area=${a.id}` }))} />
            <SearchGroup
              label="Processes"
              items={results.processes.map((p) => ({ id: p.id.trim(), name: p.name, to: `/processes/${encodeURIComponent(p.id.trim())}` }))}
            />
            <SearchGroup
              label="Capabilities"
              items={results.capabilities.map((c) => ({ id: c.id.trim(), name: c.name, to: `/capabilities/${encodeURIComponent(c.id.trim())}` }))}
            />
            <SearchGroup
              label="Templates"
              items={results.templates.map((t) => ({ id: String(t.id), name: t.name, to: `/templates/${t.id}` }))}
            />
            {results.domains.length + results.areas.length + results.processes.length + results.capabilities.length + results.templates.length === 0 && (
              <div className="px-3 py-6 text-center text-[12.5px] text-muted-foreground">No matches.</div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {perms.canEdit && (
          <Link
            to="/create"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-3.5" /> Create
          </Link>
        )}
        <span className="hidden items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-1 text-[11.5px] text-muted-foreground md:inline-flex">
          <ShieldCheck className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">{perms.canEdit ? "Write" : "Read"}</span>
        </span>
        <label className="hidden items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[12px] md:inline-flex">
          <span className="text-muted-foreground">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleId)}
            className="bg-transparent text-[12px] font-medium outline-none"
          >
            {(Object.keys(ROLE_LABEL) as RoleId[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          title={rightPanelOpen ? "Hide details" : "Show details"}
          className="hidden h-8 items-center justify-center rounded-md border border-border bg-surface px-2 text-muted-foreground hover:bg-surface-hover lg:inline-flex"
        >
          {rightPanelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
        </button>
        <div className="grid size-8 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
          {ROLE_LABEL[role]
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>
      </div>
    </header>
  );
}

function SearchGroup({ label, items }: { label: string; items: { id: string; name: string; to: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="py-1">
      <div className="px-2 pb-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      {items.map((it) => (
        <Link
          key={it.id}
          to={it.to as any}
          className="flex items-center gap-2 rounded px-2 py-1.5 text-[12.5px] hover:bg-surface-hover"
        >
          <span className="num shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{it.id}</span>
          <span className="truncate">{it.name}</span>
        </Link>
      ))}
    </div>
  );
}
