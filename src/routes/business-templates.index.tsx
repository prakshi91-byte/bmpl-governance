import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { repo, type BusinessTemplate } from "@/data/repo";
import { useMemo, useState } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge } from "@/components/enterprise/Badges";

export const Route = createFileRoute("/business-templates/")({
  head: () => ({ meta: [{ title: "Business Templates — BPML Governance" }, { name: "description", content: "Rollout packages by template level, product group, and geographical scope." }] }),
  component: BTIndex,
});

function BTIndex() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("__all");
  const levels = useMemo(() => Array.from(new Set(repo.businessTemplates().map((b) => b.level))), []);
  const data = useMemo(
    () =>
      repo.businessTemplates().filter((b) => {
        if (level !== "__all" && b.level !== level) return false;
        if (q && !b.name.toLowerCase().includes(q.toLowerCase()) && !b.id.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, level],
  );
  const cols: ColumnDef<BusinessTemplate>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 110, cell: (i) => <span className="num font-medium text-primary">{i.getValue() as string}</span> },
      { header: "Name", accessorKey: "name" },
      { header: "Level", accessorKey: "level", size: 80, cell: (i) => <StatusBadge value={i.getValue() as string} intent="info" /> },
      { header: "Product Group", accessorKey: "productGroup", size: 130 },
      { header: "Geo Scope", accessorKey: "geoScope", size: 110 },
      { header: "Templates", accessorFn: (r) => repo.templatesOfBT(r.id).length, size: 100, cell: (i) => <span className="num">{i.getValue() as number}</span> },
    ],
    [],
  );
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Business Templates" subtitle="Rollout packages bundling capability templates for deployment." breadcrumbs={[{ label: "Rollout" }, { label: "Business Templates" }]} />
      <FilterBar search={q} onSearchChange={setQ} placeholder="Search business templates…">
        <FilterChip label="Level" value={level} options={[{ value: "__all", label: "All" }, ...levels.map((l) => ({ value: l, label: l.split(" ")[0] }))]} onChange={setLevel} />
      </FilterBar>
      <DataGrid columns={cols} data={data} rowKey={(r) => r.id} onRowClick={(r) => navigate({ to: "/business-templates/$btId", params: { btId: r.id } })} />
    </div>
  );
}
