import { createFileRoute, Link } from "@tanstack/react-router";
import { repo, type TemplateStep } from "@/data/repo";
import { useMemo, useState } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge } from "@/components/enterprise/Badges";

export const Route = createFileRoute("/steps")({
  head: () => ({ meta: [{ title: "Template Steps — BPML Governance" }, { name: "description", content: "All template execution steps and SAP transactions across the BPML." }] }),
  component: StepsPage,
});

function StepsPage() {
  const [q, setQ] = useState("");
  const [std, setStd] = useState("__all");
  const standards = useMemo(() => Array.from(new Set(repo.steps().map((s) => s.standard))).sort(), []);
  const data = useMemo(
    () =>
      repo.steps().filter((s) => {
        if (std !== "__all" && s.standard !== std) return false;
        if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.transaction.toLowerCase().includes(q.toLowerCase()) && !String(s.templateId).includes(q)) return false;
        return true;
      }),
    [q, std],
  );
  const cols: ColumnDef<TemplateStep>[] = useMemo(
    () => [
      { header: "Template", accessorKey: "templateId", size: 100, cell: (i) => (
        <Link to="/templates/$templateId" params={{ templateId: String(i.getValue()) }} className="num font-medium text-primary hover:underline">#{i.getValue() as number}</Link>
      ) },
      { header: "Seq", accessorKey: "seq", size: 60, cell: (i) => <span className="num text-muted-foreground">{i.getValue() as number}</span> },
      { header: "Step Name", accessorKey: "name" },
      { header: "SAP Tx", accessorKey: "transaction", size: 110, cell: (i) => <span className="num rounded bg-muted px-1.5 py-0.5 text-[11.5px] font-medium">{i.getValue() as string}</span> },
      { header: "Standardization", accessorKey: "standard", size: 160, cell: (i) => <StandardizationBadge value={i.getValue() as string} /> },
      { header: "Status", accessorKey: "status", size: 90 },
    ],
    [],
  );
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Template Steps" subtitle={`${repo.steps().length.toLocaleString()} execution steps across all templates.`} breadcrumbs={[{ label: "BPML" }, { label: "Template Steps" }]} />
      <FilterBar search={q} onSearchChange={setQ} placeholder="Search by step, transaction, or template ID…">
        <FilterChip label="Standardization" value={std} options={[{ value: "__all", label: "All" }, ...standards.map((s) => ({ value: s, label: s }))]} onChange={setStd} />
      </FilterBar>
      <DataGrid columns={cols} data={data} rowKey={(r) => `${r.templateId}-${r.seq}`} pageSize={100} />
    </div>
  );
}
