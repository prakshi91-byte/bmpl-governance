import { H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { k as Search, n as cn } from "./router-Dwu8MerC.mjs";
import { X } from "./x-DUAiniXO.mjs";
function FilterBar({
  search,
  onSearchChange,
  placeholder = "Search…",
  children,
  right,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2",
        className
      ),
      children: [
        onSearchChange && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: search ?? "",
              onChange: (e) => onSearchChange(e.target.value),
              placeholder,
              className: "h-8 w-64 rounded-md border border-border bg-surface pl-7 pr-7 text-[13px] outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            }
          ),
          search && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onSearchChange(""),
              className: "absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-surface-hover",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
            }
          )
        ] }),
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto flex items-center gap-2", children: right })
      ]
    }
  );
}
function FilterChip({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2 text-[12.5px] text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: "bg-transparent pr-1 text-[12.5px] font-medium outline-none",
        children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: o.value, children: [
          o.label,
          o.count !== void 0 ? ` (${o.count})` : ""
        ] }, o.value))
      }
    )
  ] });
}
export {
  FilterBar as F,
  FilterChip as a
};
