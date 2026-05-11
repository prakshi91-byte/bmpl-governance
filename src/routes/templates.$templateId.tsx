import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { repo, type TemplateStep } from "@/data/repo";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge } from "@/components/enterprise/Badges";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar } from "@/components/enterprise/FilterBar";
import { useRightPanel } from "@/components/enterprise/AppShell";

export const Route = createFileRoute("/templates/$templateId")({
  loader: ({ params }) => {
    const t = repo.template(Number(params.templateId));
    if (!t) throw notFound();
    return { template: t };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Template ${loaderData?.template.id} ${loaderData?.template.name} — BPML` },
      { name: "description", content: `Capability template ${loaderData?.template.id}: ${loaderData?.template.name}.` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Template not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load template.</div>,
  component: TemplateDetail,
});

const TABS = ["Overview", "Steps", "Capabilities", "Deployments"] as const;

function TemplateDetail() {
  const { template } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Steps");
  const [q, setQ] = useState("");
  const steps = repo.stepsOf(template.id);
  const caps = repo.capabilitiesOfTemplate(template.id);
  const deployments = repo
    .projects()
    .filter((p) => repo.scopeOfProject(p.id).some((r) => r.templateId === template.id));

  const filteredSteps = useMemo(
    () => (q ? steps.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.transaction.toLowerCase().includes(q.toLowerCase())) : steps),
    [steps, q],
  );

  const stepCols: ColumnDef<TemplateStep>[] = useMemo(
    () => [
      { header: "Seq", accessorKey: "seq", size: 70, cell: (i) => <span className="num text-muted-foreground">{i.getValue() as number}</span> },
      { header: "Step Name", accessorKey: "name" },
      { header: "SAP Tx", accessorKey: "transaction", size: 120, cell: (i) => <span className="num rounded bg-muted px-1.5 py-0.5 text-[11.5px] font-medium text-foreground">{i.getValue() as string}</span> },
      { header: "Standardization", accessorKey: "standard", size: 160, cell: (i) => <StandardizationBadge value={i.getValue() as string} /> },
      { header: "Status", accessorKey: "status", size: 90 },
    ],
    [],
  );

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Template</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">#{template.id}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{template.name}</h3>
        <div className="mt-2"><StandardizationBadge value={template.standard} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Steps" value={steps.length} />
        <Stat label="Capabilities" value={caps.length} />
        <Stat label="Deployments" value={deployments.length} />
        <Stat label="Std" value={template.standard.split("/")[0]} />
      </div>
    </div>,
    [template.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={<><span className="num text-primary">#{template.id}</span> <span className="ml-2">{template.name}</span></>}
        breadcrumbs={[{ label: "BPML" }, { label: "Templates", to: "/templates" }, { label: `#${template.id}` }]}
        meta={<><StandardizationBadge value={template.standard} /><span>{steps.length} steps</span><span>{caps.length} capabilities</span><span>{deployments.length} deployments</span></>}
      />
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"relative h-9 px-3 text-[12.5px] font-medium " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            {t}{tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" />}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="grid gap-3 overflow-y-auto p-5 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-surface p-3 shadow-panel">
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Identification</div>
            <Row label="Template ID" value={<span className="num">#{template.id}</span>} />
            <Row label="Name" value={template.name} />
            <Row label="Bekaert Standard" value={<StandardizationBadge value={template.standard} />} />
            <Row label="Step count" value={<span className="num">{steps.length}</span>} />
          </div>
          <div className="rounded-md border border-border bg-surface p-3 shadow-panel">
            <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Usage</div>
            <Row label="Capabilities linked" value={<span className="num">{caps.length}</span>} />
            <Row label="Projects deploying" value={<span className="num">{deployments.length}</span>} />
          </div>
        </div>
      )}
      {tab === "Steps" && (
        <>
          <FilterBar search={q} onSearchChange={setQ} placeholder="Search steps or transactions…" />
          <DataGrid columns={stepCols} data={filteredSteps} rowKey={(r) => `${r.templateId}-${r.seq}`} empty="No steps." />
        </>
      )}
      {tab === "Capabilities" && (
        <div className="overflow-y-auto p-5">
          <ul className="grid gap-1 lg:grid-cols-2">
            {caps.map((p) => (
              <li key={p.id}>
                <Link to="/capabilities/$capabilityId" params={{ capabilityId: p.id.trim() }} className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover">
                  <span className="num text-[11px] text-muted-foreground">{p.id.trim()}</span>
                  <span className="truncate">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === "Deployments" && (
        <div className="overflow-y-auto p-5">
          <ul className="grid gap-1 lg:grid-cols-2">
            {deployments.length === 0 && <li className="text-[13px] text-muted-foreground">Not deployed in any project yet.</li>}
            {deployments.map((p) => (
              <li key={p.id}>
                <Link to="/projects/$projectId" params={{ projectId: p.id }} className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover">
                  <span className="num text-[11px] text-muted-foreground">{p.id}</span>
                  <span className="truncate">{p.name}</span>
                  <span className="ml-auto text-[11.5px] text-muted-foreground">{p.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div className="flex items-start justify-between gap-2 border-b border-border/60 py-1.5 text-[12.5px] last:border-b-0"><span className="text-muted-foreground">{label}</span><span className="text-right">{value}</span></div>);
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div className="rounded-md border border-border bg-surface-2 px-2.5 py-2"><div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div><div className="num mt-0.5 text-[15px] font-semibold">{value}</div></div>);
}
