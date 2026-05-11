import { createFileRoute } from "@tanstack/react-router";
import { repo } from "@/data/repo";
import { ROLE_PERMS } from "@/stores/ui-store";

export const Route = createFileRoute("/admin/roles")({ component: RolesPage });

function RolesPage() {
  return (
    <div className="thin-scrollbar flex-1 overflow-y-auto p-5">
      <div className="grid gap-3 md:grid-cols-2">
        {repo.roles().map((r) => {
          const perms = ROLE_PERMS[r.id];
          return (
            <div key={r.id} className="rounded-md border border-border bg-surface p-3 shadow-panel">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold">{r.name}</div>
                <div className="num text-[11px] text-muted-foreground">{r.id}</div>
              </div>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{r.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                <Perm label="Can edit" allowed={perms.canEdit} />
                <Perm label="Admin access" allowed={perms.canAdmin} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function Perm({ label, allowed }: { label: string; allowed: boolean }) {
  return <div className="flex items-center justify-between rounded border border-border bg-surface-2 px-2 py-1.5"><span className="text-muted-foreground">{label}</span><span className={allowed ? "text-std-global font-semibold" : "text-muted-foreground"}>{allowed ? "Yes" : "No"}</span></div>;
}
