import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { v as useNavigate, u as useDraftsStore, R as ROLE_PERMS, y as useUIStore, s as repo, a as Link, d as Plus } from "./router-Dwu8MerC.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar, a as FilterChip } from "./FilterBar-qmjw2TO-.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { a as StatusBadge } from "./Badges-CxMpVJX7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./x-DUAiniXO.mjs";
function CapabilitiesIndex() {
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const [domain, setDomain] = reactExports.useState("__all");
  const [status, setStatus] = reactExports.useState("__all");
  const version = useDraftsStore((s) => s.version);
  const isDraft = useDraftsStore((s) => s.isDraft);
  const canEdit = ROLE_PERMS[useUIStore((s) => s.currentRole)].canEdit;
  const data = reactExports.useMemo(() => {
    const all = repo.capabilities();
    return all.filter((c) => {
      if (domain !== "__all" && c.processDomainId.trim() !== domain) return false;
      if (status !== "__all" && c.status !== status) return false;
      if (q && !c.id.toLowerCase().includes(q.toLowerCase()) && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, domain, status, version]);
  const columns = reactExports.useMemo(() => [{
    header: "Capability ID",
    accessorKey: "id",
    size: 150,
    cell: (i) => {
      const id = i.getValue().trim();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num inline-flex items-center gap-1 font-medium text-primary", children: [
        id,
        isDraft("capability", id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-primary-soft px-1 text-[9.5px] uppercase", children: "draft" })
      ] });
    }
  }, {
    header: "Name",
    accessorKey: "name"
  }, {
    header: "Process",
    accessorFn: (r) => repo.process(r.processId)?.name ?? r.processId,
    size: 240,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-muted-foreground", children: i.getValue() })
  }, {
    header: "Area",
    accessorFn: (r) => repo.area(r.processAreaId)?.name ?? r.processAreaId,
    size: 200,
    cell: (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-muted-foreground", children: i.getValue() })
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
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: v, intent: v === "Active" ? "success" : v === "Draft" ? "info" : "neutral" });
    }
  }], [isDraft]);
  const domainOpts = [{
    value: "__all",
    label: "All",
    count: repo.capabilities().length
  }, ...repo.domains().map((d) => ({
    value: d.id.trim(),
    label: d.id.trim(),
    count: repo.capabilities().filter((c) => c.processDomainId.trim() === d.id.trim()).length
  }))];
  const statusOpts = [{
    value: "__all",
    label: "All"
  }, {
    value: "Active",
    label: "Active"
  }, {
    value: "Draft",
    label: "Draft"
  }, {
    value: "Under Review",
    label: "Under Review"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Capabilities", subtitle: `${repo.capabilities().length.toLocaleString()} capability leaves linked to ${repo.processes().length} processes.`, breadcrumbs: [{
      label: "BPML"
    }, {
      label: "Capabilities"
    }], actions: canEdit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/create", className: "inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
      " New capability"
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterBar, { search: q, onSearchChange: setQ, placeholder: "Search capabilities…", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: "Domain", value: domain, options: domainOpts, onChange: setDomain }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: "Status", value: status, options: statusOpts, onChange: setStatus })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns, data, rowKey: (r) => r.id, onRowClick: (r) => navigate({
      to: "/capabilities/$capabilityId",
      params: {
        capabilityId: r.id.trim()
      }
    }) })
  ] });
}
export {
  CapabilitiesIndex as component
};
