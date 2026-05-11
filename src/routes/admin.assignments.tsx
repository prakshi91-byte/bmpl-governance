import { createFileRoute } from "@tanstack/react-router";
import { repo, type RoleId } from "@/data/repo";

export const Route = createFileRoute("/admin/assignments")({ component: AssignmentsPage });

function AssignmentsPage() {
  const users = repo.users();
  const roles = repo.roles();
  return (
    <div className="thin-scrollbar flex-1 overflow-auto">
      <table className="w-full border-separate border-spacing-0 text-[13px]">
        <thead className="sticky top-0 bg-surface-2">
          <tr>
            <th className="h-9 border-b border-border px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">User</th>
            {roles.map((r) => (
              <th key={r.id} className="h-9 border-b border-border px-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{r.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-surface-hover">
              <td className="border-b border-border/60 px-3 py-1.5"><div className="font-medium">{u.name}</div><div className="text-[11px] text-muted-foreground">{u.email}</div></td>
              {roles.map((r) => (
                <td key={r.id} className="border-b border-border/60 px-3 py-1.5 text-center">
                  <span className={"inline-block size-3 rounded-full " + (u.roleId === (r.id as RoleId) ? "bg-primary" : "bg-muted")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
