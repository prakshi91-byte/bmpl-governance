import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { repo } from "@/data/repo";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StandardizationBadge, StatusBadge } from "@/components/enterprise/Badges";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { useMemo, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function templateHierarchy(templateId: number) {
  const caps = repo.capabilitiesOfTemplate(templateId);
  const seen = new Set<string>();
  const crumbs: { domain?: string; area?: string; process?: string; key: string }[] = [];
  for (const c of caps) {
    const proc = repo.process(c.processId);
    const area = proc ? repo.area(proc.processAreaId) : undefined;
    const domain = area ? repo.domain(area.processDomainId) : undefined;
    const key = `${domain?.id ?? ""}>${area?.id ?? ""}>${proc?.id ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    crumbs.push({ domain: domain?.name, area: area?.name, process: proc?.name, key });
  }
  return crumbs;
}

function Hierarchy({ templateId }: { templateId: number }) {
  const crumbs = templateHierarchy(templateId);
  if (crumbs.length === 0) return null;
  const first = crumbs[0];
  const extra = crumbs.length - 1;
  return (
    <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
      {first.domain && <span className="truncate">{first.domain}</span>}
      {first.area && <><ChevronRight className="size-2.5 shrink-0" /><span className="truncate">{first.area}</span></>}
      {first.process && <><ChevronRight className="size-2.5 shrink-0" /><span className="truncate">{first.process}</span></>}
      {extra > 0 && <span className="ml-1 rounded bg-muted px-1 num">+{extra}</span>}
    </div>
  );
}

export const Route = createFileRoute("/business-templates/$btId")({
  loader: ({ params }) => {
    const bt = repo.businessTemplate(params.btId);
    if (!bt) throw notFound();
    return { bt };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.bt.id} ${loaderData?.bt.name} — Business Template` },
      { name: "description", content: `Business template ${loaderData?.bt.id} (${loaderData?.bt.level}, ${loaderData?.bt.productGroup}, ${loaderData?.bt.geoScope}).` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Business template not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load.</div>,
  component: BTDetail,
});

function BTDetail() {
  const { bt } = Route.useLoaderData();
  const assigned = repo.templatesOfBT(bt.id);
  const [picker, setPicker] = useState<Set<number>>(new Set(assigned.map((t) => t.id)));
  const [q, setQ] = useState("");
  const all = repo.templates();
  const filtered = useMemo(() => (q ? all.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()) || String(t.id).includes(q)) : all).slice(0, 200), [all, q]);

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Business Template</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{bt.id}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{bt.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <Stat label="Templates" value={picker.size} />
        <Stat label="Level" value={bt.level.split(" ")[0]} />
        <Stat label="Product Grp" value={bt.productGroup} />
        <Stat label="Geo" value={bt.geoScope} />
      </div>
      <div className="rounded-md border border-border bg-surface-2 p-2 text-[12px]">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Readiness</div>
        <div className="mt-1 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded bg-muted"><div className="h-full bg-std-global" style={{ width: `${Math.min(100, picker.size * 4)}%` }} /></div><span className="num">{Math.min(100, picker.size * 4)}%</span></div>
      </div>
    </div>,
    [bt.id, picker.size],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={<><span className="num text-primary">{bt.id}</span> <span className="ml-2">{bt.name}</span></>}
        breadcrumbs={[{ label: "Rollout" }, { label: "Business Templates", to: "/business-templates" }, { label: bt.id }]}
        meta={<><StatusBadge value={bt.level} intent="info" /><span>{bt.productGroup}</span><span>{bt.geoScope}</span><span>{picker.size} templates</span></>}
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-px bg-border">
        <div className="flex min-h-0 flex-col bg-surface">
          <div className="flex h-9 items-center gap-2 border-b border-border bg-surface-2 px-3 text-[12px] font-semibold">All templates</div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter templates…" className="m-2 h-8 rounded-md border border-border bg-surface px-2 text-[13px] outline-none focus:border-ring" />
          <div className="thin-scrollbar flex-1 overflow-y-auto">
            {filtered.map((t) => {
              const sel = picker.has(t.id);
              return (
                <button key={t.id} onClick={() => setPicker((p) => { const n = new Set(p); sel ? n.delete(t.id) : n.add(t.id); return n; })} className={cn("flex w-full items-center gap-2 border-b border-border/60 px-3 py-1.5 text-left text-[12.5px] hover:bg-surface-hover", sel && "bg-primary-soft/60")}>
                  <span className={cn("grid size-4 shrink-0 place-items-center rounded border", sel ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{sel && <Check className="size-3" />}</span>
                  <span className="num text-[11px] text-muted-foreground">{t.id}</span>
                  <span className="truncate">{t.name}</span>
                  <StandardizationBadge value={t.standard} className="ml-auto" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex min-h-0 flex-col bg-surface">
          <div className="flex h-9 items-center gap-2 border-b border-border bg-surface-2 px-3 text-[12px] font-semibold">Assigned ({picker.size})</div>
          <div className="thin-scrollbar flex-1 overflow-y-auto">
            {Array.from(picker).map((id) => {
              const t = repo.template(id);
              if (!t) return null;
              return (
                <Link key={id} to="/templates/$templateId" params={{ templateId: String(id) }} className="flex items-center gap-2 border-b border-border/60 px-3 py-1.5 text-[12.5px] hover:bg-surface-hover">
                  <span className="num text-[11px] text-muted-foreground">{t.id}</span>
                  <span className="truncate">{t.name}</span>
                  <StandardizationBadge value={t.standard} className="ml-auto" />
                </Link>
              );
            })}
            {picker.size === 0 && <div className="p-6 text-center text-[12.5px] text-muted-foreground">No templates assigned.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div className="rounded-md border border-border bg-surface-2 px-2.5 py-2"><div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div><div className="num mt-0.5 text-[14px] font-semibold">{value}</div></div>);
}
