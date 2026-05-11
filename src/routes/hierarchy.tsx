import { createFileRoute, Link } from "@tanstack/react-router";
import { repo, type ProcessArea, type ProcessCapability, type ProcessDomain } from "@/data/repo";
import { useMemo, useState } from "react";
import { ChevronRight, Folder, FolderOpen, Layers, Search, Workflow, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { StandardizationBadge, StatusBadge } from "@/components/enterprise/Badges";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";

interface HierarchySearch {
  domain?: string;
  area?: string;
  capability?: string;
}

export const Route = createFileRoute("/hierarchy")({
  validateSearch: (s: Record<string, unknown>): HierarchySearch => ({
    domain: typeof s.domain === "string" ? s.domain : undefined,
    area: typeof s.area === "string" ? s.area : undefined,
    capability: typeof s.capability === "string" ? s.capability : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Process Hierarchy — BPML Governance" },
      { name: "description", content: "Explore the SAP BPML process taxonomy from domains down to capabilities and templates." },
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
  const selectedCapabilityId = search.capability;

  const areas = useMemo(
    () => (selectedDomainId ? repo.areasOf(selectedDomainId) : []),
    [selectedDomainId],
  );
  const capabilities = useMemo<ProcessCapability[]>(() => {
    if (selectedAreaId) return repo.processesOf(selectedAreaId);
    return areas.flatMap((a) => repo.processesOf(a.id));
  }, [areas, selectedAreaId]);

  const filteredCaps = useMemo(() => {
    const q = gridQuery.toLowerCase().trim();
    if (!q) return capabilities;
    return capabilities.filter(
      (c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q),
    );
  }, [capabilities, gridQuery]);

  const selectedCapability = selectedCapabilityId ? repo.process(selectedCapabilityId) : capabilities[0];

  // Right panel
  useRightPanel(
    selectedCapability ? <CapabilityPanel capability={selectedCapability} /> : <DomainPanel domain={domains.find((d) => d.id.trim() === selectedDomainId)} />,
    [selectedCapability?.id, selectedDomainId],
  );

  const columns: ColumnDef<ProcessCapability>[] = useMemo(
    () => [
      {
        header: "Capability ID",
        accessorKey: "id",
        size: 120,
        cell: (info) => <span className="num font-medium text-primary">{(info.getValue() as string).trim()}</span>,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => <span className="truncate">{info.getValue() as string}</span>,
      },
      {
        header: "Process Area",
        accessorFn: (r) => repo.area(r.processAreaId)?.name ?? r.processAreaId,
        size: 220,
        cell: (info) => <span className="truncate text-muted-foreground">{info.getValue() as string}</span>,
      },
      {
        header: "Owner",
        accessorKey: "owner",
        size: 150,
        cell: (info) => <span className="truncate">{info.getValue() as string}</span>,
      },
      {
        header: "Templates",
        accessorKey: "templateCount",
        size: 100,
        cell: (info) => <span className="num text-right tabular-nums">{info.getValue() as number}</span>,
      },
      {
        header: "Deployments",
        accessorKey: "deployments",
        size: 110,
        cell: (info) => <span className="num">{info.getValue() as number}</span>,
      },
      {
        header: "Status",
        accessorKey: "status",
        size: 110,
        cell: (info) => {
          const v = info.getValue() as string;
          const intent = v === "Active" ? "success" : v === "Draft" ? "info" : "warn";
          return <StatusBadge value={v} intent={intent} />;
        },
      },
    ],
    [],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Process Hierarchy Explorer"
        subtitle="Drill from process domains into areas, capabilities, and templates."
        breadcrumbs={[{ label: "BPML", to: "/hierarchy" }, { label: "Process Hierarchy" }]}
      />
      <div className="flex min-h-0 flex-1">
        {/* TREE */}
        <aside className="hidden w-[300px] shrink-0 flex-col border-r border-border bg-surface md:flex">
          <div className="flex h-10 items-center gap-2 border-b border-border px-3">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={treeQuery}
              onChange={(e) => setTreeQuery(e.target.value)}
              placeholder="Filter hierarchy…"
              className="h-7 w-full bg-transparent text-[12.5px] outline-none"
            />
            {treeQuery && (
              <button onClick={() => setTreeQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="thin-scrollbar flex-1 overflow-y-auto py-2">
            <HierarchyTree
              domains={domains}
              query={treeQuery}
              selectedDomainId={selectedDomainId}
              selectedAreaId={selectedAreaId}
              onSelectDomain={(id) => navigate({ search: { domain: id } as any })}
              onSelectArea={(domainId, areaId) => navigate({ search: { domain: domainId, area: areaId } as any })}
            />
          </div>
        </aside>

        {/* CENTER GRID */}
        <section className="flex min-w-0 flex-1 flex-col">
          <FilterBar
            search={gridQuery}
            onSearchChange={setGridQuery}
            placeholder="Search capabilities by ID, name, or owner…"
          >
            <span className="hidden text-[12px] text-muted-foreground sm:inline">
              {selectedAreaId ? (
                <>
                  Area <span className="num font-medium text-foreground">{selectedAreaId.trim()}</span>
                </>
              ) : (
                <>
                  Domain <span className="num font-medium text-foreground">{selectedDomainId}</span>
                </>
              )}
            </span>
            {selectedAreaId && (
              <button
                onClick={() => navigate({ search: { domain: selectedDomainId } as any })}
                className="text-[12px] text-primary hover:underline"
              >
                Clear area
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
                  area: selectedAreaId,
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
  domains,
  query,
  selectedDomainId,
  selectedAreaId,
  onSelectDomain,
  onSelectArea,
}: {
  domains: ProcessDomain[];
  query: string;
  selectedDomainId?: string;
  selectedAreaId?: string;
  onSelectDomain: (id: string) => void;
  onSelectArea: (domainId: string, areaId: string) => void;
}) {
  const q = query.toLowerCase().trim();
  return (
    <div className="px-1">
      {domains.map((d) => {
        const areas = repo.areasOf(d.id);
        const isOpen = selectedDomainId === d.id.trim() || q.length > 0;
        const matchedAreas = q
          ? areas.filter((a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || d.name.toLowerCase().includes(q))
          : areas;
        if (q && matchedAreas.length === 0 && !d.name.toLowerCase().includes(q) && !d.id.toLowerCase().includes(q)) return null;
        const totalCaps = areas.reduce((acc, a) => acc + repo.processesOf(a.id).length, 0);
        return (
          <div key={d.id} className="mb-0.5">
            <button
              type="button"
              onClick={() => onSelectDomain(d.id.trim())}
              className={cn(
                "flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12.5px] hover:bg-surface-hover",
                selectedDomainId === d.id.trim() && "bg-primary-soft text-primary",
              )}
            >
              <ChevronRight
                className={cn("size-3 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")}
              />
              {isOpen ? <FolderOpen className="size-3.5 shrink-0 text-primary" /> : <Folder className="size-3.5 shrink-0 text-muted-foreground" />}
              <span className="num text-[11.5px] font-medium text-muted-foreground">{d.id.trim()}</span>
              <span className="truncate">{d.name.replace(/^[A-Z0-9]+ - /, "")}</span>
              <span className="num ml-auto rounded bg-muted px-1 py-0 text-[10px] text-muted-foreground">{totalCaps}</span>
            </button>
            {isOpen && (
              <div className="ml-4 border-l border-border pl-2">
                {matchedAreas.map((a) => {
                  const caps = repo.processesOf(a.id).length;
                  const active = selectedAreaId?.trim() === a.id.trim();
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onSelectArea(d.id.trim(), a.id.trim())}
                      className={cn(
                        "flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12px] text-foreground/85 hover:bg-surface-hover",
                        active && "bg-primary-soft text-primary",
                      )}
                    >
                      <Workflow className="size-3 shrink-0 text-muted-foreground" />
                      <span className="num text-[10.5px] text-muted-foreground">{a.id.trim()}</span>
                      <span className="truncate">{a.name.replace(/^[A-Z0-9.]+ - /, "")}</span>
                      <span className="num ml-auto text-[10.5px] text-muted-foreground">{caps}</span>
                    </button>
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

function CapabilityPanel({ capability }: { capability: ProcessCapability }) {
  const area = repo.area(capability.processAreaId);
  const domain = repo.domain(capability.processDomainId);
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
        <Meta label="IT Domain" value={domain?.itDomain || "—"} />
        <Meta label="IT Service" value={domain?.itService || "—"} />
        <Meta label="Owner" value={capability.owner} />
        <Meta label="Status" value={<StatusBadge value={capability.status} intent={capability.status === "Active" ? "success" : "info"} />} />
      </Section>
      <Section
        title={`Templates (${templates.length})`}
        action={
          <Link to="/templates" className="text-[11.5px] text-primary hover:underline">
            View all
          </Link>
        }
      >
        <div className="space-y-1">
          {templates.slice(0, 8).map((t) => (
            <Link
              key={t.id}
              to="/templates/$templateId"
              params={{ templateId: String(t.id) }}
              className="flex items-center gap-2 rounded border border-border bg-surface-2 px-2 py-1.5 hover:bg-surface-hover"
            >
              <Layers className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="num text-[10.5px] text-muted-foreground">{t.id}</span>
              <span className="truncate text-[12px]">{t.name}</span>
              <StandardizationBadge value={t.standard} className="ml-auto" />
            </Link>
          ))}
          {templates.length === 0 && <div className="text-[12px] text-muted-foreground">No templates linked.</div>}
        </div>
      </Section>
      <Section title="Deployment">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Deployments" value={capability.deployments} />
          <Stat label="Templates" value={capability.templateCount} />
        </div>
      </Section>
      <Link
        to="/capabilities/$capabilityId"
        params={{ capabilityId: capability.id.trim() }}
        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90"
      >
        Open capability workspace
      </Link>
    </div>
  );
}

function DomainPanel({ domain }: { domain?: ProcessDomain }) {
  if (!domain) return null;
  const areas = repo.areasOf(domain.id);
  const caps = areas.reduce((acc, a) => acc + repo.processesOf(a.id).length, 0);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Domain</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{domain.id.trim()}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{domain.name}</h3>
      </div>
      <Section title="Metadata">
        <Meta label="IT Domain" value={domain.itDomain || "—"} />
        <Meta label="IT Service" value={domain.itService || "—"} />
      </Section>
      <Section title="Composition">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Process Areas" value={areas.length} />
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
