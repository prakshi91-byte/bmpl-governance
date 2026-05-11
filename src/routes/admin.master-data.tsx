import { createFileRoute } from "@tanstack/react-router";
import { repo } from "@/data/repo";
import { btLevels, geoScopes, productGroups, itDomainList, itServiceList } from "@/data/bpml.generated";

export const Route = createFileRoute("/admin/master-data")({ component: MasterDataPage });

function MasterDataPage() {
  const groups: { title: string; values: string[] }[] = [
    { title: "Product Groups", values: productGroups },
    { title: "Business Template Levels", values: btLevels },
    { title: "Geographical Scope", values: geoScopes },
    { title: "IT Domains", values: itDomainList },
    { title: "IT Services", values: itServiceList },
    { title: "Process Domains", values: repo.domains().map((d) => d.name) },
    { title: "Business Entities", values: repo.entities().map((e) => e.id) },
  ];
  return (
    <div className="thin-scrollbar flex-1 overflow-y-auto p-5">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} className="rounded-md border border-border bg-surface p-3 shadow-panel">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[12.5px] font-semibold">{g.title}</div>
              <div className="num rounded bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{g.values.length}</div>
            </div>
            <ul className="thin-scrollbar max-h-56 space-y-0.5 overflow-y-auto text-[12.5px]">
              {g.values.map((v) => (<li key={v} className="rounded px-1.5 py-0.5 hover:bg-surface-hover">{v}</li>))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
