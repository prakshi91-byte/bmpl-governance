import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { i as Route$5, v as useNavigate, s as repo, w as useRightPanel, a as Link, L as Layers } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { S as StandardizationBadge, a as StatusBadge } from "./Badges-CxMpVJX7.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar } from "./FilterBar-qmjw2TO-.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
const TABS = ["Overview", "Templates", "Relationships", "History"];
function CapabilityDetail() {
  const {
    capability
  } = Route$5.useLoaderData();
  const navigate = useNavigate();
  const [tab, setTab] = reactExports.useState("Overview");
  const [tq, setTq] = reactExports.useState("");
  const area = repo.area(capability.processAreaId);
  const domain = repo.domain(capability.processDomainId);
  const proc = repo.process(capability.processId);
  const templates = repo.templatesOf(capability.id);
  const filteredTemplates = reactExports.useMemo(() => tq ? templates.filter((t) => t.name.toLowerCase().includes(tq.toLowerCase()) || String(t.id).includes(tq)) : templates, [templates, tq]);
  const tplColumns = reactExports.useMemo(() => [{
    header: "ID",
    accessorKey: "id",
    size: 80,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-primary", children: i.getValue() })
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Steps",
    accessorKey: "stepCount",
    size: 80,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: i.getValue() })
  }, {
    header: "Standardization",
    accessorKey: "standard",
    size: 160,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: i.getValue() })
  }], []);
  useRightPanel(/* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Capability" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: capability.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: capability.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Templates", value: capability.templateCount }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Status", value: capability.status })
    ] }),
    proc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-2 text-[12px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Parent process" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/processes/$processId", params: {
        processId: proc.id.trim()
      }, className: "mt-0.5 block text-primary hover:underline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px]", children: proc.id.trim() }),
        " · ",
        proc.name
      ] })
    ] })
  ] }), [capability.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-primary", children: capability.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: capability.name })
    ] }), breadcrumbs: [{
      label: "BPML",
      to: "/hierarchy"
    }, {
      label: "Capabilities",
      to: "/capabilities"
    }, {
      label: capability.id.trim()
    }], meta: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Domain ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: domain?.name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Area ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: area?.name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Process ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: proc?.name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: capability.status, intent: capability.status === "Active" ? "success" : "neutral" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t), className: "relative h-9 px-3 text-[12.5px] font-medium transition-colors " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
      t,
      tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" })
    ] }, t)) }),
    tab === "Overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 overflow-y-auto p-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Identification", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Capability ID", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: capability.id.trim() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Name", value: capability.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Status", value: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: capability.status, intent: capability.status === "Active" ? "success" : "neutral" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Hierarchy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Process Domain", value: domain?.name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Process Area", value: area?.name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Process", value: proc ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/processes/$processId", params: {
          processId: proc.id.trim()
        }, className: "text-primary hover:underline", children: proc.name }) : "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Governance", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Linked Templates", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: capability.templateCount }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Sibling capabilities", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: repo.capabilitiesOf(capability.processId).length }) })
      ] })
    ] }),
    tab === "Templates" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { search: tq, onSearchChange: setTq, placeholder: "Filter templates…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: tplColumns, data: filteredTemplates, rowKey: (r) => r.id, onRowClick: (r) => navigate({
        to: "/templates/$templateId",
        params: {
          templateId: String(r.id)
        }
      }), empty: "No templates linked to this capability." })
    ] }),
    tab === "Relationships" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 overflow-y-auto p-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Sibling capabilities (same process)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 text-[13px]", children: repo.capabilitiesOf(capability.processId).filter((c) => c.id !== capability.id).slice(0, 12).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/capabilities/$capabilityId", params: {
        capabilityId: c.id.trim()
      }, className: "flex items-center gap-2 rounded px-1.5 py-1 hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: c.id.trim() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: c.name })
      ] }) }, c.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Templates available", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 text-[13px]", children: templates.slice(0, 12).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/templates/$templateId", params: {
        templateId: String(t.id)
      }, className: "flex items-center gap-2 rounded px-1.5 py-1 hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: t.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: t.standard, className: "ml-auto" })
      ] }) }, t.id)) }) })
    ] }),
    tab === "History" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Recent activity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-[13px]", children: [{
      who: proc?.owner ?? "—",
      what: "Updated capability metadata",
      when: "2 days ago"
    }, {
      who: "Anna Janssen",
      what: "Linked template to capability",
      when: "1 week ago"
    }, {
      who: "System",
      what: "Capability imported from BPML extract",
      when: "3 months ago"
    }].map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 border-b border-border/60 pb-2 last:border-b-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: e.what }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11.5px] text-muted-foreground", children: [
          e.who,
          " · ",
          e.when
        ] })
      ] })
    ] }, i)) }) }) })
  ] });
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface p-3 shadow-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
    children
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 border-b border-border/60 py-1.5 last:border-b-0 text-[12.5px]", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[16px] font-semibold", children: value })
  ] });
}
export {
  CapabilityDetail as component
};
