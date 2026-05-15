import { H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { s as repo } from "./router-Dwu8MerC.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AssignmentsPage() {
  const users = repo.users();
  const roles = repo.roles();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thin-scrollbar flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-separate border-spacing-0 text-[13px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-surface-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "h-9 border-b border-border px-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: "User" }),
      roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "h-9 border-b border-border px-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: r.name }, r.id))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-hover", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "border-b border-border/60 px-3 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: u.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: u.email })
      ] }),
      roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-border/60 px-3 py-1.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block size-3 rounded-full " + (u.roleId === r.id ? "bg-primary" : "bg-muted") }) }, r.id))
    ] }, u.id)) })
  ] }) });
}
export {
  AssignmentsPage as component
};
