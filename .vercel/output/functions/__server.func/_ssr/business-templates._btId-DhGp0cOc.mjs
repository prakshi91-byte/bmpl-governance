import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { j as Route$4, w as useRightPanel, n as cn, s as repo, a as Link, o as createLucideIcon } from "./router-Dwu8MerC.mjs";
import { P as PageHeader, C as ChevronRight } from "./PageHeader-D4xhBVAX.mjs";
import { a as StatusBadge, S as StandardizationBadge } from "./Badges-CxMpVJX7.mjs";
import { C as Check } from "./check-YAhLmVs-.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function buildTree(templates) {
  const root = /* @__PURE__ */ new Map();
  const orphan = [];
  for (const t of templates) {
    const caps = repo.capabilitiesOfTemplate(t.id);
    const seen = /* @__PURE__ */ new Set();
    let placed = false;
    for (const c of caps) {
      const proc = repo.process(c.processId);
      const area = proc ? repo.area(proc.processAreaId) : void 0;
      const domain = area ? repo.domain(area.processDomainId) : void 0;
      if (!domain || !area || !proc) continue;
      const key = `${domain.id}>${area.id}>${proc.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let d = root.get(domain.id);
      if (!d) {
        d = {
          id: domain.id,
          name: domain.name,
          areas: /* @__PURE__ */ new Map()
        };
        root.set(domain.id, d);
      }
      let a = d.areas.get(area.id);
      if (!a) {
        a = {
          id: area.id,
          name: area.name,
          processes: /* @__PURE__ */ new Map()
        };
        d.areas.set(area.id, a);
      }
      let p = a.processes.get(proc.id);
      if (!p) {
        p = {
          id: proc.id,
          name: proc.name,
          templates: []
        };
        a.processes.set(proc.id, p);
      }
      p.templates.push(t);
      placed = true;
    }
    if (!placed) orphan.push(t);
  }
  return {
    domains: Array.from(root.values()),
    orphan
  };
}
function filterTree(tree, q) {
  if (!q) return tree;
  const ql = q.toLowerCase();
  const match = (s) => s.toLowerCase().includes(ql);
  const domains = [];
  for (const d of tree.domains) {
    const dHit = match(d.id) || match(d.name);
    const areas = /* @__PURE__ */ new Map();
    for (const a of d.areas.values()) {
      const aHit = match(a.id) || match(a.name);
      const procs = /* @__PURE__ */ new Map();
      for (const p of a.processes.values()) {
        const pHit = match(p.id) || match(p.name);
        const ts = dHit || aHit || pHit ? p.templates : p.templates.filter((t) => match(t.name) || match(String(t.id)));
        if (ts.length) procs.set(p.id, {
          ...p,
          templates: ts
        });
      }
      if (procs.size) areas.set(a.id, {
        ...a,
        processes: procs
      });
    }
    if (areas.size) domains.push({
      ...d,
      areas
    });
  }
  const orphan = tree.orphan.filter((t) => match(t.name) || match(String(t.id)));
  return {
    domains,
    orphan
  };
}
function collectIds(node) {
  if ("templates" in node) return node.templates.map((t) => t.id);
  if ("processes" in node) return Array.from(node.processes.values()).flatMap(collectIds);
  return Array.from(node.areas.values()).flatMap(collectIds);
}
function TriCheck({
  state,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { onClick, className: cn("grid size-4 shrink-0 cursor-pointer place-items-center rounded border", state === "all" ? "border-primary bg-primary text-primary-foreground" : state === "some" ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-primary"), children: [
    state === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
    state === "some" && /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "size-3" })
  ] });
}
function BTDetail() {
  const {
    bt
  } = Route$4.useLoaderData();
  const [picker, setPicker] = reactExports.useState(/* @__PURE__ */ new Set());
  const [q, setQ] = reactExports.useState("");
  const [openD, setOpenD] = reactExports.useState(/* @__PURE__ */ new Set());
  const [openA, setOpenA] = reactExports.useState(/* @__PURE__ */ new Set());
  const [openP, setOpenP] = reactExports.useState(/* @__PURE__ */ new Set());
  const fullTree = reactExports.useMemo(() => buildTree(repo.templates()), []);
  const tree = reactExports.useMemo(() => filterTree(fullTree, q), [fullTree, q]);
  const searching = q.length > 0;
  const toggleSet = (s, setS, k) => {
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    setS(n);
  };
  const setMany = (ids, on) => {
    setPicker((p) => {
      const n = new Set(p);
      for (const id of ids) on ? n.add(id) : n.delete(id);
      return n;
    });
  };
  const stateOf = (ids) => {
    let c = 0;
    for (const id of ids) if (picker.has(id)) c++;
    return c === 0 ? "none" : c === ids.length ? "all" : "some";
  };
  useRightPanel(/* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Business Template" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[11px] text-muted-foreground", children: bt.id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[14.5px] font-semibold leading-snug", children: bt.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-[12px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Templates", value: picker.size }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Level", value: bt.level.split(" ")[0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Product Grp", value: bt.productGroup }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Geo", value: bt.geoScope })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-2 text-[12px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Readiness" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 flex-1 overflow-hidden rounded bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-std-global", style: {
          width: `${Math.min(100, picker.size * 4)}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num", children: [
          Math.min(100, picker.size * 4),
          "%"
        ] })
      ] })
    ] })
  ] }), [bt.id, picker.size]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-primary", children: bt.id }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: bt.name })
    ] }), breadcrumbs: [{
      label: "Rollout"
    }, {
      label: "Business Templates",
      to: "/business-templates"
    }, {
      label: bt.id
    }], meta: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: bt.level, intent: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: bt.productGroup }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: bt.geoScope }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        picker.size,
        " templates"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-h-0 flex-1 grid-cols-2 gap-px bg-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-col bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 items-center justify-between border-b border-border bg-surface-2 px-3 text-[12px] font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Process hierarchy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-[11px] font-normal text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "hover:text-foreground", onClick: () => {
              setOpenD(new Set(fullTree.domains.map((d) => d.id)));
              setOpenA(new Set(fullTree.domains.flatMap((d) => Array.from(d.areas.keys()))));
              setOpenP(new Set(fullTree.domains.flatMap((d) => Array.from(d.areas.values()).flatMap((a) => Array.from(a.processes.keys())))));
            }, children: "Expand all" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "hover:text-foreground", onClick: () => {
              setOpenD(/* @__PURE__ */ new Set());
              setOpenA(/* @__PURE__ */ new Set());
              setOpenP(/* @__PURE__ */ new Set());
            }, children: "Collapse" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Filter by domain, area, process or template…", className: "m-2 h-8 rounded-md border border-border bg-surface px-2 text-[13px] outline-none focus:border-ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar flex-1 overflow-y-auto pb-2", children: [
          tree.domains.map((d) => {
            const dIds = collectIds(d);
            const dOpen = searching || openD.has(d.id);
            const dState = stateOf(dIds);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1 hover:bg-surface-hover", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleSet(openD, setOpenD, d.id), className: "grid size-4 shrink-0 place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-3.5 transition-transform", dOpen && "rotate-90") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriCheck, { state: dState, onClick: (e) => {
                  e.stopPropagation();
                  setMany(dIds, dState !== "all");
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: d.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[12.5px] font-semibold", children: d.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto num text-[10.5px] text-muted-foreground", children: [
                  dIds.filter((id) => picker.has(id)).length,
                  "/",
                  dIds.length
                ] })
              ] }),
              dOpen && Array.from(d.areas.values()).map((a) => {
                const aIds = collectIds(a);
                const aOpen = searching || openA.has(a.id);
                const aState = stateOf(aIds);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 py-0.5 pl-6 pr-2 hover:bg-surface-hover", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleSet(openA, setOpenA, a.id), className: "grid size-4 shrink-0 place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-3.5 transition-transform", aOpen && "rotate-90") }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriCheck, { state: aState, onClick: (e) => {
                      e.stopPropagation();
                      setMany(aIds, aState !== "all");
                    } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: a.id }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[12px] font-medium", children: a.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto num text-[10.5px] text-muted-foreground", children: [
                      aIds.filter((id) => picker.has(id)).length,
                      "/",
                      aIds.length
                    ] })
                  ] }),
                  aOpen && Array.from(a.processes.values()).map((p) => {
                    const pIds = p.templates.map((t) => t.id);
                    const pOpen = searching || openP.has(p.id);
                    const pState = stateOf(pIds);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 py-0.5 pl-12 pr-2 hover:bg-surface-hover", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleSet(openP, setOpenP, p.id), className: "grid size-4 shrink-0 place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-3.5 transition-transform", pOpen && "rotate-90") }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriCheck, { state: pState, onClick: (e) => {
                          e.stopPropagation();
                          setMany(pIds, pState !== "all");
                        } }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: p.id }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[12px]", children: p.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto num text-[10.5px] text-muted-foreground", children: [
                          pIds.filter((id) => picker.has(id)).length,
                          "/",
                          pIds.length
                        ] })
                      ] }),
                      pOpen && p.templates.map((t) => {
                        const sel = picker.has(t.id);
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMany([t.id], !sel), className: cn("flex w-full items-center gap-1.5 py-1 pl-[4.5rem] pr-2 text-left text-[12.5px] hover:bg-surface-hover", sel && "bg-primary-soft/40"), children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TriCheck, { state: sel ? "all" : "none", onClick: (e) => {
                            e.stopPropagation();
                            setMany([t.id], !sel);
                          } }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[10.5px] text-muted-foreground", children: t.id }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: t.standard, className: "ml-auto" })
                        ] }, `${p.id}-${t.id}`);
                      })
                    ] }, p.id);
                  })
                ] }, a.id);
              })
            ] }, d.id);
          }),
          tree.domains.length === 0 && tree.orphan.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-[12.5px] text-muted-foreground", children: "No matches." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-col bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 items-center gap-2 border-b border-border bg-surface-2 px-3 text-[12px] font-semibold", children: [
          "Assigned (",
          picker.size,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar flex-1 overflow-y-auto", children: [
          Array.from(picker).map((id) => {
            const t = repo.template(id);
            if (!t) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/templates/$templateId", params: {
              templateId: String(id)
            }, className: "flex items-start gap-2 border-b border-border/60 px-3 py-1.5 text-[12.5px] hover:bg-surface-hover", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-[11px] text-muted-foreground", children: t.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: t.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StandardizationBadge, { value: t.standard, className: "ml-auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hierarchy, { templateId: t.id })
            ] }) }, id);
          }),
          picker.size === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-[12.5px] text-muted-foreground", children: "No templates assigned." })
        ] })
      ] })
    ] })
  ] });
}
function Hierarchy({
  templateId
}) {
  const caps = repo.capabilitiesOfTemplate(templateId);
  const seen = /* @__PURE__ */ new Set();
  const crumbs = [];
  for (const c of caps) {
    const proc = repo.process(c.processId);
    const area = proc ? repo.area(proc.processAreaId) : void 0;
    const domain = area ? repo.domain(area.processDomainId) : void 0;
    const key = `${domain?.id ?? ""}>${area?.id ?? ""}>${proc?.id ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    crumbs.push({
      domain: domain?.name,
      area: area?.name,
      process: proc?.name,
      key
    });
  }
  if (crumbs.length === 0) return null;
  const first = crumbs[0];
  const extra = crumbs.length - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground", children: [
    first.domain && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: first.domain }),
    first.area && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: first.area })
    ] }),
    first.process && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: first.process })
    ] }),
    extra > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 rounded bg-muted px-1 num", children: [
      "+",
      extra
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-0.5 text-[14px] font-semibold", children: value })
  ] });
}
export {
  BTDetail as component
};
