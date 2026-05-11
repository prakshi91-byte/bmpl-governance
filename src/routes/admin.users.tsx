import { createFileRoute } from "@tanstack/react-router";
import { repo, type User } from "@/data/repo";
import { DataGrid, type ColumnDef } from "@/components/enterprise/DataGrid";
import { StatusBadge } from "@/components/enterprise/Badges";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  const cols: ColumnDef<User>[] = useMemo(
    () => [
      { header: "ID", accessorKey: "id", size: 100, cell: (i) => <span className="num text-muted-foreground">{i.getValue() as string}</span> },
      { header: "Name", accessorKey: "name" },
      { header: "Email", accessorKey: "email" },
      { header: "Role", accessorFn: (r) => repo.roles().find((x) => x.id === r.roleId)?.name ?? r.roleId, size: 160, cell: (i) => <StatusBadge value={i.getValue() as string} intent="info" /> },
      { header: "Status", accessorKey: "active", size: 90, cell: (i) => <StatusBadge value={i.getValue() ? "Active" : "Disabled"} intent={i.getValue() ? "success" : "neutral"} /> },
    ],
    [],
  );
  return <DataGrid columns={cols} data={repo.users()} rowKey={(r) => r.id} />;
}
