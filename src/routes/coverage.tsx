import { createFileRoute } from "@tanstack/react-router";
import { repo, type CoverageState } from "@/data/repo";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { useMemo, useState } from "react";
import { FilterBar, FilterChip } from "@/components/enterprise/FilterBar";

export const Route = createFileRoute("/coverage")({
  head: () => ({ meta: [{ title: "Coverage Map — BPML Governance" }, { name: "description", content: "Rollout coverage heatmap across process areas and business entities." }] }),
  component: CoveragePage,
});

const STATE_COLOR: Record<CoverageState, string> = {
  covered: "bg-cov-covered",
  partial: "bg-cov-partial",
  not_covered: "bg-cov-not",
  na: "bg-cov-na",
};
const STATE_LABEL: Record<CoverageState, string> = {
  covered: "Covered",
  partial: "Partial",
  not_covered: "Not covered",
  na: "N/A",
};

function CoveragePage() {
  const entities = repo.entities();
  const areas = repo.areas();
  const [domain, setDomain] = useState("__all");
  const filteredAreas = useMemo(() => (domain === "__all" ? areas : areas.filter((a) => a.processDomainId.trim() === domain)), [areas, domain]);

  const cellMap = useMemo(() => {
    const m = new Map<string, CoverageState>();
    for (const a of filteredAreas) for (const c of repo.coverageOfArea(a.id)) m.set(`${a.id.trim()}|${c.entityId}`, c.state);
    return m;
  }, [filteredAreas]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Coverage Map" subtitle="Process areas × business entities — rollout heatmap." breadcrumbs={[{ label: "Rollout" }, { label: "Coverage Map" }]} />
      <FilterBar
        right={
          <div className="flex items-center gap-3 text-[11.5px] text-muted-foreground">
            {(Object.keys(STATE_COLOR) as CoverageState[]).map((s) => (
              <span key={s} className="flex items-center gap-1.5"><span className={`size-3 rounded ${STATE_COLOR[s]}`} />{STATE_LABEL[s]}</span>
            ))}
          </div>
        }
      >
        <FilterChip label="Domain" value={domain} options={[{ value: "__all", label: "All" }, ...repo.domains().map((d) => ({ value: d.id.trim(), label: d.id.trim() }))]} onChange={setDomain} />
      </FilterBar>
      <div className="thin-scrollbar relative flex-1 overflow-auto bg-surface">
        <table className="border-separate border-spacing-0 text-[11.5px]">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 h-9 min-w-[280px] border-b border-r border-border bg-surface-2 px-3 text-left font-semibold text-muted-foreground">Process Area</th>
              {entities.map((e) => (
                <th key={e.id} className="sticky top-0 z-20 h-9 w-7 border-b border-border bg-surface-2 text-center font-semibold text-muted-foreground" title={e.name}>
                  <div className="num rotate-[-50deg] origin-center text-[10.5px]">{e.id}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAreas.map((a) => (
              <tr key={a.id} className="hover:bg-surface-hover">
                <td className="sticky left-0 z-10 border-b border-r border-border bg-surface px-3 py-1 text-foreground">
                  <div className="flex items-center gap-2"><span className="num text-[10.5px] text-muted-foreground">{a.id.trim()}</span><span className="truncate">{a.name.replace(/^[A-Z0-9.]+ - /, "")}</span></div>
                </td>
                {entities.map((e) => {
                  const s = cellMap.get(`${a.id.trim()}|${e.id}`) ?? "na";
                  return (
                    <td key={e.id} className="border-b border-border/60 p-0.5 text-center">
                      <div className={`mx-auto size-4 rounded ${STATE_COLOR[s]} ring-1 ring-inset ring-border/60`} title={`${a.name} × ${e.id}: ${STATE_LABEL[s]}`} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
