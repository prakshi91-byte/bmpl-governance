import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { repo, type Project } from "@/data/repo";
import { useMemo } from "react";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge } from "@/components/enterprise/Badges";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Project Scope — BPML Governance" }, { name: "description", content: "Rollout projects, scope assignments, and deployment coverage." }] }),
  component: ProjectsIndex,
});

function ProjectsIndex() {
  const navigate = useNavigate();
  const cols: ColumnDef<Project>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 110, cell: (i) => <span className="num font-medium text-primary">{i.getValue() as string}</span> },
      { header: "Code", accessorKey: "code", size: 90 },
      { header: "Name", accessorKey: "name" },
      { header: "Manager", accessorKey: "manager", size: 150 },
      { header: "Start", accessorKey: "startDate", size: 100, cell: (i) => <span className="num text-muted-foreground">{i.getValue() as string}</span> },
      { header: "End", accessorKey: "endDate", size: 100, cell: (i) => <span className="num text-muted-foreground">{i.getValue() as string}</span> },
      { header: "Status", accessorKey: "status", size: 110, cell: (i) => {
        const v = i.getValue() as string;
        const intent = v === "Closed" ? "neutral" : v === "At Risk" ? "danger" : v === "Planning" ? "info" : "success";
        return <StatusBadge value={v} intent={intent as any} />;
      } },
      { header: "Templates", accessorFn: (r) => repo.scopeOfProject(r.id).filter((s) => s.templateId).length, size: 100, cell: (i) => <span className="num">{i.getValue() as number}</span> },
    ],
    [],
  );
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Project Scope" subtitle="Rollout projects with template and business-template assignments." breadcrumbs={[{ label: "Rollout" }, { label: "Project Scope" }]} />
      <DataGrid columns={cols} data={repo.projects()} rowKey={(r) => r.id} onRowClick={(r) => navigate({ to: "/projects/$projectId", params: { projectId: r.id } })} />
    </div>
  );
}
