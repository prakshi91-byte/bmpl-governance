import { Q as reactExports, H as jsxRuntimeExports } from "./server-BGeP2W0b.mjs";
import { y as useUIStore, R as ROLE_PERMS, u as useDraftsStore, v as useNavigate, s as repo, S as STANDARD_OPTIONS, d as Plus, q as nextTemplateId, a as Link, o as createLucideIcon } from "./router-Dwu8MerC.mjs";
import { P as PageHeader } from "./PageHeader-D4xhBVAX.mjs";
import { L as Lock } from "./lock-B0fWDZZU.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const TABS = ["Capability", "Template", "Process Area"];
function CreatePage() {
  const role = useUIStore((s) => s.currentRole);
  const canEdit = ROLE_PERMS[role].canEdit;
  const [tab, setTab] = reactExports.useState("Capability");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-0 flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Create", subtitle: "Add new BPML entries — drafts persist locally and appear immediately in lists.", breadcrumbs: [{
      label: "BPML"
    }, {
      label: "Create"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t), className: "relative h-9 px-3 text-[12.5px] font-medium " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
      t,
      tab === t && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" })
    ] }, t)) }),
    !canEdit ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm rounded-md border border-border bg-surface p-6 text-center shadow-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mx-auto size-6 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-[14px] font-semibold", children: "Create restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[12.5px] text-muted-foreground", children: [
        "You're signed in as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: role }),
        ". Switch to a writer role to create entries."
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thin-scrollbar flex-1 overflow-y-auto", children: [
      tab === "Capability" && /* @__PURE__ */ jsxRuntimeExports.jsx(CapabilityForm, {}),
      tab === "Template" && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateForm, {}),
      tab === "Process Area" && /* @__PURE__ */ jsxRuntimeExports.jsx(AreaForm, {})
    ] })
  ] });
}
function AreaForm() {
  const domains = repo.domains();
  const addArea = useDraftsStore((s) => s.addArea);
  const navigate = useNavigate();
  const [domainId, setDomainId] = reactExports.useState(domains[0]?.id ?? "");
  const [shortCode, setShortCode] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [saved, setSaved] = reactExports.useState(null);
  const fullId = reactExports.useMemo(() => {
    const c = shortCode.trim().toUpperCase();
    if (!domainId || !c) return "";
    return `${domainId}.${c}`;
  }, [domainId, shortCode]);
  function submit() {
    setError(null);
    if (!fullId) return setError("Domain and short code are required.");
    if (!name.trim()) return setError("Name is required.");
    if (repo.area(fullId)) return setError(`Area ${fullId} already exists.`);
    const area = {
      id: fullId,
      name: `${fullId} - ${name.trim()}`,
      processDomainId: domainId
    };
    addArea(area);
    setSaved(fullId);
    setShortCode("");
    setName("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FormShell, { title: "New Process Area", preview: fullId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { children: fullId }) : null, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Process Domain", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: domainId, onChange: (e) => setDomainId(e.target.value), className: inputCls, children: domains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d.id, children: d.name }, d.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Short code", required: true, hint: "Appended after the domain. E.g. '15.NEW' → A2R.15.NEW", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shortCode, onChange: (e) => setShortCode(e.target.value), placeholder: "15.NEW", className: inputCls }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "New Process Area", className: inputCls }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormActions, { error, saved: saved && `Process area ${saved} created.`, onSubmit: submit, extra: saved && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
      to: "/hierarchy",
      search: {
        domain: domainId,
        area: saved
      }
    }), className: btnSecondary, children: "Open in hierarchy" }) })
  ] });
}
function CapabilityForm() {
  const domains = repo.domains();
  const addCapability = useDraftsStore((s) => s.addCapability);
  const navigate = useNavigate();
  const [domainId, setDomainId] = reactExports.useState(domains[0]?.id ?? "");
  const areas = reactExports.useMemo(() => repo.areasOf(domainId), [domainId]);
  const [areaId, setAreaId] = reactExports.useState(areas[0]?.id ?? "");
  const procs = reactExports.useMemo(() => repo.processesOf(areaId), [areaId]);
  const [processId, setProcessId] = reactExports.useState(procs[0]?.id ?? "");
  const [shortCode, setShortCode] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("Draft");
  const [error, setError] = reactExports.useState(null);
  const [saved, setSaved] = reactExports.useState(null);
  const effectiveAreaId = areaId || areas[0]?.id;
  const effectiveProcessId = processId || procs[0]?.id;
  const fullId = reactExports.useMemo(() => {
    const c = shortCode.trim();
    if (!effectiveProcessId || !c) return "";
    return `${effectiveProcessId}.${c}`;
  }, [effectiveProcessId, shortCode]);
  function submit() {
    setError(null);
    if (!effectiveProcessId) return setError("Select a process.");
    if (!fullId) return setError("Short code is required (e.g. 0000).");
    if (!name.trim()) return setError("Name is required.");
    if (repo.capability(fullId)) return setError(`Capability ${fullId} already exists.`);
    const cap = {
      id: fullId,
      name: name.trim(),
      processId: effectiveProcessId,
      processAreaId: effectiveAreaId,
      processDomainId: domainId,
      status,
      templateCount: 0
    };
    addCapability(cap);
    setSaved(fullId);
    setShortCode("");
    setName("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FormShell, { title: "New Capability", preview: fullId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { children: fullId }) : null, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Process Domain", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: domainId, onChange: (e) => {
        setDomainId(e.target.value);
        setAreaId("");
        setProcessId("");
      }, className: inputCls, children: domains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d.id, children: d.name }, d.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Process Area", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: effectiveAreaId, onChange: (e) => {
        setAreaId(e.target.value);
        setProcessId("");
      }, className: inputCls, children: [
        areas.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— No areas —" }),
        areas.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.name }, a.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Process", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: effectiveProcessId, onChange: (e) => setProcessId(e.target.value), className: inputCls, children: [
        procs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— No processes —" }),
        procs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
          p.id.trim(),
          " — ",
          p.name.replace(/^[A-Z0-9.]+\s*-\s*/, "")
        ] }, p.id))
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Short code", required: true, hint: "Appended after the process. E.g. '0001' → A2R.1000.0001", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: shortCode, onChange: (e) => setShortCode(e.target.value), placeholder: "0001", className: inputCls }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Capability name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Manage Vendor Invoice Postings", className: inputCls }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: inputCls, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Draft" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Active" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Under Review" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormActions, { error, saved: saved && `Capability ${saved} created.`, onSubmit: submit, extra: saved && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
      to: "/capabilities/$capabilityId",
      params: {
        capabilityId: saved
      }
    }), className: btnSecondary, children: "Open capability" }) })
  ] });
}
function TemplateForm() {
  const addTemplate = useDraftsStore((s) => s.addTemplate);
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [standard, setStandard] = reactExports.useState(STANDARD_OPTIONS[0] ?? "YES/Global");
  const [capQuery, setCapQuery] = reactExports.useState("");
  const [selectedCaps, setSelectedCaps] = reactExports.useState([]);
  const [steps, setSteps] = reactExports.useState([{
    name: "",
    transaction: "",
    standard,
    status: "Active"
  }]);
  const [error, setError] = reactExports.useState(null);
  const [saved, setSaved] = reactExports.useState(null);
  const allCaps = repo.capabilities();
  const capMatches = reactExports.useMemo(() => {
    const q = capQuery.toLowerCase().trim();
    if (!q) return [];
    return allCaps.filter((c) => !selectedCaps.includes(c.id) && (c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))).slice(0, 8);
  }, [allCaps, capQuery, selectedCaps]);
  function submit() {
    setError(null);
    if (!name.trim()) return setError("Template name is required.");
    const cleanSteps = steps.filter((s) => s.name.trim());
    const id = nextTemplateId();
    const tpl = {
      id,
      name: name.trim(),
      standard,
      capabilityIds: [...selectedCaps],
      stepCount: cleanSteps.length
    };
    const stepRows = cleanSteps.map((s, i) => ({
      templateId: id,
      seq: (i + 1) * 10,
      name: s.name.trim(),
      transaction: s.transaction.trim() || "—",
      standard: s.standard || standard,
      status: s.status || "Active"
    }));
    addTemplate({
      tpl,
      capabilityIds: selectedCaps,
      steps: stepRows
    });
    setSaved(id);
    setName("");
    setSelectedCaps([]);
    setSteps([{
      name: "",
      transaction: "",
      standard,
      status: "Active"
    }]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FormShell, { title: "New Capability Template", preview: /* @__PURE__ */ jsxRuntimeExports.jsxs(Pill, { children: [
    "#",
    nextTemplateId()
  ] }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-[1fr_220px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Template name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Three-Way Match Invoice Posting", className: inputCls }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Standardization", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: standard, onChange: (e) => setStandard(e.target.value), className: inputCls, children: STANDARD_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Linked capabilities", hint: "Search by capability ID or name; select multiple.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-surface-2 p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex flex-wrap gap-1", children: [
        selectedCaps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-muted-foreground", children: "No capabilities linked yet." }),
        selectedCaps.map((id) => {
          const c = repo.capability(id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-primary-soft px-1.5 py-0.5 text-[11.5px] text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: id.trim() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden max-w-[160px] truncate sm:inline", children: c?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCaps((p) => p.filter((x) => x !== id)), className: "hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }) })
          ] }, id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: capQuery, onChange: (e) => setCapQuery(e.target.value), placeholder: "Search capability…", className: inputCls }),
        capMatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 top-9 z-10 max-h-64 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-pop", children: capMatches.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setSelectedCaps((p) => [...p, c.id]);
          setCapQuery("");
        }, className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12.5px] hover:bg-surface-hover", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground", children: c.id.trim() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: c.name })
        ] }, c.id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Steps", hint: "Empty step rows are ignored on save.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-md border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[12.5px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-surface-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wide text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-12 px-2 py-1.5", children: "Seq" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5", children: "Step name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-32 px-2 py-1.5", children: "SAP Tx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-40 px-2 py-1.5", children: "Standardization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-2 py-1 text-muted-foreground", children: (i + 1) * 10 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: s.name, onChange: (e) => updateStep(setSteps, i, {
            name: e.target.value
          }), placeholder: "Post invoice", className: inputCls }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: s.transaction, onChange: (e) => updateStep(setSteps, i, {
            transaction: e.target.value
          }), placeholder: "MIRO", className: inputCls }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: s.standard, onChange: (e) => updateStep(setSteps, i, {
            standard: e.target.value
          }), className: inputCls, children: STANDARD_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1 py-1 text-right", children: steps.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSteps((p) => p.filter((_, idx) => idx !== i)), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSteps((p) => [...p, {
        name: "",
        transaction: "",
        standard,
        status: "Active"
      }]), className: "flex w-full items-center justify-center gap-1 border-t border-border bg-surface-2 py-1.5 text-[12px] font-medium text-primary hover:bg-surface-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
        " Add step"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormActions, { error, saved: saved !== null && `Template #${saved} created.`, onSubmit: submit, extra: saved !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
      to: "/templates/$templateId",
      params: {
        templateId: String(saved)
      }
    }), className: btnSecondary, children: "Open template" }) })
  ] });
}
function updateStep(set, i, patch) {
  set((p) => p.map((s, idx) => idx === i ? {
    ...s,
    ...patch
  } : s));
}
const inputCls = "h-8 w-full rounded-md border border-border bg-surface px-2 text-[12.5px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";
const btnPrimary = "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90";
const btnSecondary = "inline-flex items-center justify-center rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium hover:bg-surface-hover";
function FormShell({
  title,
  preview,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[14px] font-semibold", children: title }),
      preview
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 rounded-md border border-border bg-surface p-4 shadow-panel", children })
  ] });
}
function Field({
  label,
  hint,
  required,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px] font-medium", children: [
        label,
        required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 text-destructive", children: "*" })
      ] }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: hint })
    ] }),
    children
  ] });
}
function Pill({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num rounded bg-primary-soft px-2 py-0.5 text-[11.5px] font-medium text-primary", children });
}
function FormActions({
  error,
  saved,
  onSubmit,
  extra
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-[12px]", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: error }),
      !error && saved && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-emerald-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
        " ",
        saved
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      extra,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/hierarchy", className: btnSecondary, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSubmit, className: btnPrimary, children: "Create" })
    ] })
  ] });
}
export {
  CreatePage as component
};
