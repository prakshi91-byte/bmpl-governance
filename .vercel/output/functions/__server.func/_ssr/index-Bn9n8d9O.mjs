import { H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { s as repo, b as ListTree, W as Workflow, B as Boxes, L as Layers, c as Network, P as Package, M as Map$1, a as Link, o as createLucideIcon } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function Index() {
  const stats = repo.stats();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "BPML Governance Platform", subtitle: "Single source of truth for SAP Business Process Master List, reusable templates, and deployment coverage.", meta: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.domains }),
        " Process Domains"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.areas }),
        " Areas"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.processes }),
        " Processes"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.capabilities.toLocaleString() }),
        " Capabilities"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.templates.toLocaleString() }),
        " Templates"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.steps.toLocaleString() }),
        " Template Steps"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.projects }),
        " Projects"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: stats.entities }),
        " Entities"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 p-5 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Workspaces" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/hierarchy", icon: ListTree, title: "Process Hierarchy Explorer", desc: "Drill down through Domains → Areas → Processes → Capabilities.", accent: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/processes", icon: Workflow, title: "Processes", desc: "The 355 SAP business processes grouping capabilities." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/capabilities", icon: Boxes, title: "Capabilities", desc: "Capability leaves linked to reusable templates." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/templates", icon: Layers, title: "Capability Templates", desc: "Reusable process templates and standardization." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/steps", icon: Network, title: "Template Steps", desc: "SAP transactions and execution model." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/business-templates", icon: Package, title: "Business Templates", desc: "Rollout packages by level, product group, geo." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/projects", icon: Boxes, title: "Project Scope", desc: "Deployment scope and assignments per project." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceCard, { to: "/coverage", icon: Map$1, title: "Coverage Map", desc: "Heatmap of process areas across business entities." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Process Domains" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-md border border-border bg-surface shadow-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[13px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-surface-2 text-[11px] uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold", children: "Domain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Areas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Processes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold", children: "Capabilities" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: repo.domains().map((d) => {
            const areas = repo.areasOf(d.id);
            const procs = areas.reduce((acc, a) => acc + repo.processesOf(a.id).length, 0);
            const caps = areas.reduce((acc, a) => acc + repo.capabilitiesOfArea(a.id).length, 0);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border hover:bg-surface-hover", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-3 py-1.5 font-medium text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/hierarchy", search: {
                domain: d.id.trim()
              }, children: d.id.trim() }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 truncate", children: d.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-3 py-1.5 text-right text-muted-foreground", children: areas.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-3 py-1.5 text-right text-muted-foreground", children: procs }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-3 py-1.5 text-right text-muted-foreground", children: caps })
            ] }, d.id);
          }) })
        ] }) })
      ] })
    ] })
  ] });
}
function WorkspaceCard({
  to,
  icon: Icon,
  title,
  desc,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "group flex flex-col rounded-md border border-border bg-surface p-3 shadow-panel transition-all hover:border-border-strong hover:shadow-pop " + (accent ? "ring-1 ring-primary/20" : ""), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid size-8 place-items-center rounded-md " + (accent ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13.5px] font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[12.5px] leading-snug text-muted-foreground", children: desc })
  ] });
}
export {
  Index as component
};
