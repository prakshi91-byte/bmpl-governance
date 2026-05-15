import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { v as useNavigate, u as useDraftsStore, R as ROLE_PERMS, y as useUIStore, s as repo, a as Link, d as Plus } from "./router-Dwu8MerC.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar, a as FilterChip } from "./FilterBar-qmjw2TO-.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { S as StandardizationBadge } from "./Badges-CxMpVJX7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
function TemplatesIndex() {
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const [std, setStd] = reactExports.useState("__all");
  const version = useDraftsStore((s) => s.version);
  const isDraft = useDraftsStore((s) => s.isDraft);
  const canEdit = ROLE_PERMS[useUIStore((s) => s.currentRole)].canEdit;
  const standards = reactExports.useMemo(() => Array.from(new Set(repo.templates().map((t) => t.standard))).sort(), [version]);
  const data = reactExports.useMemo(() => repo.templates().filter((t) => {
    if (std !== "__all" && t.standard !== std) return false;
    if (q && !t.name.toLowerCase().includes(q.toLowerCase()) && !String(t.id).includes(q)) return false;
    return true;
  }), [q, std, version]);
  const columns = reactExports.useMemo(() => [{
    header: "ID",
    accessorKey: "id",
    size: 90,
    cell: (i) => {
      const id = i.getValue();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num inline-flex items-center gap-1 font-medium text-primary", children: [
        id,
        isDraft("template", id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-primary-soft px-1 text-[9.5px] uppercase", children: "draft" })
      ] });
    }
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Steps",
    accessorKey: "stepCount",
    size: 80,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: i.getValue() })
  }, {
    header: "Capabilities",
    accessorFn: (r) => r.capabilityIds.length,
    size: 110,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: i.getValue() })
  }, {
    header: "Standardization",
    accessorKey: "standard",
    size: 170,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: i.getValue() })
  }], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Capability Templates", subtitle: `${repo.templates().length.toLocaleString()} reusable process templates.`, breadcrumbs: [{
      label: "BPML"
    }, {
      label: "Capability Templates"
    }], actions: canEdit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/create", search: {
      tab: "Template"
    }, className: "inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
      " New template"
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search: q, onSearchChange: setQ, placeholder: "Search templates by ID or name…", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: "Standardization", value: std, options: [{
      value: "__all",
      label: "All"
    }, ...standards.map((s) => ({
      value: s,
      label: s
    }))], onChange: setStd }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns, data, rowKey: (r) => r.id, onRowClick: (r) => navigate({
      to: "/templates/$templateId",
      params: {
        templateId: String(r.id)
      }
    }) })
  ] });
}
export {
  TemplatesIndex as component
};
