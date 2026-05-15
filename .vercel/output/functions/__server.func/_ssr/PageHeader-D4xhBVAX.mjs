import { H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { o as createLucideIcon, a as Link, n as cn } from "./router-Dwu8MerC.mjs";
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
function Breadcrumbs({ items, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: cn("flex items-center gap-1 text-[12px] text-muted-foreground", className), "aria-label": "Breadcrumb", children: items.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3 opacity-50" }),
    c.to && i < items.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: c.to, className: "hover:text-foreground transition-colors", children: c.label }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(i === items.length - 1 && "text-foreground font-medium"), children: c.label })
  ] }, i)) });
}
function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  meta
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border bg-surface px-5 py-3", children: [
    breadcrumbs && breadcrumbs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: breadcrumbs, className: "mb-1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-[17px] font-semibold leading-6 text-foreground", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[12.5px] text-muted-foreground", children: subtitle })
      ] }),
      actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-2", children: actions })
    ] }),
    meta && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-muted-foreground", children: meta })
  ] });
}
export {
  ChevronRight as C,
  PageHeader as P
};
