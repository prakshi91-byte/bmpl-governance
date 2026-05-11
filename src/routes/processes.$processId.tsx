import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { repo, type Capability } from "@/data/repo";
import { useMemo } from "react";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge } from "@/components/enterprise/Badges";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { useRightPanel } from "@/components/enterprise/AppShell";

export const Route = createFileRoute("/processes/$processId")({
  loader: ({ params }) => {
    const p = repo.process(params.processId);
    if (!p) throw notFound();
    return { process: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.process.id?.trim()} ${loaderData?.process.name} — BPML Process` },
      { name: "description", content: `Process ${loaderData?.process.id?.trim()}: ${loaderData?.process.name}.` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Process not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load process.</div>,
  component: ProcessDetail,
});

function ProcessDetail() {
  const { process } = Route.useLoaderData();
  const navigate = useNavigate();
  const area = repo.area(process.processAreaId);
  const domain = repo.domain(process.processDomainId);
  const caps = repo.capabilitiesOf(process.id);

  const cols: ColumnDef<Capability>[] = useMemo(
    () => [
      { header: "Capability ID", accessorKey: "id", size: 150, cell: (i) => <span className="num font-medium text-primary">{(i.getValue() as string).trim()}</span> },
      { header: "Name", accessorKey: "name" },
      { header: "Templates", accessorKey: "templateCount", size: 100, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Status", accessorKey: "status", size: 130, cell: (i) => <StatusBadge value={i.getValue() as string} intent="success" /> },
    ],
    [],
  );

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Process</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{process.id.trim()}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{process.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Capabilities" value={process.capabilityCount} />
        <Stat label="Templates" value={process.templateCount} />
      </div>
      <div className="rounded-md border border-border bg-surface-2 p-2 text-[12px]">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Owner</div>
        <div className="mt-0.5">{process.owner}</div>
      </div>
    </div>,
    [process.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={<span className="flex items-center gap-2"><span className="num text-primary">{process.id.trim()}</span><span className="truncate">{process.name}</span></span>}
        breadcrumbs={[
          { label: "BPML", to: "/hierarchy" },
          { label: "Processes", to: "/processes" },
          { label: process.id.trim() },
        ]}
        meta={
          <>
            <span>Domain <span className="text-foreground">{domain?.name ?? "—"}</span></span>
            <span>Area <Link to="/hierarchy" search={{ domain: process.processDomainId, area: process.processAreaId } as any} className="text-foreground hover:underline">{area?.name ?? "—"}</Link></span>
            <span>Owner <span className="text-foreground">{process.owner}</span></span>
            <StatusBadge value={process.status} intent="success" />
          </>
        }
      />
      <DataGrid
        columns={cols}
        data={caps}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/capabilities/$capabilityId", params: { capabilityId: r.id.trim() } })}
        empty="No capabilities under this process."
      />
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
