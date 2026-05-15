import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { s as repo } from "./router-Dwu8MerC.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { a as StatusBadge } from "./Badges-CxMpVJX7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function UsersPage() {
  const cols = reactExports.useMemo(() => [{
    header: "ID",
    accessorKey: "id",
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-muted-foreground", children: i.getValue() })
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Email",
    accessorKey: "email"
  }, {
    header: "Role",
    accessorFn: (r) => repo.roles().find((x) => x.id === r.roleId)?.name ?? r.roleId,
    size: 160,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: i.getValue(), intent: "info" })
  }, {
    header: "Status",
    accessorKey: "active",
    size: 90,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: i.getValue() ? "Active" : "Disabled", intent: i.getValue() ? "success" : "neutral" })
  }], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: cols, data: repo.users(), rowKey: (r) => r.id });
}
export {
  UsersPage as component
};
