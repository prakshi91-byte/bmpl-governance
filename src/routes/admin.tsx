import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { useUIStore, ROLE_PERMS } from "@/stores/ui-store";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — BPML Governance" }, { name: "description", content: "Manage users, roles, role assignments, and master data." }] }),
  component: AdminLayout,
});

const TABS = [
  { to: "/admin/users", label: "Users" },
  { to: "/admin/roles", label: "Roles" },
  { to: "/admin/assignments", label: "Role Assignments" },
  { to: "/admin/master-data", label: "Master Data" },
];

function AdminLayout() {
  const role = useUIStore((s) => s.currentRole);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const allowed = ROLE_PERMS[role].canAdmin;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Administration" subtitle="Users, roles, and master data governance." breadcrumbs={[{ label: "System" }, { label: "Administration" }]} />
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3">
        {TABS.map((t) => {
          const active = path.startsWith(t.to);
          return (
            <Link key={t.to} to={t.to} className={"relative h-9 px-3 text-[12.5px] font-medium " + (active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>{t.label}{active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" />}</Link>
          );
        })}
      </div>
      {!allowed ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-sm rounded-md border border-border bg-surface p-6 text-center shadow-panel">
            <Lock className="mx-auto size-6 text-muted-foreground" />
            <h2 className="mt-2 text-[14px] font-semibold">Administration restricted</h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground">You're signed in as <span className="font-medium text-foreground">{role}</span>. Switch to <span className="font-medium text-foreground">Global Admin</span> in the top bar to manage users, roles, and master data.</p>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
