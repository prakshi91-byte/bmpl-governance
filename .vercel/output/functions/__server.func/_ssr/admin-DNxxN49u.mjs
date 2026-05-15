import { H as jsxRuntimeExports, O as Outlet } from "./server-BGeP2W0b.mjs";
import { y as useUIStore, x as useRouterState, R as ROLE_PERMS, a as Link } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { L as Lock } from "./lock-B0fWDZZU.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const TABS = [{
  to: "/admin/users",
  label: "Users"
}, {
  to: "/admin/roles",
  label: "Roles"
}, {
  to: "/admin/assignments",
  label: "Role Assignments"
}, {
  to: "/admin/master-data",
  label: "Master Data"
}];
function AdminLayout() {
  const role = useUIStore((s) => s.currentRole);
  const path = useRouterState({
    select: (r) => r.location.pathname
  });
  const allowed = ROLE_PERMS[role].canAdmin;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Administration", subtitle: "Users, roles, and master data governance.", breadcrumbs: [{
      label: "System"
    }, {
      label: "Administration"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3", children: TABS.map((t) => {
      const active = path.startsWith(t.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: "relative h-9 px-3 text-[12.5px] font-medium " + (active ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
        t.label,
        active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" })
      ] }, t.to);
    }) }),
    !allowed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm rounded-md border border-border bg-surface p-6 text-center shadow-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mx-auto size-6 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-[14px] font-semibold", children: "Administration restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[12.5px] text-muted-foreground", children: [
        "You're signed in as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: role }),
        ". Switch to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Global Admin" }),
        " in the top bar to manage users, roles, and master data."
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  AdminLayout as component
};
