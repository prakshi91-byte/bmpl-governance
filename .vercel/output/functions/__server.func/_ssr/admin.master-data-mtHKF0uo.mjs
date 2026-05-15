import { H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { r as productGroups, l as businessTemplateLevels, p as geographicalScope, s as repo } from "./router-Dwu8MerC.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function MasterDataPage() {
  const groups = [{
    title: "Product Groups",
    values: productGroups
  }, {
    title: "Business Template Levels",
    values: businessTemplateLevels
  }, {
    title: "Geographical Scope",
    values: geographicalScope
  }, {
    title: "Process Domains",
    values: repo.domains().map((d) => d.name)
  }, {
    title: "Business Entities",
    values: repo.entities().map((e) => e.id)
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thin-scrollbar flex-1 overflow-y-auto p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface p-3 shadow-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12.5px] font-semibold", children: g.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num rounded bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground", children: g.values.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "thin-scrollbar max-h-56 space-y-0.5 overflow-y-auto text-[12.5px]", children: g.values.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded px-1.5 py-0.5 hover:bg-surface-hover", children: v }, v)) })
  ] }, g.title)) }) });
}
export {
  MasterDataPage as component
};
