import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { repo, type Process } from "@/data/repo";
import { useMemo, useState } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge } from "@/components/enterprise/Badges";
import { useDraftsStore } from "@/stores/drafts-store";
import { useUIStore, ROLE_PERMS } from "@/stores/ui-store";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/processes/")({
  head: () => ({
    meta: [
      { title: "Processes — BPML Governance" },
      { name: "description", content: "Browse the SAP business processes that group capabilities below process areas." },
    ],
  }),
  component: ProcessesIndex,
});

function ProcessesIndex() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("__all");
  const version = useDraftsStore((s) => s.version);
  const isDraft = useDraftsStore((s) => s.isDraft);
  const canEdit = ROLE_PERMS[useUIStore((s) => s.currentRole)].canEdit;

  const data = useMemo(() => {
    return repo.processes().filter((p) => {
      if (domain !== "__all" && p.processDomainId.trim() !== domain) return false;
      if (q && !p.id.toLowerCase().includes(q.toLowerCase()) && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, domain, version]);

  const columns: ColumnDef<Process>[] = useMemo(
    () => [
      {
        header: "Process ID", accessorKey: "id", size: 130,
        cell: (i) => {
          const id = (i.getValue() as string).trim();
          return (
            <span className="num inline-flex items-center gap-1 font-medium text-primary">
              {id}
              {isDraft("process", id) && <span className="rounded bg-primary-soft px-1 text-[9.5px] uppercase">draft</span>}
            </span>
          );
        },
      },
      { header: "Name", accessorKey: "name" },
      { header: "Domain", accessorFn: (r) => repo.domain(r.processDomainId)?.name ?? r.processDomainId, size: 220, cell: (i) => <span className="truncate text-muted-foreground">{i.getValue() as string}</span> },
      { header: "Area", accessorFn: (r) => repo.area(r.processAreaId)?.name ?? r.processAreaId, size: 220, cell: (i) => <span className="truncate text-muted-foreground">{i.getValue() as string}</span> },
      { header: "Owner", accessorKey: "owner", size: 150 },
      { header: "Capabilities", accessorKey: "capabilityCount", size: 110, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Templates", accessorKey: "templateCount", size: 100, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      {
        header: "Status", accessorKey: "status", size: 110,
        cell: (i) => <StatusBadge value={i.getValue() as string} intent={(i.getValue() as string) === "Active" ? "success" : "info"} />,
      },
    ],
    [isDraft],
  );

  const domainOpts = [
    { value: "__all", label: "All", count: repo.processes().length },
    ...repo.domains().map((d) => ({ value: d.id.trim(), label: d.id.trim(), count: repo.processes().filter((p) => p.processDomainId.trim() === d.id.trim()).length })),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Processes"
        subtitle={`${repo.processes().length} business processes — group capabilities below their process area.`}
        breadcrumbs={[{ label: "BPML" }, { label: "Processes" }]}
        actions={canEdit ? (
          <Link to="/create" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90">
            <Plus className="size-3.5" /> New process
          </Link>
        ) : null}
      />
      <FilterBar search={q} onSearchChange={setQ} placeholder="Search processes…">
        <FilterChip label="Domain" value={domain} options={domainOpts} onChange={setDomain} />
      </FilterBar>
      <DataGrid
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/processes/$processId", params: { processId: r.id.trim() } })}
      />
    </div>
  );
}
