import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { f as Route$8, s as repo, w as useRightPanel, a as Link } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { S as StandardizationBadge } from "./Badges-CxMpVJX7.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar } from "./FilterBar-qmjw2TO-.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
const TABS = ["Overview", "Steps", "Capabilities", "Deployments"];
function TemplateDetail() {
  const {
    template
  } = Route$8.useLoaderData();
  const [tab, setTab] = reactExports.useState("Steps");
  const [q, setQ] = reactExports.useState("");
  const steps = repo.stepsOf(template.id);
  const caps = repo.capabilitiesOfTemplate(template.id);
  const deployments = repo.projects().filter((p) => repo.scopeOfProject(p.id).some((r) => r.templateId === template.id));
  const filteredSteps = reactExports.useMemo(() => q ? steps.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.transaction.toLowerCase().includes(q.toLowerCase())) : steps, [steps, q]);
  const stepCols = reactExports.useMemo(() => [{
    header: "Seq",
    accessorKey: "seq",
    size: 70,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-muted-foreground", children: i.getValue() })
  }, {
    header: "Step Name",
    accessorKey: "name"
  }, {
    header: "SAP Tx",
    accessorKey: "transaction",
    size: 120,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num rounded bg-muted px-1.5 py-0.5 text-[11.5px] font-medium text-foreground", children: i.getValue() })
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
  useRightPanel(/* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Template" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: [
        "#",
        template.id
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: template.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: template.standard }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Steps", value: steps.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Capabilities", value: caps.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Deployments", value: deployments.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Std", value: template.standard.split("/")[0] })
    ] })
  ] }), [template.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-primary", children: [
        "#",
        template.id
      ] }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: template.name })
    ] }), breadcrumbs: [{
      label: "BPML"
    }, {
      label: "Templates",
      to: "/templates"
    }, {
      label: `#${template.id}`
    }], meta: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: template.standard }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        steps.length,
        " steps"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        caps.length,
        " capabilities"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        deployments.length,
        " deployments"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t), className: "relative h-9 px-3 text-[12.5px] font-medium " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
      t,
      tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" })
    ] }, t)) }),
    tab === "Overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 overflow-y-auto p-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface p-3 shadow-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Identification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Template ID", value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num", children: [
          "#",
          template.id
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Name", value: template.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bekaert Standard", value: /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: template.standard }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Step count", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: steps.length }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface p-3 shadow-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Usage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Capabilities linked", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: caps.length }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Projects deploying", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: deployments.length }) })
      ] })
    ] }),
    tab === "Steps" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search: q, onSearchChange: setQ, placeholder: "Search steps or transactions…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: stepCols, data: filteredSteps, rowKey: (r) => `${r.templateId}-${r.seq}`, empty: "No steps." })
    ] }),
    tab === "Capabilities" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid gap-1 lg:grid-cols-2", children: caps.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/capabilities/$capabilityId", params: {
      capabilityId: p.id.trim()
    }, className: "flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: p.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p.name })
    ] }) }, p.id)) }) }),
    tab === "Deployments" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "grid gap-1 lg:grid-cols-2", children: [
      deployments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-[13px] text-muted-foreground", children: "Not deployed in any project yet." }),
      deployments.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/projects/$projectId", params: {
        projectId: p.id
      }, className: "flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: p.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[11.5px] text-muted-foreground", children: p.status })
      ] }) }, p.id))
    ] }) })
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 border-b border-border/60 py-1.5 text-[12.5px] last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: value })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[15px] font-semibold", children: value })
  ] });
}
export {
  TemplateDetail as component
};
