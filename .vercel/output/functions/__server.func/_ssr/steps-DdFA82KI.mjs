import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { s as repo, a as Link } from "./router-Dwu8MerC.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar, a as FilterChip } from "./FilterBar-qmjw2TO-.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { S as StandardizationBadge } from "./Badges-CxMpVJX7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
function StepsPage() {
  const [q, setQ] = reactExports.useState("");
  const [std, setStd] = reactExports.useState("__all");
  const standards = reactExports.useMemo(() => Array.from(new Set(repo.steps().map((s) => s.standard))).sort(), []);
  const data = reactExports.useMemo(() => repo.steps().filter((s) => {
    if (std !== "__all" && s.standard !== std) return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.transaction.toLowerCase().includes(q.toLowerCase()) && !String(s.templateId).includes(q)) return false;
    return true;
  }), [q, std]);
  const cols = reactExports.useMemo(() => [{
    header: "Template",
    accessorKey: "templateId",
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/templates/$templateId", params: {
      templateId: String(i.getValue())
    }, className: "num font-medium text-primary hover:underline", children: [
      "#",
      i.getValue()
    ] })
  }, {
    header: "Seq",
    accessorKey: "seq",
    size: 60,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-muted-foreground", children: i.getValue() })
  }, {
    header: "Step Name",
    accessorKey: "name"
  }, {
    header: "SAP Tx",
    accessorKey: "transaction",
    size: 110,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num rounded bg-muted px-1.5 py-0.5 text-[11.5px] font-medium", children: i.getValue() })
  }, {
    header: "Standardization",
    accessorKey: "standard",
    size: 160,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: i.getValue() })
  }, {
    header: "Status",
    accessorKey: "status",
    size: 90
  }], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Template Steps", subtitle: `${repo.steps().length.toLocaleString()} execution steps across all templates.`, breadcrumbs: [{
      label: "BPML"
    }, {
      label: "Template Steps"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search: q, onSearchChange: setQ, placeholder: "Search by step, transaction, or template ID…", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: "Standardization", value: std, options: [{
      value: "__all",
      label: "All"
    }, ...standards.map((s) => ({
      value: s,
      label: s
    }))], onChange: setStd }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: cols, data, rowKey: (r) => `${r.templateId}-${r.seq}`, pageSize: 100 })
  ] });
}
export {
  StepsPage as component
};
