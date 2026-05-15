import { H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { s as repo, R as ROLE_PERMS } from "./router-Dwu8MerC.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function RolesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thin-scrollbar flex-1 overflow-y-auto p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: repo.roles().map((r) => {
    const perms = ROLE_PERMS[r.id];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface p-3 shadow-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[14px] font-semibold", children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num text-[11px] text-muted-foreground", children: r.id })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12.5px] text-muted-foreground", children: r.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Perm, { label: "Can edit", allowed: perms.canEdit }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Perm, { label: "Admin access", allowed: perms.canAdmin })
      ] })
    ] }, r.id);
  }) }) });
}
function Perm({
  label,
  allowed
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded border border-border bg-surface-2 px-2 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: allowed ? "text-std-global font-semibold" : "text-muted-foreground", children: allowed ? "Yes" : "No" })
  ] });
}
export {
  RolesPage as component
};
