import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { repo, type Template } from "@/data/repo";
import { useMemo, useState } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge } from "@/components/enterprise/Badges";
import { useDraftsStore } from "@/stores/drafts-store";
import { useUIStore, ROLE_PERMS } from "@/stores/ui-store";
import { Plus } from "lucide-react";

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
  const version = useDraftsStore((s) => s.version);
  const isDraft = useDraftsStore((s) => s.isDraft);
  const canEdit = ROLE_PERMS[useUIStore((s) => s.currentRole)].canEdit;
  const standards = useMemo(() => Array.from(new Set(repo.templates().map((t) => t.standard))).sort(), [version]);
  const data = useMemo(
    () =>
      repo.templates().filter((t) => {
        if (std !== "__all" && t.standard !== std) return false;
        if (q && !t.name.toLowerCase().includes(q.toLowerCase()) && !String(t.id).includes(q)) return false;
        return true;
      }),
    [q, std, version],
  );
  const columns: ColumnDef<Template>[] = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        size: 90,
        cell: (i) => {
          const id = i.getValue() as number;
          return (
            <span className="num inline-flex items-center gap-1 font-medium text-primary">
              {id}
              {isDraft("template", id) && <span className="rounded bg-primary-soft px-1 text-[9.5px] uppercase">draft</span>}
            </span>
          );
        },
      },
      { header: "Name", accessorKey: "name" },
      { header: "Steps", accessorKey: "stepCount", size: 80, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Capabilities", accessorFn: (r) => r.capabilityIds.length, size: 110, cell: (i) => <span className="num">{i.getValue() as number}</span> },
      { header: "Standardization", accessorKey: "standard", size: 170, cell: (i) => <StandardizationBadge value={i.getValue() as string} /> },
    ],
    [],
  );
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Capability Templates"
        subtitle={`${repo.templates().length.toLocaleString()} reusable process templates.`}
        breadcrumbs={[{ label: "BPML" }, { label: "Capability Templates" }]}
        actions={canEdit ? (
          <Link to="/create" search={{ tab: "Template" } as any} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90">
            <Plus className="size-3.5" /> New template
          </Link>
        ) : null}
      />
      <FilterBar search={q} onSearchChange={setQ} placeholder="Search templates by ID or name…">
        <FilterChip label="Standardization" value={std} options={[{ value: "__all", label: "All" }, ...standards.map((s) => ({ value: s, label: s }))]} onChange={setStd} />
      </FilterBar>
      <DataGrid columns={columns} data={data} rowKey={(r) => r.id} onRowClick={(r) => navigate({ to: "/templates/$templateId", params: { templateId: String(r.id) } })} />
    </div>
  );
}
