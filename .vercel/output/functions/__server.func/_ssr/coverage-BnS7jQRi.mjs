import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { s as repo } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { F as FilterBar, a as FilterChip } from "./FilterBar-qmjw2TO-.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
const STATE_COLOR = {
  covered: "bg-cov-covered",
  partial: "bg-cov-partial",
  not_covered: "bg-cov-not",
  na: "bg-cov-na"
};
const STATE_LABEL = {
  covered: "Covered",
  partial: "Partial",
  not_covered: "Not covered",
  na: "N/A"
};
function CoveragePage() {
  const entities = repo.entities();
  const areas = repo.areas();
  const [domain, setDomain] = reactExports.useState("__all");
  const filteredAreas = reactExports.useMemo(() => domain === "__all" ? areas : areas.filter((a) => a.processDomainId.trim() === domain), [areas, domain]);
  const cellMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const a of filteredAreas) for (const c of repo.coverageOfArea(a.id)) m.set(`${a.id.trim()}|${c.entityId}`, c.state);
    return m;
  }, [filteredAreas]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Coverage Map", subtitle: "Process areas × business entities — rollout heatmap.", breadcrumbs: [{
      label: "Rollout"
    }, {
      label: "Coverage Map"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { right: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-[11.5px] text-muted-foreground", children: Object.keys(STATE_COLOR).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-3 rounded ${STATE_COLOR[s]}` }),
      STATE_LABEL[s]
    ] }, s)) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: "Domain", value: domain, options: [{
      value: "__all",
      label: "All"
    }, ...repo.domains().map((d) => ({
      value: d.id.trim(),
      label: d.id.trim()
    }))], onChange: setDomain }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thin-scrollbar relative flex-1 overflow-auto bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "border-separate border-spacing-0 text-[11.5px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 top-0 z-30 h-9 min-w-[280px] border-b border-r border-border bg-surface-2 px-3 text-left font-semibold text-muted-foreground", children: "Process Area" }),
        entities.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky top-0 z-20 h-9 w-7 border-b border-border bg-surface-2 text-center font-semibold text-muted-foreground", title: e.name, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num rotate-[-50deg] origin-center text-[10.5px]", children: e.id }) }, e.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredAreas.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 z-10 border-b border-r border-border bg-surface px-3 py-1 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: a.id.trim() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: a.name.replace(/^[A-Z0-9.]+ - /, "") })
        ] }) }),
        entities.map((e) => {
          const s = cellMap.get(`${a.id.trim()}|${e.id}`) ?? "na";
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-border/60 p-0.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mx-auto size-4 rounded ${STATE_COLOR[s]} ring-1 ring-inset ring-border/60`, title: `${a.name} × ${e.id}: ${STATE_LABEL[s]}` }) }, e.id);
        })
      ] }, a.id)) })
    ] }) })
  ] });
}
export {
  CoveragePage as component
};
