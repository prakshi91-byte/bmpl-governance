import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { repo, type Capability } from "@/data/repo";
import { useMemo, useState } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge } from "@/components/enterprise/Badges";
import { useDraftsStore } from "@/stores/drafts-store";
import { useUIStore, ROLE_PERMS } from "@/stores/ui-store";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/capabilities/")({
  head: () => ({
    meta: [
      { title: "Capabilities — BPML Governance" },
      { name: "description", content: "Browse and govern SAP capability leaves across all process domains." },
    ],
  }),
  component: CapabilitiesIndex,
});

function CapabilitiesIndex() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("__all");
  const [status, setStatus] = useState("__all");
  const version = useDraftsStore((s) => s.version);
  const isDraft = useDraftsStore((s) => s.isDraft);
  const canEdit = ROLE_PERMS[useUIStore((s) => s.currentRole)].canEdit;

  const data = useMemo(() => {
    const all = repo.capabilities();
    return all.filter((c) => {
      if (domain !== "__all" && c.processDomainId.trim() !== domain) return false;
      if (status !== "__all" && c.status !== status) return false;
      if (q && !c.id.toLowerCase().includes(q.toLowerCase()) && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, domain, status, version]);

  const columns: ColumnDef<Capability>[] = useMemo(
    () => [
      {
        header: "Capability ID",
        accessorKey: "id",
        size: 150,
        cell: (i) => {
          const id = (i.getValue() as string).trim();
          return (
            <span className="num inline-flex items-center gap-1 font-medium text-primary">
              {id}
              {isDraft("capability", id) && <span className="rounded bg-primary-soft px-1 text-[9.5px] uppercase">draft</span>}
            </span>
          );
        },
      },
      { header: "Name", accessorKey: "name" },
      {
        header: "Process",
        accessorFn: (r) => repo.process(r.processId)?.name ?? r.processId,
        size: 240,
        cell: (i) => <span className="truncate text-muted-foreground">{i.getValue() as string}</span>,
      },
      {
        header: "Area",
        accessorFn: (r) => repo.area(r.processAreaId)?.name ?? r.processAreaId,
        size: 200,
        cell: (i) => <span className="truncate text-muted-foreground">{i.getValue() as string}</span>,
      },
      { header: "Templates", accessorKey: "templateCount", size: 100, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      {
        header: "Status",
        accessorKey: "status",
        size: 130,
        cell: (i) => {
          const v = i.getValue() as string;
          return <StatusBadge value={v} intent={v === "Active" ? "success" : v === "Draft" ? "info" : "warn"} />;
        },
      },
    ],
    [isDraft],
  );

  const domainOpts = [
    { value: "__all", label: "All", count: repo.capabilities().length },
    ...repo.domains().map((d) => ({ value: d.id.trim(), label: d.id.trim(), count: repo.capabilities().filter((c) => c.processDomainId.trim() === d.id.trim()).length })),
  ];
  const statusOpts = [
    { value: "__all", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Draft", label: "Draft" },
    { value: "Under Review", label: "Under Review" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Capabilities"
        subtitle={`${repo.capabilities().length.toLocaleString()} capability leaves linked to ${repo.processes().length} processes.`}
        breadcrumbs={[{ label: "BPML" }, { label: "Capabilities" }]}
        actions={canEdit ? (
          <Link to="/create" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90">
            <Plus className="size-3.5" /> New capability
          </Link>
        ) : null}
      />
      <FilterBar search={q} onSearchChange={setQ} placeholder="Search capabilities…">
        <FilterChip label="Domain" value={domain} options={domainOpts} onChange={setDomain} />
        <FilterChip label="Status" value={status} options={statusOpts} onChange={setStatus} />
      </FilterBar>
      <DataGrid
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/capabilities/$capabilityId", params: { capabilityId: r.id.trim() } })}
      />
    </div>
  );
}
