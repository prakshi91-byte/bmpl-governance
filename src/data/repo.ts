import {
  processDomains,
  processAreas,
  processes,
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
} from "./bpml.generated";
import type {
  ProcessDomain,
  ProcessArea,
  ProcessCapability,
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
  ProcessCapability,
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

// Indexed lookups built once
const domainById = new Map(processDomains.map((d) => [d.id.trim(), d]));
const areaById = new Map(processAreas.map((a) => [a.id.trim(), a]));
const processById = new Map(processes.map((p) => [p.id.trim(), p]));
const templateById = new Map(templates.map((t) => [t.id, t]));
const stepsByTemplate = new Map<number, TemplateStep[]>();
for (const s of templateSteps) {
  const arr = stepsByTemplate.get(s.templateId) ?? [];
  arr.push(s);
  stepsByTemplate.set(s.templateId, arr);
}
const areasByDomain = new Map<string, ProcessArea[]>();
for (const a of processAreas) {
  const k = a.processDomainId.trim();
  const arr = areasByDomain.get(k) ?? [];
  arr.push(a);
  areasByDomain.set(k, arr);
}
const procsByArea = new Map<string, ProcessCapability[]>();
for (const p of processes) {
  const k = p.processAreaId.trim();
  const arr = procsByArea.get(k) ?? [];
  arr.push(p);
  procsByArea.set(k, arr);
}
const templatesByProcess = new Map<string, number[]>();
for (const link of capabilityTemplateLinks) {
  const k = link.processId.trim();
  const arr = templatesByProcess.get(k) ?? [];
  arr.push(link.templateId);
  templatesByProcess.set(k, arr);
}
const processesByTemplate = new Map<number, string[]>();
for (const link of capabilityTemplateLinks) {
  const arr = processesByTemplate.get(link.templateId) ?? [];
  arr.push(link.processId.trim());
  processesByTemplate.set(link.templateId, arr);
}
const btScopeByBT = new Map<string, BusinessTemplateScopeRow[]>();
for (const row of businessTemplateScope) {
  const arr = btScopeByBT.get(row.businessTemplateId) ?? [];
  arr.push(row);
  btScopeByBT.set(row.businessTemplateId, arr);
}
const projectScopeByProject = new Map<string, ProjectScopeRow[]>();
for (const row of projectScope) {
  const arr = projectScopeByProject.get(row.projectId) ?? [];
  arr.push(row);
  projectScopeByProject.set(row.projectId, arr);
}
const coverageByArea = new Map<string, CoverageCell[]>();
for (const c of coverageCells) {
  const arr = coverageByArea.get(c.processAreaId.trim()) ?? [];
  arr.push(c);
  coverageByArea.set(c.processAreaId.trim(), arr);
}

export const repo = {
  domains: () => processDomains,
  areas: () => processAreas,
  processes: () => processes,
  templates: () => templates,
  steps: () => templateSteps,
  businessTemplates: () => businessTemplates,
  projects: () => projects,
  entities: () => entities,
  users: () => users,
  roles: () => roles,

  domain: (id: string) => domainById.get(id.trim()),
  area: (id: string) => areaById.get(id.trim()),
  process: (id: string) => processById.get(id.trim()),
  template: (id: number) => templateById.get(id),

  areasOf: (domainId: string) => areasByDomain.get(domainId.trim()) ?? [],
  processesOf: (areaId: string) => procsByArea.get(areaId.trim()) ?? [],
  templatesOf: (processId: string): Template[] =>
    (templatesByProcess.get(processId.trim()) ?? [])
      .map((id) => templateById.get(id))
      .filter((t): t is Template => Boolean(t)),
  processesOfTemplate: (templateId: number): ProcessCapability[] =>
    (processesByTemplate.get(templateId) ?? [])
      .map((pid) => processById.get(pid))
      .filter((p): p is ProcessCapability => Boolean(p)),
  stepsOf: (templateId: number) =>
    (stepsByTemplate.get(templateId) ?? []).slice().sort((a, b) => a.seq - b.seq),
  businessTemplate: (id: string) => businessTemplates.find((b) => b.id === id),
  templatesOfBT: (btId: string): Template[] =>
    (btScopeByBT.get(btId) ?? [])
      .map((row) => templateById.get(row.templateId))
      .filter((t): t is Template => Boolean(t)),
  project: (id: string) => projects.find((p) => p.id === id),
  scopeOfProject: (projectId: string) => projectScopeByProject.get(projectId) ?? [],
  coverageOfArea: (areaId: string) => coverageByArea.get(areaId.trim()) ?? [],

  search: (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return { domains: [], areas: [], processes: [], templates: [] };
    const limit = 8;
    return {
      domains: processDomains.filter((d) => d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)).slice(0, limit),
      areas: processAreas.filter((a) => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)).slice(0, limit),
      processes: processes.filter((p) => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)).slice(0, limit),
      templates: templates.filter((t) => String(t.id).includes(q) || t.name.toLowerCase().includes(q)).slice(0, limit),
    };
  },

  stats: () => ({
    domains: processDomains.length,
    areas: processAreas.length,
    capabilities: processes.length,
    templates: templates.length,
    steps: templateSteps.length,
    businessTemplates: businessTemplates.length,
    projects: projects.length,
    entities: entities.length,
  }),
};

export const STANDARD_OPTIONS = Array.from(new Set(templates.map((t) => t.standard))).sort();
