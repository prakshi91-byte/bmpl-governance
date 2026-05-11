import { createFileRoute, Link } from "@tanstack/react-router";
import { repo, type Capability, type Process, type ProcessDomain } from "@/data/repo";
import { useMemo, useState } from "react";
import { ChevronRight, Folder, FolderOpen, Layers, Search, Workflow, X, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { StandardizationBadge, StatusBadge } from "@/components/enterprise/Badges";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";

interface HierarchySearch {
  domain?: string;
  area?: string;
  process?: string;
  capability?: string;
}

export const Route = createFileRoute("/hierarchy")({
  validateSearch: (s: Record<string, unknown>): HierarchySearch => ({
    domain: typeof s.domain === "string" ? s.domain : undefined,
    area: typeof s.area === "string" ? s.area : undefined,
    process: typeof s.process === "string" ? s.process : undefined,
    capability: typeof s.capability === "string" ? s.capability : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Process Hierarchy — BPML Governance" },
      { name: "description", content: "Explore the SAP BPML taxonomy from domains down to processes, capabilities and templates." },
    ],
  }),
  component: HierarchyPage,
});

function HierarchyPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [treeQuery, setTreeQuery] = useState("");
  const [gridQuery, setGridQuery] = useState("");

  const domains = repo.domains();
  const selectedDomainId = search.domain ?? domains[0]?.id.trim();
  const selectedAreaId = search.area;
  const selectedProcessId = search.process;
  const selectedCapabilityId = search.capability;

  const areas = useMemo(
    () => (selectedDomainId ? repo.areasOf(selectedDomainId) : []),
    [selectedDomainId],
  );

  // Center grid: Capabilities under selected process, OR all caps under selected area, OR domain
  const capabilities = useMemo<Capability[]>(() => {
    if (selectedProcessId) return repo.capabilitiesOf(selectedProcessId);
    if (selectedAreaId) return repo.capabilitiesOfArea(selectedAreaId);
    return areas.flatMap((a) => repo.capabilitiesOfArea(a.id));
  }, [areas, selectedAreaId, selectedProcessId]);

  const filteredCaps = useMemo(() => {
    const q = gridQuery.toLowerCase().trim();
    if (!q) return capabilities;
    return capabilities.filter((c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [capabilities, gridQuery]);

  const selectedCapability = selectedCapabilityId ? repo.capability(selectedCapabilityId) : capabilities[0];
  const selectedProcess = selectedProcessId ? repo.process(selectedProcessId) : undefined;

  useRightPanel(
    selectedCapability ? <CapabilityPanel capability={selectedCapability} />
      : selectedProcess ? <ProcessPanel process={selectedProcess} />
      : <DomainPanel domain={domains.find((d) => d.id.trim() === selectedDomainId)} />,
    [selectedCapability?.id, selectedProcess?.id, selectedDomainId],
  );

  const columns: ColumnDef<Capability>[] = useMemo(
    () => [
      { header: "Capability ID", accessorKey: "id", size: 150,
        cell: (info) => <span className="num font-medium text-primary">{(info.getValue() as string).trim()}</span> },
      { header: "Name", accessorKey: "name", cell: (info) => <span className="truncate">{info.getValue() as string}</span> },
      { header: "Process", accessorFn: (r) => repo.process(r.processId)?.name ?? r.processId, size: 220,
        cell: (info) => <span className="truncate text-muted-foreground">{info.getValue() as string}</span> },
      { header: "Templates", accessorKey: "templateCount", size: 100,
        cell: (info) => <span className="num">{info.getValue() as number}</span> },
      { header: "Status", accessorKey: "status", size: 110,
        cell: (info) => <StatusBadge value={info.getValue() as string} intent="success" /> },
    ],
    [],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Process Hierarchy Explorer"
        subtitle="Domain → Area → Process → Capability → Templates."
        breadcrumbs={[{ label: "BPML", to: "/hierarchy" }, { label: "Process Hierarchy" }]}
      />
      <div className="flex min-h-0 flex-1">
        {/* TREE */}
        <aside className="hidden w-[320px] shrink-0 flex-col border-r border-border bg-surface md:flex">
          <div className="flex h-10 items-center gap-2 border-b border-border px-3">
            <Search className="size-3.5 text-muted-foreground" />
            <input value={treeQuery} onChange={(e) => setTreeQuery(e.target.value)} placeholder="Filter hierarchy…" className="h-7 w-full bg-transparent text-[12.5px] outline-none" />
            {treeQuery && <button onClick={() => setTreeQuery("")} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
          </div>
          <div className="thin-scrollbar flex-1 overflow-y-auto py-2">
            <HierarchyTree
              domains={domains}
              query={treeQuery}
              selectedDomainId={selectedDomainId}
              selectedAreaId={selectedAreaId}
              selectedProcessId={selectedProcessId}
              onSelectDomain={(id) => navigate({ search: { domain: id } as any })}
              onSelectArea={(domainId, areaId) => navigate({ search: { domain: domainId, area: areaId } as any })}
              onSelectProcess={(domainId, areaId, processId) => navigate({ search: { domain: domainId, area: areaId, process: processId } as any })}
            />
          </div>
        </aside>

        {/* CENTER GRID */}
        <section className="flex min-w-0 flex-1 flex-col">
          <FilterBar search={gridQuery} onSearchChange={setGridQuery} placeholder="Search capabilities by ID or name…">
            <span className="hidden text-[12px] text-muted-foreground sm:inline">
              {selectedProcessId ? <>Process <span className="num font-medium text-foreground">{selectedProcessId.trim()}</span></>
                : selectedAreaId ? <>Area <span className="num font-medium text-foreground">{selectedAreaId.trim()}</span></>
                : <>Domain <span className="num font-medium text-foreground">{selectedDomainId}</span></>}
            </span>
            {(selectedProcessId || selectedAreaId) && (
              <button
                onClick={() => navigate({ search: selectedProcessId ? { domain: selectedDomainId, area: selectedAreaId } as any : { domain: selectedDomainId } as any })}
                className="text-[12px] text-primary hover:underline"
              >
                {selectedProcessId ? "Clear process" : "Clear area"}
              </button>
            )}
          </FilterBar>
          <DataGrid
            columns={columns}
            data={filteredCaps}
            rowKey={(r) => r.id}
            isRowActive={(r) => r.id.trim() === selectedCapability?.id?.trim()}
            onRowClick={(r) =>
              navigate({
                search: {
                  domain: selectedDomainId,
                  area: selectedAreaId ?? r.processAreaId,
                  process: selectedProcessId ?? r.processId,
                  capability: r.id.trim(),
                } as any,
              })
            }
            empty="No capabilities under this selection."
          />
        </section>
      </div>
    </div>
  );
}

function HierarchyTree({
  domains, query, selectedDomainId, selectedAreaId, selectedProcessId,
  onSelectDomain, onSelectArea, onSelectProcess,
}: {
  domains: ProcessDomain[]; query: string;
  selectedDomainId?: string; selectedAreaId?: string; selectedProcessId?: string;
  onSelectDomain: (id: string) => void;
  onSelectArea: (domainId: string, areaId: string) => void;
  onSelectProcess: (domainId: string, areaId: string, processId: string) => void;
}) {
  const q = query.toLowerCase().trim();
  return (
    <div className="px-1">
      {domains.map((d) => {
        const areas = repo.areasOf(d.id);
        const isOpen = selectedDomainId === d.id.trim() || q.length > 0;
        if (q && !d.name.toLowerCase().includes(q) && !d.id.toLowerCase().includes(q)
            && !areas.some((a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))) return null;
        const totalCaps = areas.reduce((acc, a) => acc + repo.capabilitiesOfArea(a.id).length, 0);
        return (
          <div key={d.id} className="mb-0.5">
            <button type="button" onClick={() => onSelectDomain(d.id.trim())}
              className={cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12.5px] hover:bg-surface-hover",
                selectedDomainId === d.id.trim() && "bg-primary-soft text-primary")}>
              <ChevronRight className={cn("size-3 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
              {isOpen ? <FolderOpen className="size-3.5 shrink-0 text-primary" /> : <Folder className="size-3.5 shrink-0 text-muted-foreground" />}
              <span className="num text-[11.5px] font-medium text-muted-foreground">{d.id.trim()}</span>
              <span className="truncate">{d.name.replace(/^[A-Z0-9]+ - /, "")}</span>
              <span className="num ml-auto rounded bg-muted px-1 py-0 text-[10px] text-muted-foreground">{totalCaps}</span>
            </button>
            {isOpen && (
              <div className="ml-4 border-l border-border pl-2">
                {areas.map((a) => {
                  const caps = repo.capabilitiesOfArea(a.id).length;
                  const procs = repo.processesOf(a.id);
                  const areaActive = selectedAreaId?.trim() === a.id.trim();
                  const areaOpen = areaActive || q.length > 0;
                  return (
                    <div key={a.id}>
                      <button type="button" onClick={() => onSelectArea(d.id.trim(), a.id.trim())}
                        className={cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12px] text-foreground/85 hover:bg-surface-hover",
                          areaActive && "bg-primary-soft text-primary")}>
                        <ChevronRight className={cn("size-3 shrink-0 text-muted-foreground transition-transform", areaOpen && "rotate-90")} />
                        <Workflow className="size-3 shrink-0 text-muted-foreground" />
                        <span className="num text-[10.5px] text-muted-foreground">{a.id.trim()}</span>
                        <span className="truncate">{a.name.replace(/^[A-Z0-9.]+ - /, "")}</span>
                        <span className="num ml-auto text-[10.5px] text-muted-foreground">{caps}</span>
                      </button>
                      {areaOpen && (
                        <div className="ml-4 border-l border-border pl-2">
                          {procs.map((p) => {
                            const procActive = selectedProcessId?.trim() === p.id.trim();
                            return (
                              <button key={p.id} type="button" onClick={() => onSelectProcess(d.id.trim(), a.id.trim(), p.id.trim())}
                                className={cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12px] text-foreground/80 hover:bg-surface-hover",
                                  procActive && "bg-primary-soft text-primary")}>
                                <Boxes className="size-3 shrink-0 text-muted-foreground" />
                                <span className="num text-[10.5px] text-muted-foreground">{p.id.trim()}</span>
                                <span className="truncate">{p.name.replace(/^[A-Z0-9.]+ - /, "")}</span>
                                <span className="num ml-auto text-[10.5px] text-muted-foreground">{p.capabilityCount}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CapabilityPanel({ capability }: { capability: Capability }) {
  const area = repo.area(capability.processAreaId);
  const domain = repo.domain(capability.processDomainId);
  const proc = repo.process(capability.processId);
  const templates = repo.templatesOf(capability.id);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Capability</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{capability.id.trim()}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{capability.name}</h3>
      </div>
      <Section title="Hierarchy">
        <Meta label="Domain" value={domain?.name ?? "—"} />
        <Meta label="Area" value={area?.name ?? "—"} />
        <Meta label="Process" value={proc?.name ?? "—"} />
        <Meta label="Status" value={<StatusBadge value={capability.status} intent="success" />} />
      </Section>
      <Section title={`Templates (${templates.length})`} action={<Link to="/templates" className="text-[11.5px] text-primary hover:underline">View all</Link>}>
        <div className="space-y-1">
          {templates.slice(0, 8).map((t) => (
            <Link key={t.id} to="/templates/$templateId" params={{ templateId: String(t.id) }}
              className="flex items-center gap-2 rounded border border-border bg-surface-2 px-2 py-1.5 hover:bg-surface-hover">
              <Layers className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="num text-[10.5px] text-muted-foreground">{t.id}</span>
              <span className="truncate text-[12px]">{t.name}</span>
              <StandardizationBadge value={t.standard} className="ml-auto" />
            </Link>
          ))}
          {templates.length === 0 && <div className="text-[12px] text-muted-foreground">No templates linked.</div>}
        </div>
      </Section>
      <Link to="/capabilities/$capabilityId" params={{ capabilityId: capability.id.trim() }}
        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90">
        Open capability workspace
      </Link>
    </div>
  );
}

function ProcessPanel({ process }: { process: Process }) {
  const area = repo.area(process.processAreaId);
  const domain = repo.domain(process.processDomainId);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Process</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{process.id.trim()}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{process.name}</h3>
      </div>
      <Section title="Hierarchy">
        <Meta label="Domain" value={domain?.name ?? "—"} />
        <Meta label="Area" value={area?.name ?? "—"} />
        <Meta label="Owner" value={process.owner} />
      </Section>
      <Section title="Composition">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Capabilities" value={process.capabilityCount} />
          <Stat label="Templates" value={process.templateCount} />
        </div>
      </Section>
      <Link to="/processes/$processId" params={{ processId: process.id.trim() }}
        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90">
        Open process workspace
      </Link>
    </div>
  );
}

function DomainPanel({ domain }: { domain?: ProcessDomain }) {
  if (!domain) return null;
  const areas = repo.areasOf(domain.id);
  const procs = areas.reduce((acc, a) => acc + repo.processesOf(a.id).length, 0);
  const caps = areas.reduce((acc, a) => acc + repo.capabilitiesOfArea(a.id).length, 0);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Domain</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{domain.id.trim()}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{domain.name}</h3>
      </div>
      <Section title="Composition">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Process Areas" value={areas.length} />
          <Stat label="Processes" value={procs} />
          <Stat label="Capabilities" value={caps} />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}
function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-border/60 py-1.5 last:border-b-0">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="text-right text-[12.5px]">{value}</div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface-2 px-2.5 py-2">
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="num mt-0.5 text-[16px] font-semibold">{value}</div>
    </div>
  );
}
