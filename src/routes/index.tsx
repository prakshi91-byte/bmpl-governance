import { createFileRoute, Link } from "@tanstack/react-router";
import { repo } from "@/data/repo";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { ArrowRight, Boxes, Layers, ListTree, Map as MapIcon, Network, Package, Workflow } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BPML Governance — Home" },
      { name: "description", content: "Process taxonomy, capability templates, and rollout governance for SAP Solution Manager BPML." },
    ],
  }),
  component: Index,
});

function Index() {
  const stats = repo.stats();
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <PageHeader
        title="BPML Governance Platform"
        subtitle="Single source of truth for SAP Business Process Master List, reusable templates, and deployment coverage."
        meta={
          <>
            <span><span className="num font-medium text-foreground">{stats.domains}</span> Process Domains</span>
            <span><span className="num font-medium text-foreground">{stats.areas}</span> Areas</span>
            <span><span className="num font-medium text-foreground">{stats.processes}</span> Processes</span>
            <span><span className="num font-medium text-foreground">{stats.capabilities.toLocaleString()}</span> Capabilities</span>
            <span><span className="num font-medium text-foreground">{stats.templates.toLocaleString()}</span> Templates</span>
            <span><span className="num font-medium text-foreground">{stats.steps.toLocaleString()}</span> Template Steps</span>
            <span><span className="num font-medium text-foreground">{stats.projects}</span> Projects</span>
            <span><span className="num font-medium text-foreground">{stats.entities}</span> Entities</span>
          </>
        }
      />

      <div className="grid gap-3 p-5 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Workspaces</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <WorkspaceCard
              to="/hierarchy"
              icon={ListTree}
              title="Process Hierarchy Explorer"
              desc="Drill down through Domains → Areas → Processes → Capabilities."
              accent
            />
            <WorkspaceCard to="/processes" icon={Workflow} title="Processes" desc="The 355 SAP business processes grouping capabilities." />
            <WorkspaceCard to="/capabilities" icon={Boxes} title="Capabilities" desc="Capability leaves linked to reusable templates." />
            <WorkspaceCard to="/templates" icon={Layers} title="Capability Templates" desc="Reusable process templates and standardization." />
            <WorkspaceCard to="/steps" icon={Network} title="Template Steps" desc="SAP transactions and execution model." />
            <WorkspaceCard to="/business-templates" icon={Package} title="Business Templates" desc="Rollout packages by level, product group, geo." />
            <WorkspaceCard to="/projects" icon={Boxes} title="Project Scope" desc="Deployment scope and assignments per project." />
            <WorkspaceCard to="/coverage" icon={MapIcon} title="Coverage Map" desc="Heatmap of process areas across business entities." />
          </div>
        </section>

        <section className="lg:col-span-5">
          <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">Process Domains</h2>
          <div className="overflow-hidden rounded-md border border-border bg-surface shadow-panel">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">ID</th>
                  <th className="px-3 py-2 text-left font-semibold">Domain</th>
                  <th className="px-3 py-2 text-right font-semibold">Areas</th>
                  <th className="px-3 py-2 text-right font-semibold">Processes</th>
                  <th className="px-3 py-2 text-right font-semibold">Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {repo.domains().map((d) => {
                  const areas = repo.areasOf(d.id);
                  const procs = areas.reduce((acc, a) => acc + repo.processesOf(a.id).length, 0);
                  const caps = areas.reduce((acc, a) => acc + repo.capabilitiesOfArea(a.id).length, 0);
                  return (
                    <tr key={d.id} className="border-t border-border hover:bg-surface-hover">
                      <td className="num px-3 py-1.5 font-medium text-primary">
                        <Link to={"/hierarchy" as any} search={{ domain: d.id.trim() } as any}>{d.id.trim()}</Link>
                      </td>
                      <td className="px-3 py-1.5 truncate">{d.name}</td>
                      <td className="num px-3 py-1.5 text-right text-muted-foreground">{areas.length}</td>
                      <td className="num px-3 py-1.5 text-right text-muted-foreground">{procs}</td>
                      <td className="num px-3 py-1.5 text-right text-muted-foreground">{caps}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function WorkspaceCard({
  to,
  icon: Icon,
  title,
  desc,
  accent,
}: {
  to: string;
  icon: typeof ListTree;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to as any}
      className={
        "group flex flex-col rounded-md border border-border bg-surface p-3 shadow-panel transition-all hover:border-border-strong hover:shadow-pop " +
        (accent ? "ring-1 ring-primary/20" : "")
      }
    >
      <div className="flex items-center gap-2">
        <div className={"grid size-8 place-items-center rounded-md " + (accent ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary")}>
          <Icon className="size-4" />
        </div>
        <span className="text-[13.5px] font-semibold">{title}</span>
        <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{desc}</p>
    </Link>
  );
}
