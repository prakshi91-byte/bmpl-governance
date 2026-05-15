import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { v as useNavigate, s as repo } from "./router-Dwu8MerC.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar, a as FilterChip } from "./FilterBar-qmjw2TO-.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { a as StatusBadge } from "./Badges-CxMpVJX7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
function BTIndex() {
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const [level, setLevel] = reactExports.useState("__all");
  const levels = reactExports.useMemo(() => Array.from(new Set(repo.businessTemplates().map((b) => b.level))), []);
  const data = reactExports.useMemo(() => repo.businessTemplates().filter((b) => {
    if (level !== "__all" && b.level !== level) return false;
    if (q && !b.name.toLowerCase().includes(q.toLowerCase()) && !b.id.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, level]);
  const cols = reactExports.useMemo(() => [{
    header: "ID",
    accessorKey: "id",
    size: 110,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-primary", children: i.getValue() })
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Level",
    accessorKey: "level",
    size: 80,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: i.getValue(), intent: "info" })
  }, {
    header: "Product Group",
    accessorKey: "productGroup",
    size: 130
  }, {
    header: "Geo Scope",
    accessorKey: "geoScope",
    size: 110
  }, {
    header: "Templates",
    accessorFn: (r) => repo.templatesOfBT(r.id).length,
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: i.getValue() })
  }], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Business Templates", subtitle: "Rollout packages bundling capability templates for deployment.", breadcrumbs: [{
      label: "Rollout"
    }, {
      label: "Business Templates"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search: q, onSearchChange: setQ, placeholder: "Search business templates…", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: "Level", value: level, options: [{
      value: "__all",
      label: "All"
    }, ...levels.map((l) => ({
      value: l,
      label: l.split(" ")[0]
    }))], onChange: setLevel }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: cols, data, rowKey: (r) => r.id, onRowClick: (r) => navigate({
      to: "/business-templates/$btId",
      params: {
        btId: r.id
      }
    }) })
  ] });
}
export {
  BTIndex as component
};
