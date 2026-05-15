import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { h as Route$6, v as useNavigate, s as repo, w as useRightPanel, a as Link } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { a as StatusBadge } from "./Badges-CxMpVJX7.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ProcessDetail() {
  const {
    process
  } = Route$6.useLoaderData();
  const navigate = useNavigate();
  const area = repo.area(process.processAreaId);
  const domain = repo.domain(process.processDomainId);
  const caps = repo.capabilitiesOf(process.id);
  const cols = reactExports.useMemo(() => [{
    header: "Capability ID",
    accessorKey: "id",
    size: 150,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-primary", children: i.getValue().trim() })
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Templates",
    accessorKey: "templateCount",
    size: 100,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: i.getValue() })
  }, {
    header: "Status",
    accessorKey: "status",
    size: 130,
    cell: (i) => {
      const v = i.getValue();
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: v, intent: v === "Active" ? "success" : "neutral" });
    }
  }], []);
  useRightPanel(/* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Process" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: process.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: process.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Capabilities", value: process.capabilityCount }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Templates", value: process.templateCount })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-2 text-[12px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Owner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: process.owner })
    ] })
  ] }), [process.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-primary", children: process.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: process.name })
    ] }), breadcrumbs: [{
      label: "BPML",
      to: "/hierarchy"
    }, {
      label: "Processes",
      to: "/processes"
    }, {
      label: process.id.trim()
    }], meta: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Domain ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: domain?.name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Area ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/hierarchy", search: {
          domain: process.processDomainId,
          area: process.processAreaId
        }, className: "text-foreground hover:underline", children: area?.name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Owner ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: process.owner })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: process.status, intent: process.status === "Active" ? "success" : "neutral" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns: cols, data: caps, rowKey: (r) => r.id, onRowClick: (r) => navigate({
      to: "/capabilities/$capabilityId",
      params: {
        capabilityId: r.id.trim()
      }
    }), empty: "No capabilities under this process." })
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
  ProcessDetail as component
};
