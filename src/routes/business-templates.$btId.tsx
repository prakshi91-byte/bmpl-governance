import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { repo, type Template } from "@/data/repo";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge, StatusBadge } from "@/components/enterprise/Badges";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { useMemo, useState } from "react";
import { Check, ChevronRight, Lock, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type ProcNode = { id: string; name: string; templates: Template[] };
type AreaNode = { id: string; name: string; processes: Map<string, ProcNode> };
type DomainNode = { id: string; name: string; areas: Map<string, AreaNode> };

function buildTree(templates: Template[]) {
  const root = new Map<string, DomainNode>();
  const orphan: Template[] = [];
  for (const t of templates) {
    const caps = repo.capabilitiesOfTemplate(t.id);
    const seen = new Set<string>();
    let placed = false;
    for (const c of caps) {
      const proc = repo.process(c.processId);
      const area = proc ? repo.area(proc.processAreaId) : undefined;
      const domain = area ? repo.domain(area.processDomainId) : undefined;
      if (!domain || !area || !proc) continue;
      const key = `${domain.id}>${area.id}>${proc.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let d = root.get(domain.id);
      if (!d) { d = { id: domain.id, name: domain.name, areas: new Map() }; root.set(domain.id, d); }
      let a = d.areas.get(area.id);
      if (!a) { a = { id: area.id, name: area.name, processes: new Map() }; d.areas.set(area.id, a); }
      let p = a.processes.get(proc.id);
      if (!p) { p = { id: proc.id, name: proc.name, templates: [] }; a.processes.set(proc.id, p); }
      p.templates.push(t);
      placed = true;
    }
    if (!placed) orphan.push(t);
  }
  return { domains: Array.from(root.values()), orphan };
}

function filterTree(tree: ReturnType<typeof buildTree>, q: string) {
  if (!q) return tree;
  const ql = q.toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(ql);
  const domains: DomainNode[] = [];
  for (const d of tree.domains) {
    const dHit = match(d.id) || match(d.name);
    const areas = new Map<string, AreaNode>();
    for (const a of d.areas.values()) {
      const aHit = match(a.id) || match(a.name);
      const procs = new Map<string, ProcNode>();
      for (const p of a.processes.values()) {
        const pHit = match(p.id) || match(p.name);
        const ts = (dHit || aHit || pHit) ? p.templates : p.templates.filter((t) => match(t.name) || match(String(t.id)));
        if (ts.length) procs.set(p.id, { ...p, templates: ts });
      }
      if (procs.size) areas.set(a.id, { ...a, processes: procs });
    }
    if (areas.size) domains.push({ ...d, areas });
  }
  const orphan = tree.orphan.filter((t) => match(t.name) || match(String(t.id)));
  return { domains, orphan };
}

function collectIds(node: DomainNode | AreaNode | ProcNode): number[] {
  if ("templates" in node) return node.templates.map((t) => t.id);
  if ("processes" in node) return Array.from(node.processes.values()).flatMap(collectIds);
  return Array.from(node.areas.values()).flatMap(collectIds);
}

function TriCheck({ state, onClick }: { state: "none" | "some" | "all"; onClick: (e: React.MouseEvent) => void }) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "grid size-4 shrink-0 cursor-pointer place-items-center rounded border",
        state === "all" ? "border-primary bg-primary text-primary-foreground" :
        state === "some" ? "border-primary bg-primary-soft text-primary" :
        "border-border hover:border-primary",
      )}
    >
      {state === "all" && <Check className="size-3" />}
      {state === "some" && <Minus className="size-3" />}
    </span>
  );
}

export const Route = createFileRoute("/business-templates/$btId")({
  loader: ({ params }) => {
    const bt = repo.businessTemplate(params.btId);
    if (!bt) throw notFound();
    return { bt };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.bt.id} ${loaderData?.bt.name} — Business Template` },
      { name: "description", content: `Business template ${loaderData?.bt.id} (${loaderData?.bt.level}, ${loaderData?.bt.productGroup}, ${loaderData?.bt.geoScope}).` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Business template not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load.</div>,
  component: BTDetail,
});

function BTDetail() {
  const { bt } = Route.useLoaderData();
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const assigned = repo.templatesOfBT(bt.id);
  const [picker, setPicker] = useState<Set<number>>(new Set(assigned.map((t) => t.id)));
  const [q, setQ] = useState("");
  const [openD, setOpenD] = useState<Set<string>>(new Set());
  const [openA, setOpenA] = useState<Set<string>>(new Set());
  const [openP, setOpenP] = useState<Set<string>>(new Set());

  const fullTree = useMemo(() => buildTree(repo.templates()), []);
  const tree = useMemo(() => filterTree(fullTree, q), [fullTree, q]);
  const searching = q.length > 0;

  const toggleSet = (s: Set<string>, setS: (n: Set<string>) => void, k: string) => {
    const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); setS(n);
  };
  const setMany = (ids: number[], on: boolean) => {
    if (!isAdmin) return;
    setPicker((p) => {
      const n = new Set(p);
      for (const id of ids) on ? n.add(id) : n.delete(id);
      return n;
    });
  };
  const stateOf = (ids: number[]): "none" | "some" | "all" => {
    let c = 0; for (const id of ids) if (picker.has(id)) c++;
    return c === 0 ? "none" : c === ids.length ? "all" : "some";
  };

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Business Template</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{bt.id}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{bt.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <Stat label="Templates" value={picker.size} />
        <Stat label="Level" value={bt.level.split(" ")[0]} />
        <Stat label="Product Grp" value={bt.productGroup} />
        <Stat label="Geo" value={bt.geoScope} />
      </div>
      <div className="rounded-md border border-border bg-surface-2 p-2 text-[12px]">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Readiness</div>
        <div className="mt-1 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded bg-muted"><div className="h-full bg-std-global" style={{ width: `${Math.min(100, picker.size * 4)}%` }} /></div><span className="num">{Math.min(100, picker.size * 4)}%</span></div>
      </div>
    </div>,
    [bt.id, picker.size],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={<><span className="num text-primary">{bt.id}</span> <span className="ml-2">{bt.name}</span></>}
        breadcrumbs={[{ label: "Rollout" }, { label: "Business Templates", to: "/business-templates" }, { label: bt.id }]}
        meta={<><StatusBadge value={bt.level} intent="info" /><span>{bt.productGroup}</span><span>{bt.geoScope}</span><span>{picker.size} templates</span></>}
      />
      {!isAdmin && (
        <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-[12px] text-muted-foreground">
          <Lock className="size-3.5" /> Read-only — admin role required to create or edit business templates.
        </div>
      )}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-px bg-border">
        <div className="flex min-h-0 flex-col bg-surface">
          <div className="flex h-9 items-center justify-between border-b border-border bg-surface-2 px-3 text-[12px] font-semibold">
            <span>Process hierarchy</span>
            <div className="flex gap-2 text-[11px] font-normal text-muted-foreground">
              <button className="hover:text-foreground" onClick={() => {
                setOpenD(new Set(fullTree.domains.map((d) => d.id)));
                setOpenA(new Set(fullTree.domains.flatMap((d) => Array.from(d.areas.keys()))));
                setOpenP(new Set(fullTree.domains.flatMap((d) => Array.from(d.areas.values()).flatMap((a) => Array.from(a.processes.keys())))));
              }}>Expand all</button>
              <button className="hover:text-foreground" onClick={() => { setOpenD(new Set()); setOpenA(new Set()); setOpenP(new Set()); }}>Collapse</button>
            </div>
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by domain, area, process or template…" className="m-2 h-8 rounded-md border border-border bg-surface px-2 text-[13px] outline-none focus:border-ring" />
          <div className="thin-scrollbar flex-1 overflow-y-auto pb-2">
            {tree.domains.map((d) => {
              const dIds = collectIds(d);
              const dOpen = searching || openD.has(d.id);
              const dState = stateOf(dIds);
              return (
                <div key={d.id}>
                  <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-surface-hover">
                    <button onClick={() => toggleSet(openD, setOpenD, d.id)} className="grid size-4 shrink-0 place-items-center text-muted-foreground">
                      <ChevronRight className={cn("size-3.5 transition-transform", dOpen && "rotate-90")} />
                    </button>
                    <TriCheck state={dState} onClick={(e) => { e.stopPropagation(); setMany(dIds, dState !== "all"); }} />
                    <span className="num text-[10.5px] text-muted-foreground">{d.id}</span>
                    <span className="truncate text-[12.5px] font-semibold">{d.name}</span>
                    <span className="ml-auto num text-[10.5px] text-muted-foreground">{dIds.filter((id) => picker.has(id)).length}/{dIds.length}</span>
                  </div>
                  {dOpen && Array.from(d.areas.values()).map((a) => {
                    const aIds = collectIds(a);
                    const aOpen = searching || openA.has(a.id);
                    const aState = stateOf(aIds);
                    return (
                      <div key={a.id}>
                        <div className="flex items-center gap-1.5 py-0.5 pl-6 pr-2 hover:bg-surface-hover">
                          <button onClick={() => toggleSet(openA, setOpenA, a.id)} className="grid size-4 shrink-0 place-items-center text-muted-foreground">
                            <ChevronRight className={cn("size-3.5 transition-transform", aOpen && "rotate-90")} />
                          </button>
                          <TriCheck state={aState} onClick={(e) => { e.stopPropagation(); setMany(aIds, aState !== "all"); }} />
                          <span className="num text-[10.5px] text-muted-foreground">{a.id}</span>
                          <span className="truncate text-[12px] font-medium">{a.name}</span>
                          <span className="ml-auto num text-[10.5px] text-muted-foreground">{aIds.filter((id) => picker.has(id)).length}/{aIds.length}</span>
                        </div>
                        {aOpen && Array.from(a.processes.values()).map((p) => {
                          const pIds = p.templates.map((t) => t.id);
                          const pOpen = searching || openP.has(p.id);
                          const pState = stateOf(pIds);
                          return (
                            <div key={p.id}>
                              <div className="flex items-center gap-1.5 py-0.5 pl-12 pr-2 hover:bg-surface-hover">
                                <button onClick={() => toggleSet(openP, setOpenP, p.id)} className="grid size-4 shrink-0 place-items-center text-muted-foreground">
                                  <ChevronRight className={cn("size-3.5 transition-transform", pOpen && "rotate-90")} />
                                </button>
                                <TriCheck state={pState} onClick={(e) => { e.stopPropagation(); setMany(pIds, pState !== "all"); }} />
                                <span className="num text-[10.5px] text-muted-foreground">{p.id}</span>
                                <span className="truncate text-[12px]">{p.name}</span>
                                <span className="ml-auto num text-[10.5px] text-muted-foreground">{pIds.filter((id) => picker.has(id)).length}/{pIds.length}</span>
                              </div>
                              {pOpen && p.templates.map((t) => {
                                const sel = picker.has(t.id);
                                return (
                                  <button key={`${p.id}-${t.id}`} onClick={() => setMany([t.id], !sel)} className={cn("flex w-full items-center gap-1.5 py-1 pl-[4.5rem] pr-2 text-left text-[12.5px] hover:bg-surface-hover", sel && "bg-primary-soft/40")}>
                                    <TriCheck state={sel ? "all" : "none"} onClick={(e) => { e.stopPropagation(); setMany([t.id], !sel); }} />
                                    <span className="num text-[10.5px] text-muted-foreground">{t.id}</span>
                                    <span className="truncate">{t.name}</span>
                                    <StandardizationBadge value={t.standard} className="ml-auto" />
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {tree.domains.length === 0 && tree.orphan.length === 0 && (
              <div className="p-6 text-center text-[12.5px] text-muted-foreground">No matches.</div>
            )}
          </div>
        </div>
        <div className="flex min-h-0 flex-col bg-surface">
          <div className="flex h-9 items-center gap-2 border-b border-border bg-surface-2 px-3 text-[12px] font-semibold">Assigned ({picker.size})</div>
          <div className="thin-scrollbar flex-1 overflow-y-auto">
            {Array.from(picker).map((id) => {
              const t = repo.template(id);
              if (!t) return null;
              return (
                <Link key={id} to="/templates/$templateId" params={{ templateId: String(id) }} className="flex items-start gap-2 border-b border-border/60 px-3 py-1.5 text-[12.5px] hover:bg-surface-hover">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="num text-[11px] text-muted-foreground">{t.id}</span>
                      <span className="truncate">{t.name}</span>
                      <StandardizationBadge value={t.standard} className="ml-auto" />
                    </div>
                    <Hierarchy templateId={t.id} />
                  </div>
                </Link>
              );
            })}
            {picker.size === 0 && <div className="p-6 text-center text-[12.5px] text-muted-foreground">No templates assigned.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hierarchy({ templateId }: { templateId: number }) {
  const caps = repo.capabilitiesOfTemplate(templateId);
  const seen = new Set<string>();
  const crumbs: { domain?: string; area?: string; process?: string; key: string }[] = [];
  for (const c of caps) {
    const proc = repo.process(c.processId);
    const area = proc ? repo.area(proc.processAreaId) : undefined;
    const domain = area ? repo.domain(area.processDomainId) : undefined;
    const key = `${domain?.id ?? ""}>${area?.id ?? ""}>${proc?.id ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    crumbs.push({ domain: domain?.name, area: area?.name, process: proc?.name, key });
  }
  if (crumbs.length === 0) return null;
  const first = crumbs[0];
  const extra = crumbs.length - 1;
  return (
    <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
      {first.domain && <span className="truncate">{first.domain}</span>}
      {first.area && <><ChevronRight className="size-2.5 shrink-0" /><span className="truncate">{first.area}</span></>}
      {first.process && <><ChevronRight className="size-2.5 shrink-0" /><span className="truncate">{first.process}</span></>}
      {extra > 0 && <span className="ml-1 rounded bg-muted px-1 num">+{extra}</span>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div className="rounded-md border border-border bg-surface-2 px-2.5 py-2"><div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div><div className="num mt-0.5 text-[14px] font-semibold">{value}</div></div>);
}
