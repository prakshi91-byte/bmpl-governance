import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { v as useNavigate, s as repo } from "./router-Dwu8MerC.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { a as StatusBadge } from "./Badges-CxMpVJX7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ProjectsIndex() {
  const navigate = useNavigate();
  const cols = reactExports.useMemo(() => [{
    header: "ID",
    accessorKey: "id",
    size: 110,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-primary", children: i.getValue() })
  }, {
    header: "Code",
    accessorKey: "code",
    size: 90
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Manager",
    accessorKey: "manager",
    size: 150
  }, {
    header: "Start",
    accessorKey: "startDate",
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-muted-foreground", children: i.getValue() })
  }, {
    header: "End",
    accessorKey: "endDate",
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-muted-foreground", children: i.getValue() })
  }, {
    header: "Status",
    accessorKey: "status",
    size: 110,
    cell: (i) => {
      const v = i.getValue();
      const intent = v === "Closed" ? "neutral" : v === "At Risk" ? "danger" : v === "Planning" ? "info" : "success";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: v, intent });
    }
  }, {
    header: "Templates",
    accessorFn: (r) => repo.scopeOfProject(r.id).filter((s) => s.templateId).length,
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: i.getValue() })
  }], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Project Scope", subtitle: "Rollout projects with template and business-template assignments.", breadcrumbs: [{
      label: "Rollout"
    }, {
      label: "Project Scope"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: cols, data: repo.projects(), rowKey: (r) => r.id, onRowClick: (r) => navigate({
      to: "/projects/$projectId",
      params: {
        projectId: r.id
      }
    }) })
  ] });
}
export {
  ProjectsIndex as component
};
