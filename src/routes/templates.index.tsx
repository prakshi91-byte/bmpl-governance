import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { repo, type Template } from "@/data/repo";
import { useMemo, useState } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge } from "@/components/enterprise/Badges";

export const Route = createFileRoute("/templates/")({
  head: () => ({
    meta: [
      { title: "Capability Templates — BPML Governance" },
      { name: "description", content: "Reusable SAP process templates with standardization status and deployment usage." },
    ],
  }),
  component: TemplatesIndex,
});

function TemplatesIndex() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [std, setStd] = useState("__all");
  const standards = useMemo(() => Array.from(new Set(repo.templates().map((t) => t.standard))).sort(), []);
  const data = useMemo(
    () =>
      repo.templates().filter((t) => {
        if (std !== "__all" && t.standard !== std) return false;
        if (q && !t.name.toLowerCase().includes(q.toLowerCase()) && !String(t.id).includes(q)) return false;
        return true;
      }),
    [q, std],
  );
  const columns: ColumnDef<Template>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 90, cell: (i) => <span className="num font-medium text-primary">{i.getValue() as number}</span> },
      { header: "Name", accessorKey: "name" },
      { header: "Steps", accessorKey: "stepCount", size: 80, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Capabilities", accessorFn: (r) => r.processIds.length, size: 110, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Standardization", accessorKey: "standard", size: 170, cell: (i) => <StandardizationBadge value={i.getValue() as string} /> },
    ],
    [],
  );
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Capability Templates" subtitle={`${repo.templates().length.toLocaleString()} reusable process templates.`} breadcrumbs={[{ label: "BPML" }, { label: "Capability Templates" }]} />
      <FilterBar search={q} onSearchChange={setQ} placeholder="Search templates by ID or name…">
        <FilterChip label="Standardization" value={std} options={[{ value: "__all", label: "All" }, ...standards.map((s) => ({ value: s, label: s }))]} onChange={setStd} />
      </FilterBar>
      <DataGrid columns={columns} data={data} rowKey={(r) => r.id} onRowClick={(r) => navigate({ to: "/templates/$templateId", params: { templateId: String(r.id) } })} />
    </div>
  );
}
