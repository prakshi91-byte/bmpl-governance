import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { repo } from "@/data/repo";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge, StandardizationBadge } from "@/components/enterprise/Badges";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { useState } from "react";

export const Route = createFileRoute("/projects/$projectId")({
  loader: ({ params }) => {
    const p = repo.project(params.projectId);
    if (!p) throw notFound();
    return { project: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.code} — ${loaderData?.project.name}` },
      { name: "description", content: `Rollout scope for project ${loaderData?.project.code}: ${loaderData?.project.name}.` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Project not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load.</div>,
  component: ProjectDetail,
});

const TABS = ["Business Templates", "Direct Templates", "Coverage"] as const;

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Business Templates");
  const scope = repo.scopeOfProject(project.id);
  const bts = scope.filter((s) => s.businessTemplateId).map((s) => repo.businessTemplate(s.businessTemplateId!)!).filter(Boolean);
  const tpls = scope.filter((s) => s.templateId).map((s) => repo.template(s.templateId!)!).filter(Boolean);
  const intent = project.status === "Closed" ? "neutral" : project.status === "At Risk" ? "danger" : project.status === "Planning" ? "info" : "success";

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Project</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{project.id}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{project.name}</h3>
        <div className="mt-2"><StatusBadge value={project.status} intent={intent as any} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <Stat label="Business Tpls" value={bts.length} />
        <Stat label="Direct Tpls" value={tpls.length} />
        <Stat label="Manager" value={project.manager} />
        <Stat label="Code" value={project.code} />
      </div>
    </div>,
    [project.id],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={<><span className="num text-primary">{project.code}</span> <span className="ml-2">{project.name}</span></>}
        breadcrumbs={[{ label: "Rollout" }, { label: "Projects", to: "/projects" }, { label: project.code }]}
        meta={<><StatusBadge value={project.status} intent={intent as any} /><span>Manager <span className="text-foreground">{project.manager}</span></span><span className="num">{project.startDate} → {project.endDate}</span></>}
      />
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"relative h-9 px-3 text-[12.5px] font-medium " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>{t}{tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" />}</button>
        ))}
      </div>
      <div className="thin-scrollbar flex-1 overflow-y-auto p-5">
        {tab === "Business Templates" && (
          <ul className="grid gap-1 lg:grid-cols-2">
            {bts.map((bt) => (
              <li key={bt.id}>
                <Link to="/business-templates/$btId" params={{ btId: bt.id }} className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover">
                  <span className="num text-[11px] text-muted-foreground">{bt.id}</span>
                  <span className="truncate">{bt.name}</span>
                  <span className="ml-auto text-[11.5px] text-muted-foreground">{bt.geoScope}</span>
                </Link>
              </li>
            ))}
            {bts.length === 0 && <li className="text-[13px] text-muted-foreground">No business templates assigned.</li>}
          </ul>
        )}
        {tab === "Direct Templates" && (
          <ul className="grid gap-1 lg:grid-cols-2">
            {tpls.map((t) => (
              <li key={t.id}>
                <Link to="/templates/$templateId" params={{ templateId: String(t.id) }} className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover">
                  <span className="num text-[11px] text-muted-foreground">{t.id}</span>
                  <span className="truncate">{t.name}</span>
                  <StandardizationBadge value={t.standard} className="ml-auto" />
                </Link>
              </li>
            ))}
            {tpls.length === 0 && <li className="text-[13px] text-muted-foreground">No direct templates assigned.</li>}
          </ul>
        )}
        {tab === "Coverage" && (
          <div className="rounded-md border border-border bg-surface p-4 text-[13px] text-muted-foreground">
            Project covers {bts.length + tpls.length} scope items across {repo.entities().length} business entities. See the
            <Link to="/coverage" className="ml-1 text-primary hover:underline">Coverage Map</Link> for a global view.
          </div>
        )}
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div className="rounded-md border border-border bg-surface-2 px-2.5 py-2"><div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div><div className="num mt-0.5 text-[14px] font-semibold truncate">{value}</div></div>);
}
