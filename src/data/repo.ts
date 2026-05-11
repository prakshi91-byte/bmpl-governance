import {
  processDomains,
  processAreas,
  processes,
  capabilities,
  templates,
  templateSteps,
  capabilityTemplateLinks,
  businessTemplates,
  businessTemplateScope,
  projects,
  projectScope,
  coverageCells,
  entities,
  users,
  roles,
  productGroups,
  businessTemplateLevels,
  geographicalScope,
} from "./bpml.generated";
import type {
  ProcessDomain,
  ProcessArea,
  Process,
  Capability,
  Template,
  TemplateStep,
  BusinessTemplate,
  BusinessTemplateScopeRow,
  Project,
  ProjectScopeRow,
  CoverageCell,
  Entity,
  User,
  Role,
  RoleId,
  StandardizationStatus,
  CoverageState,
} from "./bpml.generated";

export type {
  ProcessDomain,
  ProcessArea,
  Process,
  Capability,
  Template,
  TemplateStep,
  BusinessTemplate,
  BusinessTemplateScopeRow,
  Project,
  ProjectScopeRow,
  CoverageCell,
  Entity,
  User,
  Role,
  RoleId,
  StandardizationStatus,
  CoverageState,
};

// ---------- Indexed lookups ----------
const trim = (v: string) => v.trim();
const domainById = new Map(processDomains.map((d) => [trim(d.id), d]));
const areaById = new Map(processAreas.map((a) => [trim(a.id), a]));
const processById = new Map(processes.map((p) => [trim(p.id), p]));
const capabilityById = new Map(capabilities.map((c) => [trim(c.id), c]));
const templateById = new Map(templates.map((t) => [t.id, t]));

const areasByDomain = new Map<string, ProcessArea[]>();
for (const a of processAreas) push(areasByDomain, trim(a.processDomainId), a);

const processesByArea = new Map<string, Process[]>();
for (const p of processes) push(processesByArea, trim(p.processAreaId), p);

const capabilitiesByProcess = new Map<string, Capability[]>();
const capabilitiesByArea = new Map<string, Capability[]>();
for (const c of capabilities) {
  push(capabilitiesByProcess, trim(c.processId), c);
  push(capabilitiesByArea, trim(c.processAreaId), c);
}

const templatesByCapability = new Map<string, number[]>();
const capabilitiesByTemplate = new Map<number, string[]>();
for (const link of capabilityTemplateLinks) {
  push(templatesByCapability, trim(link.capabilityId), link.templateId);
  push(capabilitiesByTemplate, link.templateId, trim(link.capabilityId));
}

const stepsByTemplate = new Map<number, TemplateStep[]>();
for (const s of templateSteps) push(stepsByTemplate, s.templateId, s);

const btScopeByBT = new Map<string, BusinessTemplateScopeRow[]>();
for (const r of businessTemplateScope) push(btScopeByBT, r.businessTemplateId, r);

const projectScopeByProject = new Map<string, ProjectScopeRow[]>();
for (const r of projectScope) push(projectScopeByProject, r.projectId, r);

const coverageByArea = new Map<string, CoverageCell[]>();
for (const c of coverageCells) push(coverageByArea, trim(c.processAreaId), c);

function push<K, V>(m: Map<K, V[]>, k: K, v: V) {
  const arr = m.get(k) ?? [];
  arr.push(v);
  m.set(k, arr);
}

// ---------- Mutators (drafts) ----------
export function addAreaToRepo(a: ProcessArea) {
  if (areaById.has(trim(a.id))) return;
  processAreas.push(a);
  areaById.set(trim(a.id), a);
  push(areasByDomain, trim(a.processDomainId), a);
}
export function addProcessToRepo(p: Process) {
  if (processById.has(trim(p.id))) return;
  processes.push(p);
  processById.set(trim(p.id), p);
  push(processesByArea, trim(p.processAreaId), p);
}
export function addCapabilityToRepo(c: Capability) {
  if (capabilityById.has(trim(c.id))) return;
  capabilities.push(c);
  capabilityById.set(trim(c.id), c);
  push(capabilitiesByProcess, trim(c.processId), c);
  push(capabilitiesByArea, trim(c.processAreaId), c);
  const proc = processById.get(trim(c.processId));
  if (proc) proc.capabilityCount = (proc.capabilityCount ?? 0) + 1;
}
export function addTemplateToRepo(t: Template, capabilityIds: string[], steps: TemplateStep[]) {
  if (!templateById.has(t.id)) {
    templates.push(t);
    templateById.set(t.id, t);
  }
  for (const cid of capabilityIds) {
    const k = trim(cid);
    if (!capabilityTemplateLinks.find((l) => l.templateId === t.id && trim(l.capabilityId) === k)) {
      capabilityTemplateLinks.push({ templateId: t.id, capabilityId: k });
    }
    const a1 = templatesByCapability.get(k) ?? [];
    if (!a1.includes(t.id)) { a1.push(t.id); templatesByCapability.set(k, a1); }
    const a2 = capabilitiesByTemplate.get(t.id) ?? [];
    if (!a2.includes(k)) { a2.push(k); capabilitiesByTemplate.set(t.id, a2); }
    const cap = capabilityById.get(k);
    if (cap) cap.templateCount = (cap.templateCount ?? 0) + 1;
    const proc = cap ? processById.get(trim(cap.processId)) : undefined;
    if (proc) proc.templateCount = (proc.templateCount ?? 0) + 1;
  }
  for (const s of steps) {
    templateSteps.push(s);
    push(stepsByTemplate, s.templateId, s);
  }
}

export function nextTemplateId(): number {
  let max = 0;
  for (const t of templates) if (t.id > max) max = t.id;
  return max + 1;
}

// ---------- Public API ----------
export const repo = {
  domains: () => processDomains,
  areas: () => processAreas,
  processes: () => processes,
  capabilities: () => capabilities,
  templates: () => templates,
  steps: () => templateSteps,
  businessTemplates: () => businessTemplates,
  projects: () => projects,
  entities: () => entities,
  users: () => users,
  roles: () => roles,
  productGroups: () => productGroups,
  businessTemplateLevels: () => businessTemplateLevels,
  geographicalScope: () => geographicalScope,

  domain: (id: string) => domainById.get(trim(id)),
  area: (id: string) => areaById.get(trim(id)),
  process: (id: string) => processById.get(trim(id)),
  capability: (id: string) => capabilityById.get(trim(id)),
  template: (id: number) => templateById.get(id),

  areasOf: (domainId: string) => areasByDomain.get(trim(domainId)) ?? [],
  processesOf: (areaId: string) => processesByArea.get(trim(areaId)) ?? [],
  capabilitiesOf: (processId: string) => capabilitiesByProcess.get(trim(processId)) ?? [],
  capabilitiesOfArea: (areaId: string) => capabilitiesByArea.get(trim(areaId)) ?? [],
  templatesOf: (capabilityId: string): Template[] =>
    (templatesByCapability.get(trim(capabilityId)) ?? [])
      .map((id) => templateById.get(id))
      .filter((t): t is Template => Boolean(t)),
  capabilitiesOfTemplate: (templateId: number): Capability[] =>
    (capabilitiesByTemplate.get(templateId) ?? [])
      .map((cid) => capabilityById.get(cid))
      .filter((c): c is Capability => Boolean(c)),
  stepsOf: (templateId: number) =>
    (stepsByTemplate.get(templateId) ?? []).slice().sort((a, b) => a.seq - b.seq),
  businessTemplate: (id: string) => businessTemplates.find((b) => b.id === id),
  templatesOfBT: (btId: string): Template[] =>
    (btScopeByBT.get(btId) ?? [])
      .map((row) => templateById.get(row.templateId))
      .filter((t): t is Template => Boolean(t)),
  project: (id: string) => projects.find((p) => p.id === id),
  scopeOfProject: (projectId: string) => projectScopeByProject.get(projectId) ?? [],
  coverageOfArea: (areaId: string) => coverageByArea.get(trim(areaId)) ?? [],

  search: (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return { domains: [], areas: [], processes: [], capabilities: [], templates: [] };
    const limit = 6;
    const match = (s: string) => s.toLowerCase().includes(q);
    return {
      domains: processDomains.filter((d) => match(d.id) || match(d.name)).slice(0, limit),
      areas: processAreas.filter((a) => match(a.id) || match(a.name)).slice(0, limit),
      processes: processes.filter((p) => match(p.id) || match(p.name)).slice(0, limit),
      capabilities: capabilities.filter((c) => match(c.id) || match(c.name)).slice(0, limit),
      templates: templates.filter((t) => String(t.id).includes(q) || match(t.name)).slice(0, limit),
    };
  },

  stats: () => ({
    domains: processDomains.length,
    areas: processAreas.length,
    processes: processes.length,
    capabilities: capabilities.length,
    templates: templates.length,
    steps: templateSteps.length,
    businessTemplates: businessTemplates.length,
    projects: projects.length,
    entities: entities.length,
  }),
};

export const STANDARD_OPTIONS = Array.from(new Set(templates.map((t) => t.standard))).sort();
