import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { e as Route$j, s as repo, w as useRightPanel, k as Search, a as Link, L as Layers, n as cn, W as Workflow, B as Boxes, o as createLucideIcon } from "./router-Dwu8MerC.mjs";
import { a as StatusBadge, S as StandardizationBadge } from "./Badges-CxMpVJX7.mjs";
import { D as DataGrid } from "./DataGrid-B7muzKMi.mjs";
import { F as FilterBar } from "./FilterBar-qmjw2TO-.mjs";
import { P as PageHeader, C as ChevronRight } from "./PageHeader-D4xhBVAX.mjs";
import { X } from "./x-DUAiniXO.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode);
function HierarchyPage() {
  const search = Route$j.useSearch();
  const navigate = Route$j.useNavigate();
  const [treeQuery, setTreeQuery] = reactExports.useState("");
  const [gridQuery, setGridQuery] = reactExports.useState("");
  const domains = repo.domains();
  const selectedDomainId = search.domain ?? domains[0]?.id.trim();
  const selectedAreaId = search.area;
  const selectedProcessId = search.process;
  const selectedCapabilityId = search.capability;
  const areas = reactExports.useMemo(() => selectedDomainId ? repo.areasOf(selectedDomainId) : [], [selectedDomainId]);
  const capabilities = reactExports.useMemo(() => {
    if (selectedProcessId) return repo.capabilitiesOf(selectedProcessId);
    if (selectedAreaId) return repo.capabilitiesOfArea(selectedAreaId);
    return areas.flatMap((a) => repo.capabilitiesOfArea(a.id));
  }, [areas, selectedAreaId, selectedProcessId]);
  const filteredCaps = reactExports.useMemo(() => {
    const q = gridQuery.toLowerCase().trim();
    if (!q) return capabilities;
    return capabilities.filter((c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [capabilities, gridQuery]);
  const selectedCapability = selectedCapabilityId ? repo.capability(selectedCapabilityId) : capabilities[0];
  const selectedProcess = selectedProcessId ? repo.process(selectedProcessId) : void 0;
  useRightPanel(selectedCapability ? /* @__PURE__ */ jsxRuntimeExports.jsx(CapabilityPanel, { capability: selectedCapability }) : selectedProcess ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProcessPanel, { process: selectedProcess }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DomainPanel, { domain: domains.find((d) => d.id.trim() === selectedDomainId) }), [selectedCapability?.id, selectedProcess?.id, selectedDomainId]);
  const columns = reactExports.useMemo(() => [{
    header: "Capability ID",
    accessorKey: "id",
    size: 150,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-primary", children: info.getValue().trim() })
  }, {
    header: "Name",
    accessorKey: "name",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: info.getValue() })
  }, {
    header: "Process",
    accessorFn: (r) => repo.process(r.processId)?.name ?? r.processId,
    size: 220,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-muted-foreground", children: info.getValue() })
  }, {
    header: "Templates",
    accessorKey: "templateCount",
    size: 100,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: info.getValue() })
  }, {
    header: "Status",
    accessorKey: "status",
    size: 110,
    cell: (info) => {
      const v = info.getValue();
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: v, intent: v === "Active" ? "success" : "neutral" });
    }
  }], []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Process Hierarchy Explorer", subtitle: "Domain → Area → Process → Capability → Templates.", breadcrumbs: [{
      label: "BPML",
      to: "/hierarchy"
    }, {
      label: "Process Hierarchy"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-[320px] shrink-0 flex-col border-r border-border bg-surface md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-10 items-center gap-2 border-b border-border px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: treeQuery, onChange: (e) => setTreeQuery(e.target.value), placeholder: "Filter hierarchy…", className: "h-7 w-full bg-transparent text-[12.5px] outline-none" }),
          treeQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTreeQuery(""), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thin-scrollbar flex-1 overflow-y-auto py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyTree, { domains, query: treeQuery, selectedDomainId, selectedAreaId, selectedProcessId, onSelectDomain: (id) => navigate({
          search: {
            domain: id
          }
        }), onSelectArea: (domainId, areaId) => navigate({
          search: {
            domain: domainId,
            area: areaId
          }
        }), onSelectProcess: (domainId, areaId, processId) => navigate({
          search: {
            domain: domainId,
            area: areaId,
            process: processId
          }
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterBar, { search: gridQuery, onSearchChange: setGridQuery, placeholder: "Search capabilities by ID or name…", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden text-[12px] text-muted-foreground sm:inline", children: selectedProcessId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Process ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: selectedProcessId.trim() })
          ] }) : selectedAreaId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Area ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: selectedAreaId.trim() })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Domain ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num font-medium text-foreground", children: selectedDomainId })
          ] }) }),
          (selectedProcessId || selectedAreaId) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
            search: selectedProcessId ? {
              domain: selectedDomainId,
              area: selectedAreaId
            } : {
              domain: selectedDomainId
            }
          }), className: "text-[12px] text-primary hover:underline", children: selectedProcessId ? "Clear process" : "Clear area" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataGrid, { columns, data: filteredCaps, rowKey: (r) => r.id, isRowActive: (r) => r.id.trim() === selectedCapability?.id?.trim(), onRowClick: (r) => navigate({
          search: {
            domain: selectedDomainId,
            area: selectedAreaId ?? r.processAreaId,
            process: selectedProcessId ?? r.processId,
            capability: r.id.trim()
          }
        }), empty: "No capabilities under this selection." })
      ] })
    ] })
  ] });
}
function HierarchyTree({
  domains,
  query,
  selectedDomainId,
  selectedAreaId,
  selectedProcessId,
  onSelectDomain,
  onSelectArea,
  onSelectProcess
}) {
  const q = query.toLowerCase().trim();
  const [openDomains, setOpenDomains] = reactExports.useState(() => new Set(selectedDomainId ? [selectedDomainId] : []));
  const [openAreas, setOpenAreas] = reactExports.useState(() => new Set(selectedAreaId ? [selectedAreaId] : []));
  reactExports.useEffect(() => {
    if (selectedDomainId) setOpenDomains((s) => s.has(selectedDomainId) ? s : new Set(s).add(selectedDomainId));
  }, [selectedDomainId]);
  reactExports.useEffect(() => {
    if (selectedAreaId) setOpenAreas((s) => s.has(selectedAreaId) ? s : new Set(s).add(selectedAreaId));
  }, [selectedAreaId]);
  const toggle = (set, setter, id) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1", children: domains.map((d) => {
    const areas = repo.areasOf(d.id);
    const did = d.id.trim();
    const isOpen = openDomains.has(did) || q.length > 0;
    if (q && !d.name.toLowerCase().includes(q) && !d.id.toLowerCase().includes(q) && !areas.some((a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))) return null;
    const totalCaps = areas.reduce((acc, a) => acc + repo.capabilitiesOfArea(a.id).length, 0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12.5px] hover:bg-surface-hover cursor-pointer", selectedDomainId === did && "bg-primary-soft text-primary"), onClick: () => onSelectDomain(did), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": isOpen ? "Collapse" : "Expand", onClick: (e) => {
          e.stopPropagation();
          toggle(openDomains, setOpenDomains, did);
        }, className: "grid place-content-center size-4 shrink-0 rounded hover:bg-surface-hover", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-3 text-muted-foreground transition-transform", isOpen && "rotate-90") }) }),
        isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "size-3.5 shrink-0 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3.5 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11.5px] font-medium text-muted-foreground", children: did }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: d.name.replace(/^[A-Z0-9]+ - /, "") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num ml-auto rounded bg-muted px-1 py-0 text-[10px] text-muted-foreground", children: totalCaps })
      ] }),
      isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 border-l border-border pl-2", children: areas.map((a) => {
        const caps = repo.capabilitiesOfArea(a.id).length;
        const procs = repo.processesOf(a.id);
        const aid = a.id.trim();
        const areaActive = selectedAreaId?.trim() === aid;
        const areaOpen = openAreas.has(aid) || q.length > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12px] text-foreground/85 hover:bg-surface-hover cursor-pointer", areaActive && "bg-primary-soft text-primary"), onClick: () => onSelectArea(did, aid), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": areaOpen ? "Collapse" : "Expand", onClick: (e) => {
              e.stopPropagation();
              toggle(openAreas, setOpenAreas, aid);
            }, className: "grid place-content-center size-4 shrink-0 rounded hover:bg-surface-hover", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-3 text-muted-foreground transition-transform", areaOpen && "rotate-90") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Workflow, { className: "size-3 shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: aid }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: a.name.replace(/^[A-Z0-9.]+ - /, "") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num ml-auto text-[10.5px] text-muted-foreground", children: caps })
          ] }),
          areaOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 border-l border-border pl-2", children: procs.map((p) => {
            const procActive = selectedProcessId?.trim() === p.id.trim();
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onSelectProcess(did, aid, p.id.trim()), className: cn("flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[12px] text-foreground/80 hover:bg-surface-hover", procActive && "bg-primary-soft text-primary"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "size-3 shrink-0 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: p.id.trim() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p.name.replace(/^[A-Z0-9.]+ - /, "") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num ml-auto text-[10.5px] text-muted-foreground", children: p.capabilityCount })
            ] }, p.id);
          }) })
        ] }, a.id);
      }) })
    ] }, d.id);
  }) });
}
function CapabilityPanel({
  capability
}) {
  const area = repo.area(capability.processAreaId);
  const domain = repo.domain(capability.processDomainId);
  const proc = repo.process(capability.processId);
  const templates = repo.templatesOf(capability.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Capability" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: capability.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: capability.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Hierarchy", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Domain", value: domain?.name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Area", value: area?.name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Process", value: proc?.name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Status", value: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: capability.status, intent: capability.status === "Active" ? "success" : "neutral" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Templates (${templates.length})`, action: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/templates", className: "text-[11.5px] text-primary hover:underline", children: "View all" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      templates.slice(0, 8).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/templates/$templateId", params: {
        templateId: String(t.id)
      }, className: "flex items-center gap-2 rounded border border-border bg-surface-2 px-2 py-1.5 hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-3.5 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: t.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[12px]", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: t.standard, className: "ml-auto" })
      ] }, t.id)),
      templates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-muted-foreground", children: "No templates linked." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/capabilities/$capabilityId", params: {
      capabilityId: capability.id.trim()
    }, className: "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90", children: "Open capability workspace" })
  ] });
}
function ProcessPanel({
  process
}) {
  const area = repo.area(process.processAreaId);
  const domain = repo.domain(process.processDomainId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Process" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: process.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: process.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Hierarchy", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Domain", value: domain?.name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Area", value: area?.name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, { label: "Owner", value: process.owner })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Composition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Capabilities", value: process.capabilityCount }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Templates", value: process.templateCount })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/processes/$processId", params: {
      processId: process.id.trim()
    }, className: "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90", children: "Open process workspace" })
  ] });
}
function DomainPanel({
  domain
}) {
  if (!domain) return null;
  const areas = repo.areasOf(domain.id);
  const procs = areas.reduce((acc, a) => acc + repo.processesOf(a.id).length, 0);
  const caps = areas.reduce((acc, a) => acc + repo.capabilitiesOfArea(a.id).length, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Domain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: domain.id.trim() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: domain.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Composition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Process Areas", value: areas.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Processes", value: procs }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Capabilities", value: caps })
    ] }) })
  ] });
}
function Section({
  title,
  action,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
      action
    ] }),
    children
  ] });
}
function Meta({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 border-b border-border/60 py-1.5 last:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right text-[12.5px]", children: value })
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
  HierarchyPage as component
};
