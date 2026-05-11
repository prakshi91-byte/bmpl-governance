import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { repo, nextTemplateId, STANDARD_OPTIONS, type ProcessArea, type ProcessCapability, type Template, type TemplateStep } from "@/data/repo";
import { useDraftsStore } from "@/stores/drafts-store";
import { useUIStore, ROLE_PERMS } from "@/stores/ui-store";
import { Lock, Plus, Trash2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create — BPML Governance" },
      { name: "description", content: "Create new process areas, capabilities, and capability templates." },
    ],
  }),
  component: CreatePage,
});

const TABS = ["Capability", "Template", "Process Area"] as const;
type Tab = (typeof TABS)[number];

function CreatePage() {
  const role = useUIStore((s) => s.currentRole);
  const canEdit = ROLE_PERMS[role].canEdit;
  const [tab, setTab] = useState<Tab>("Capability");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Create"
        subtitle="Add new BPML entries — drafts persist locally and appear immediately in lists."
        breadcrumbs={[{ label: "BPML" }, { label: "Create" }]}
      />
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "relative h-9 px-3 text-[12.5px] font-medium " +
              (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")
            }
          >
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" />}
          </button>
        ))}
      </div>
      {!canEdit ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-sm rounded-md border border-border bg-surface p-6 text-center shadow-panel">
            <Lock className="mx-auto size-6 text-muted-foreground" />
            <h2 className="mt-2 text-[14px] font-semibold">Create restricted</h2>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              You're signed in as <span className="font-medium text-foreground">{role}</span>. Switch to a writer role to create entries.
            </p>
          </div>
        </div>
      ) : (
        <div className="thin-scrollbar flex-1 overflow-y-auto">
          {tab === "Capability" && <CapabilityForm />}
          {tab === "Template" && <TemplateForm />}
          {tab === "Process Area" && <AreaForm />}
        </div>
      )}
    </div>
  );
}

/* ---------------- Process Area ---------------- */
function AreaForm() {
  const domains = repo.domains();
  const addArea = useDraftsStore((s) => s.addArea);
  const navigate = useNavigate();
  const [domainId, setDomainId] = useState(domains[0]?.id ?? "");
  const [shortCode, setShortCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const fullId = useMemo(() => {
    const c = shortCode.trim().toUpperCase();
    if (!domainId || !c) return "";
    return `${domainId}.${c}`;
  }, [domainId, shortCode]);

  function submit() {
    setError(null);
    if (!fullId) return setError("Domain and short code are required.");
    if (!name.trim()) return setError("Name is required.");
    if (repo.area(fullId)) return setError(`Area ${fullId} already exists.`);
    const area: ProcessArea = { id: fullId, name: `${fullId} - ${name.trim()}`, processDomainId: domainId };
    addArea(area);
    setSaved(fullId);
    setShortCode("");
    setName("");
  }

  return (
    <FormShell title="New Process Area" preview={fullId ? <Pill>{fullId}</Pill> : null}>
      <Field label="Process Domain" required>
        <select value={domainId} onChange={(e) => setDomainId(e.target.value)} className={inputCls}>
          {domains.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Short code" required hint="Appended after the domain. E.g. '15.NEW' → A2R.15.NEW">
        <input value={shortCode} onChange={(e) => setShortCode(e.target.value)} placeholder="15.NEW" className={inputCls} />
      </Field>
      <Field label="Name" required>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Process Area" className={inputCls} />
      </Field>
      <FormActions error={error} saved={saved && `Process area ${saved} created.`} onSubmit={submit} extra={
        saved && (
          <button onClick={() => navigate({ to: "/hierarchy", search: { domain: domainId, area: saved } as any })} className={btnSecondary}>
            Open in hierarchy
          </button>
        )
      } />
    </FormShell>
  );
}

/* ---------------- Capability ---------------- */
function CapabilityForm() {
  const domains = repo.domains();
  const addCapability = useDraftsStore((s) => s.addCapability);
  const navigate = useNavigate();
  const [domainId, setDomainId] = useState(domains[0]?.id ?? "");
  const areas = useMemo(() => repo.areasOf(domainId), [domainId]);
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const [shortCode, setShortCode] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("Draft");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const effectiveAreaId = areaId || areas[0]?.id;
  const fullId = useMemo(() => {
    const c = shortCode.trim().toUpperCase();
    if (!effectiveAreaId || !c) return "";
    return `${effectiveAreaId}.${c}`;
  }, [effectiveAreaId, shortCode]);

  function submit() {
    setError(null);
    if (!effectiveAreaId) return setError("Select a process area.");
    if (!fullId) return setError("Short code is required.");
    if (!name.trim()) return setError("Name is required.");
    if (!owner.trim()) return setError("Owner is required.");
    if (repo.process(fullId)) return setError(`Capability ${fullId} already exists.`);
    const cap: ProcessCapability = {
      id: fullId,
      name: name.trim(),
      processAreaId: effectiveAreaId,
      processDomainId: domainId,
      owner: owner.trim(),
      templateCount: 0,
      deployments: 0,
      status,
    };
    addCapability(cap);
    setSaved(fullId);
    setShortCode("");
    setName("");
  }

  return (
    <FormShell title="New Capability" preview={fullId ? <Pill>{fullId}</Pill> : null}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Process Domain" required>
          <select value={domainId} onChange={(e) => { setDomainId(e.target.value); setAreaId(""); }} className={inputCls}>
            {domains.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
        </Field>
        <Field label="Process Area" required>
          <select value={effectiveAreaId} onChange={(e) => setAreaId(e.target.value)} className={inputCls}>
            {areas.length === 0 && <option value="">— No areas in this domain —</option>}
            {areas.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
          </select>
        </Field>
      </div>
      <Field label="Short code" required hint="Appended after the area. E.g. '0500'">
        <input value={shortCode} onChange={(e) => setShortCode(e.target.value)} placeholder="0500" className={inputCls} />
      </Field>
      <Field label="Capability name" required>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Manage Vendor Invoice Postings" className={inputCls} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Owner" required>
          <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Anna Janssen" className={inputCls} />
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
            <option>Draft</option>
            <option>Active</option>
            <option>Under Review</option>
          </select>
        </Field>
      </div>
      <FormActions error={error} saved={saved && `Capability ${saved} created.`} onSubmit={submit} extra={
        saved && (
          <button onClick={() => navigate({ to: "/capabilities/$capabilityId", params: { capabilityId: saved } })} className={btnSecondary}>
            Open capability
          </button>
        )
      } />
    </FormShell>
  );
}

/* ---------------- Template ---------------- */
interface StepDraft { name: string; transaction: string; standard: string; status: string; }

function TemplateForm() {
  const addTemplate = useDraftsStore((s) => s.addTemplate);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [standard, setStandard] = useState(STANDARD_OPTIONS[0] ?? "YES/Global");
  const [capQuery, setCapQuery] = useState("");
  const [selectedCaps, setSelectedCaps] = useState<string[]>([]);
  const [steps, setSteps] = useState<StepDraft[]>([{ name: "", transaction: "", standard, status: "Active" }]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  const allCaps = repo.processes();
  const capMatches = useMemo(() => {
    const q = capQuery.toLowerCase().trim();
    if (!q) return [];
    return allCaps
      .filter((c) => !selectedCaps.includes(c.id) && (c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [allCaps, capQuery, selectedCaps]);

  function submit() {
    setError(null);
    if (!name.trim()) return setError("Template name is required.");
    const cleanSteps = steps.filter((s) => s.name.trim());
    const id = nextTemplateId();
    const tpl: Template = {
      id,
      name: name.trim(),
      standard,
      processIds: [...selectedCaps],
      stepCount: cleanSteps.length,
    };
    const stepRows: TemplateStep[] = cleanSteps.map((s, i) => ({
      templateId: id,
      seq: (i + 1) * 10,
      name: s.name.trim(),
      transaction: s.transaction.trim() || "—",
      standard: s.standard || standard,
      status: s.status || "Active",
    }));
    addTemplate({ tpl, processIds: selectedCaps, steps: stepRows });
    setSaved(id);
    setName("");
    setSelectedCaps([]);
    setSteps([{ name: "", transaction: "", standard, status: "Active" }]);
  }

  return (
    <FormShell title="New Capability Template" preview={<Pill>#{nextTemplateId()}</Pill>}>
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <Field label="Template name" required>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Three-Way Match Invoice Posting" className={inputCls} />
        </Field>
        <Field label="Standardization">
          <select value={standard} onChange={(e) => setStandard(e.target.value)} className={inputCls}>
            {STANDARD_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </Field>
      </div>

      <Field label="Linked capabilities" hint="Search by capability ID or name; select multiple.">
        <div className="rounded-md border border-border bg-surface-2 p-2">
          <div className="mb-2 flex flex-wrap gap-1">
            {selectedCaps.length === 0 && <span className="text-[12px] text-muted-foreground">No capabilities linked yet.</span>}
            {selectedCaps.map((id) => {
              const c = repo.process(id);
              return (
                <span key={id} className="inline-flex items-center gap-1 rounded bg-primary-soft px-1.5 py-0.5 text-[11.5px] text-primary">
                  <span className="num">{id.trim()}</span>
                  <span className="hidden max-w-[160px] truncate sm:inline">{c?.name}</span>
                  <button onClick={() => setSelectedCaps((p) => p.filter((x) => x !== id))} className="hover:text-foreground">
                    <Trash2 className="size-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="relative">
            <input value={capQuery} onChange={(e) => setCapQuery(e.target.value)} placeholder="Search capability…" className={inputCls} />
            {capMatches.length > 0 && (
              <div className="absolute left-0 right-0 top-9 z-10 max-h-64 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-pop">
                {capMatches.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setSelectedCaps((p) => [...p, c.id]); setCapQuery(""); }}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12.5px] hover:bg-surface-hover"
                  >
                    <span className="num shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10.5px] text-muted-foreground">{c.id.trim()}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Field>

      <Field label="Steps" hint="Empty step rows are ignored on save.">
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-2">
              <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="w-12 px-2 py-1.5">Seq</th>
                <th className="px-2 py-1.5">Step name</th>
                <th className="w-32 px-2 py-1.5">SAP Tx</th>
                <th className="w-40 px-2 py-1.5">Standardization</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="num px-2 py-1 text-muted-foreground">{(i + 1) * 10}</td>
                  <td className="px-1 py-1">
                    <input value={s.name} onChange={(e) => updateStep(setSteps, i, { name: e.target.value })} placeholder="Post invoice" className={inputCls} />
                  </td>
                  <td className="px-1 py-1">
                    <input value={s.transaction} onChange={(e) => updateStep(setSteps, i, { transaction: e.target.value })} placeholder="MIRO" className={inputCls} />
                  </td>
                  <td className="px-1 py-1">
                    <select value={s.standard} onChange={(e) => updateStep(setSteps, i, { standard: e.target.value })} className={inputCls}>
                      {STANDARD_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </td>
                  <td className="px-1 py-1 text-right">
                    {steps.length > 1 && (
                      <button onClick={() => setSteps((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setSteps((p) => [...p, { name: "", transaction: "", standard, status: "Active" }])}
            className="flex w-full items-center justify-center gap-1 border-t border-border bg-surface-2 py-1.5 text-[12px] font-medium text-primary hover:bg-surface-hover"
          >
            <Plus className="size-3.5" /> Add step
          </button>
        </div>
      </Field>

      <FormActions error={error} saved={saved !== null && `Template #${saved} created.`} onSubmit={submit} extra={
        saved !== null && (
          <button onClick={() => navigate({ to: "/templates/$templateId", params: { templateId: String(saved) } })} className={btnSecondary}>
            Open template
          </button>
        )
      } />
    </FormShell>
  );
}

function updateStep(set: React.Dispatch<React.SetStateAction<StepDraft[]>>, i: number, patch: Partial<StepDraft>) {
  set((p) => p.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
}

/* ---------------- Shared form primitives ---------------- */
const inputCls =
  "h-8 w-full rounded-md border border-border bg-surface px-2 text-[12.5px] outline-none focus:border-ring focus:ring-2 focus:ring-ring/20";
const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:opacity-90";
const btnSecondary =
  "inline-flex items-center justify-center rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium hover:bg-surface-hover";

function FormShell({ title, preview, children }: { title: string; preview?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">{title}</h2>
        {preview}
      </div>
      <div className="space-y-3 rounded-md border border-border bg-surface p-4 shadow-panel">{children}</div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[12px] font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="num rounded bg-primary-soft px-2 py-0.5 text-[11.5px] font-medium text-primary">{children}</span>;
}

function FormActions({
  error,
  saved,
  onSubmit,
  extra,
}: {
  error: string | null;
  saved: string | false | null;
  onSubmit: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
      <div className="min-w-0 text-[12px]">
        {error && <span className="text-destructive">{error}</span>}
        {!error && saved && (
          <span className="inline-flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="size-3.5" /> {saved}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <Link to="/hierarchy" className={btnSecondary}>Cancel</Link>
        <button onClick={onSubmit} className={btnPrimary}>Create</button>
      </div>
    </div>
  );
}
