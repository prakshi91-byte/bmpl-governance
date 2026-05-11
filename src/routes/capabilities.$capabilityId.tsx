import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { repo, type Template } from "@/data/repo";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge, StatusBadge } from "@/components/enterprise/Badges";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar } from "@/components/enterprise/FilterBar";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/capabilities/$capabilityId")({
  loader: ({ params }) => {
    const cap = repo.capability(params.capabilityId);
    if (!cap) throw notFound();
    return { capability: cap };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.capability.id?.trim()} ${loaderData?.capability.name} — BPML Capability` },
      { name: "description", content: `Capability ${loaderData?.capability.id?.trim()}: ${loaderData?.capability.name}.` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Capability not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load capability.</div>,
  component: CapabilityDetail,
});

const TABS = ["Overview", "Templates", "Relationships", "History"] as const;
type Tab = (typeof TABS)[number];

function CapabilityDetail() {
  const { capability } = Route.useLoaderData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");
  const [tq, setTq] = useState("");
  const area = repo.area(capability.processAreaId);
  const domain = repo.domain(capability.processDomainId);
  const proc = repo.process(capability.processId);
  const templates = repo.templatesOf(capability.id);

  const filteredTemplates = useMemo(
    () => (tq ? templates.filter((t) => t.name.toLowerCase().includes(tq.toLowerCase()) || String(t.id).includes(tq)) : templates),
    [templates, tq],
  );

  const tplColumns: ColumnDef<Template>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 80, cell: (i) => <span className="num font-medium text-primary">{i.getValue() as number}</span> },
      { header: "Name", accessorKey: "name" },
      { header: "Steps", accessorKey: "stepCount", size: 80, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Standardization", accessorKey: "standard", size: 160, cell: (i) => <StandardizationBadge value={i.getValue() as string} /> },
    ],
    [],
  );

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Capability</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{capability.id.trim()}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{capability.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Templates" value={capability.templateCount} />
        <Stat label="Status" value={capability.status} />
      </div>
      {proc && (
        <div className="rounded-md border border-border bg-surface-2 p-2 text-[12px]">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Parent process</div>
          <Link to="/processes/$processId" params={{ processId: proc.id.trim() }} className="mt-0.5 block text-primary hover:underline">
            <span className="num text-[11px]">{proc.id.trim()}</span> · {proc.name}
          </Link>
        </div>
      )}
    </div>,
    [capability.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <span className="num text-primary">{capability.id.trim()}</span>
            <span className="truncate">{capability.name}</span>
          </span>
        }
        breadcrumbs={[
          { label: "BPML", to: "/hierarchy" },
          { label: "Capabilities", to: "/capabilities" },
          { label: capability.id.trim() },
        ]}
        meta={
          <>
            <span>Domain <span className="text-foreground">{domain?.name ?? "—"}</span></span>
            <span>Area <span className="text-foreground">{area?.name ?? "—"}</span></span>
            <span>Process <span className="text-foreground">{proc?.name ?? "—"}</span></span>
            <StatusBadge value={capability.status} intent={capability.status === "Active" ? "success" : "neutral"} />
          </>
        }
      />
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "relative h-9 px-3 text-[12.5px] font-medium transition-colors " +
              (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")
            }
          >
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" />}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid gap-3 overflow-y-auto p-5 lg:grid-cols-3">
          <Card title="Identification">
            <Row label="Capability ID" value={<span className="num">{capability.id.trim()}</span>} />
            <Row label="Name" value={capability.name} />
            <Row label="Status" value={<StatusBadge value={capability.status} intent={capability.status === "Active" ? "success" : "neutral"} />} />
          </Card>
          <Card title="Hierarchy">
            <Row label="Process Domain" value={domain?.name ?? "—"} />
            <Row label="Process Area" value={area?.name ?? "—"} />
            <Row label="Process" value={proc ? <Link to="/processes/$processId" params={{ processId: proc.id.trim() }} className="text-primary hover:underline">{proc.name}</Link> : "—"} />
          </Card>
          <Card title="Governance">
            <Row label="Linked Templates" value={<span className="num">{capability.templateCount}</span>} />
            <Row label="Sibling capabilities" value={<span className="num">{repo.capabilitiesOf(capability.processId).length}</span>} />
          </Card>
        </div>
      )}

      {tab === "Templates" && (
        <>
          <FilterBar search={tq} onSearchChange={setTq} placeholder="Filter templates…" />
          <DataGrid
            columns={tplColumns}
            data={filteredTemplates}
            rowKey={(r) => r.id}
            onRowClick={(r) => navigate({ to: "/templates/$templateId", params: { templateId: String(r.id) } })}
            empty="No templates linked to this capability."
          />
        </>
      )}

      {tab === "Relationships" && (
        <div className="grid gap-3 overflow-y-auto p-5 lg:grid-cols-2">
          <Card title="Sibling capabilities (same process)">
            <ul className="space-y-1 text-[13px]">
              {repo.capabilitiesOf(capability.processId).filter((c) => c.id !== capability.id).slice(0, 12).map((c) => (
                <li key={c.id}>
                  <Link to="/capabilities/$capabilityId" params={{ capabilityId: c.id.trim() }} className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-surface-hover">
                    <span className="num text-[11px] text-muted-foreground">{c.id.trim()}</span>
                    <span className="truncate">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Templates available">
            <ul className="space-y-1 text-[13px]">
              {templates.slice(0, 12).map((t) => (
                <li key={t.id}>
                  <Link to="/templates/$templateId" params={{ templateId: String(t.id) }} className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-surface-hover">
                    <Layers className="size-3.5 text-muted-foreground" />
                    <span className="num text-[11px] text-muted-foreground">{t.id}</span>
                    <span className="truncate">{t.name}</span>
                    <StandardizationBadge value={t.standard} className="ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "History" && (
        <div className="overflow-y-auto p-5">
          <Card title="Recent activity">
            <ul className="space-y-2 text-[13px]">
              {[
                { who: proc?.owner ?? "—", what: "Updated capability metadata", when: "2 days ago" },
                { who: "Anna Janssen", what: "Linked template to capability", when: "1 week ago" },
                { who: "System", what: "Capability imported from BPML extract", when: "3 months ago" },
              ].map((e, i) => (
                <li key={i} className="flex items-start gap-2 border-b border-border/60 pb-2 last:border-b-0">
                  <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <div>{e.what}</div>
                    <div className="text-[11.5px] text-muted-foreground">{e.who} · {e.when}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3 shadow-panel">
      <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-border/60 py-1.5 last:border-b-0 text-[12.5px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
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
