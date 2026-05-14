import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { repo } from "@/data/repo";
import { PageHeader } from "@/components/enterprise/PageHeader";
import { StatusBadge, StandardizationBadge } from "@/components/enterprise/Badges";
import { useRightPanel } from "@/components/enterprise/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronRight, Download, Layers, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/projects/$projectId")({
  loader: ({ params }) => {
    const p = repo.project(params.projectId);
    if (!p) throw notFound();
    return { project: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.code} — ${loaderData?.project.name}` },
      { name: "description", content: `Rollout scope for project ${loaderData?.project.code}: ${loaderData?.project.name}.` },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Project not found.</div>,
  errorComponent: () => <div className="p-8 text-[13px] text-muted-foreground">Failed to load.</div>,
  component: ProjectDetail,
});

const TABS = ["Business Templates", "Direct Templates", "Complete Scope", "Coverage"] as const;

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Business Templates");
  const [version, setVersion] = useState(0);
  const scope = useMemo(() => repo.scopeOfProject(project.id), [project.id, version]);
  const bts = scope.filter((s) => s.businessTemplateId).map((s) => repo.businessTemplate(s.businessTemplateId!)!).filter(Boolean);
  const tpls = scope.filter((s) => s.templateId).map((s) => repo.template(s.templateId!)!).filter(Boolean);
  const completeTemplates = useMemo(() => getCompleteScopeTemplates(bts, tpls), [bts, tpls]);
  const intent = project.status === "Closed" ? "neutral" : project.status === "At Risk" ? "danger" : project.status === "Planning" ? "info" : "success";

  useRightPanel(
    <div className="flex flex-col gap-4 p-4">
      <div>
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Project</div>
        <div className="num mt-0.5 text-[11px] text-muted-foreground">{project.id}</div>
        <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{project.name}</h3>
        <div className="mt-2"><StatusBadge value={project.status} intent={intent as any} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <Stat label="Business Tpls" value={bts.length} />
        <Stat label="Scope Tpls" value={completeTemplates.length} />
        <Stat label="Manager" value={project.manager} />
        <Stat label="Code" value={project.code} />
      </div>
    </div>,
    [project.id, version],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={<><span className="num text-primary">{project.code}</span> <span className="ml-2">{project.name}</span></>}
        breadcrumbs={[{ label: "Rollout" }, { label: "Projects", to: "/projects" }, { label: project.code }]}
        meta={<><StatusBadge value={project.status} intent={intent as any} /><span>Manager <span className="text-foreground">{project.manager}</span></span><span className="num">{project.startDate} → {project.endDate}</span></>}
      />
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-3">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"relative h-9 px-3 text-[12.5px] font-medium " + (tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>{t}{tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary" />}</button>
        ))}
      </div>
      <div className="thin-scrollbar flex-1 overflow-y-auto p-5">
        {tab === "Business Templates" && (
          <BusinessTemplateScope
            assigned={bts}
            directTemplates={tpls}
            projectId={project.id}
            onSaved={() => setVersion((value) => value + 1)}
          />
        )}
        {tab === "Direct Templates" && (
          <ul className="grid gap-1 lg:grid-cols-2">
            {tpls.map((t) => (
              <li key={t.id}>
                <Link to="/templates/$templateId" params={{ templateId: String(t.id) }} className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover">
                  <span className="num text-[11px] text-muted-foreground">{t.id}</span>
                  <span className="truncate">{t.name}</span>
                  <StandardizationBadge value={t.standard} className="ml-auto" />
                </Link>
              </li>
            ))}
            {tpls.length === 0 && <li className="text-[13px] text-muted-foreground">No direct templates assigned.</li>}
          </ul>
        )}
        {tab === "Coverage" && (
          <div className="rounded-md border border-border bg-surface p-4 text-[13px] text-muted-foreground">
            Project covers {completeTemplates.length} scope items across {repo.entities().length} business entities. See the
            <Link to="/coverage" className="ml-1 text-primary hover:underline">Coverage Map</Link> for a global view.
          </div>
        )}
        {tab === "Complete Scope" && <CompleteScope projectCode={project.code} templates={completeTemplates} />}
      </div>
    </div>
  );
}

function getCompleteScopeTemplates(
  businessTemplates: NonNullable<ReturnType<typeof repo.businessTemplate>>[],
  directTemplates: NonNullable<ReturnType<typeof repo.template>>[],
) {
  const directIds = new Set(directTemplates.map((template) => template.id));
  const btTemplateIds = new Set<number>();
  for (const bt of businessTemplates) {
    for (const template of repo.templatesOfBT(bt.id)) btTemplateIds.add(template.id);
  }

  const directHasBusinessTemplateTemplate = Array.from(directIds).some((id) => btTemplateIds.has(id));
  const ids = directHasBusinessTemplateTemplate || businessTemplates.length === 0
    ? directIds
    : new Set([...btTemplateIds, ...directIds]);

  return Array.from(ids)
    .map((id) => repo.template(id))
    .filter((template): template is NonNullable<ReturnType<typeof repo.template>> => Boolean(template))
    .sort((a, b) => a.id - b.id);
}

function CompleteScope({
  projectCode,
  templates,
}: {
  projectCode: string;
  templates: NonNullable<ReturnType<typeof repo.template>>[];
}) {
  const tree = useMemo(() => buildCompleteScopeTree(templates), [templates]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[13px] font-semibold">Complete scope</div>
          <div className="text-[12px] text-muted-foreground">
            {templates.length} selected capability template{templates.length === 1 ? "" : "s"} shown in BPML hierarchy.
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" disabled={templates.length === 0} onClick={() => downloadCompleteScope(projectCode, tree)}>
          <Download className="size-3.5" /> Excel
        </Button>
      </div>

      <div className="rounded-md border border-border bg-surface">
        {tree.length === 0 ? (
          <div className="px-4 py-12 text-center text-[13px] text-muted-foreground">No capability templates are in scope.</div>
        ) : (
          <div className="thin-scrollbar max-h-[calc(100vh-260px)] overflow-auto">
            {tree.map((domain) => (
              <div key={domain.id} className="border-b border-border/70">
                <HierarchyHeader depth={0} code={domain.id} name={domain.name} count={domain.templateCount} />
                {domain.areas.map((area) => (
                  <div key={area.id}>
                    <HierarchyHeader depth={1} code={area.id} name={area.name} count={area.templateCount} />
                    {area.processes.map((process) => (
                      <div key={process.id}>
                        <HierarchyHeader depth={2} code={process.id} name={process.name} count={process.templateCount} />
                        {process.capabilities.map((capability) => (
                          <div key={capability.id}>
                            <HierarchyHeader depth={3} code={capability.id} name={capability.name} count={capability.templates.length} />
                            <div className="border-t border-border/50">
                              {capability.templates.map((template) => (
                                <Link
                                  key={template.id}
                                  to="/templates/$templateId"
                                  params={{ templateId: String(template.id) }}
                                  className="grid grid-cols-[88px_1fr_auto] items-center gap-3 border-b border-border/40 py-2 pl-[112px] pr-3 text-[13px] hover:bg-surface-hover"
                                >
                                  <span className="num text-[11px] text-muted-foreground">{template.id}</span>
                                  <span className="truncate">{template.name}</span>
                                  <StandardizationBadge value={template.standard} />
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HierarchyHeader({ depth, code, name, count }: { depth: number; code: string; name: string; count: number }) {
  const padding = 12 + depth * 24;
  return (
    <div className="flex items-center gap-2 border-b border-border/40 bg-surface-2/70 py-2 pr-3 text-[13px]" style={{ paddingLeft: padding }}>
      <ChevronRight className="size-3.5 text-muted-foreground" />
      <span className="num min-w-[88px] text-[11px] text-muted-foreground">{code}</span>
      <span className="min-w-0 flex-1 truncate font-medium">{name}</span>
      <span className="num rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{count}</span>
    </div>
  );
}

function buildCompleteScopeTree(templates: NonNullable<ReturnType<typeof repo.template>>[]) {
  const templateIds = new Set(templates.map((template) => template.id));
  const templateById = new Map(templates.map((template) => [template.id, template]));

  const capabilityTemplates = new Map<string, NonNullable<ReturnType<typeof repo.template>>[]>();
  for (const template of templates) {
    for (const capability of repo.capabilitiesOfTemplate(template.id)) {
      if (!templateIds.has(template.id)) continue;
      const rows = capabilityTemplates.get(capability.id) ?? [];
      rows.push(template);
      capabilityTemplates.set(capability.id, rows);
    }
  }

  for (const [capabilityId, rows] of capabilityTemplates) {
    const seen = new Set<number>();
    capabilityTemplates.set(
      capabilityId,
      rows
        .filter((template) => {
          if (seen.has(template.id)) return false;
          seen.add(template.id);
          return true;
        })
        .sort((a, b) => a.id - b.id),
    );
  }

  const domains = [];
  for (const domain of repo.domains()) {
    const areas = [];
    for (const area of repo.areasOf(domain.id)) {
      const processes = [];
      for (const process of repo.processesOf(area.id)) {
        const capabilities = [];
        for (const capability of repo.capabilitiesOf(process.id)) {
          const scopedTemplates = capabilityTemplates.get(capability.id) ?? [];
          if (scopedTemplates.length === 0) continue;
          capabilities.push({ ...capability, templates: scopedTemplates });
        }
        if (capabilities.length === 0) continue;
        processes.push({
          ...process,
          capabilities,
          templateCount: capabilities.reduce((sum, capability) => sum + capability.templates.length, 0),
        });
      }
      if (processes.length === 0) continue;
      areas.push({
        ...area,
        processes,
        templateCount: processes.reduce((sum, process) => sum + process.templateCount, 0),
      });
    }
    if (areas.length === 0) continue;
    domains.push({
      ...domain,
      areas,
      templateCount: areas.reduce((sum, area) => sum + area.templateCount, 0),
    });
  }

  const assignedCapabilityTemplateIds = new Set<number>();
  for (const rows of capabilityTemplates.values()) {
    for (const template of rows) assignedCapabilityTemplateIds.add(template.id);
  }

  const unassignedTemplates = Array.from(templateIds)
    .filter((id) => !assignedCapabilityTemplateIds.has(id))
    .map((id) => templateById.get(id))
    .filter((template): template is NonNullable<ReturnType<typeof repo.template>> => Boolean(template));

  if (unassignedTemplates.length > 0) {
    domains.push({
      id: "UNASSIGNED",
      name: "Templates without BPML capability links",
      itDomain: "",
      itService: "",
      templateCount: unassignedTemplates.length,
      areas: [
        {
          id: "UNASSIGNED",
          name: "Unassigned",
          processDomainId: "UNASSIGNED",
          templateCount: unassignedTemplates.length,
          processes: [
            {
              id: "UNASSIGNED",
              name: "Unassigned",
              processAreaId: "UNASSIGNED",
              processDomainId: "UNASSIGNED",
              owner: "",
              capabilityCount: 1,
              templateCount: unassignedTemplates.length,
              status: "",
              capabilities: [
                {
                  id: "UNASSIGNED",
                  name: "No mapped capability",
                  processId: "UNASSIGNED",
                  processAreaId: "UNASSIGNED",
                  processDomainId: "UNASSIGNED",
                  status: "",
                  templateCount: unassignedTemplates.length,
                  templates: unassignedTemplates,
                },
              ],
            },
          ],
        },
      ],
    });
  }

  return domains;
}

function downloadCompleteScope(projectCode: string, tree: ReturnType<typeof buildCompleteScopeTree>) {
  const rows = tree.flatMap((domain) =>
    domain.areas.flatMap((area) =>
      area.processes.flatMap((process) =>
        process.capabilities.flatMap((capability) =>
          capability.templates.map((template) => ({
            domainId: domain.id,
            domainName: domain.name,
            areaId: area.id,
            areaName: area.name,
            processId: process.id,
            processName: process.name,
            capabilityId: capability.id,
            capabilityName: capability.name,
            templateId: template.id,
            templateName: template.name,
            standard: template.standard,
            stepCount: template.stepCount,
          })),
        ),
      ),
    ),
  );

  const header = [
    "Domain ID",
    "Domain",
    "Area ID",
    "Area",
    "Process ID",
    "Process",
    "Capability ID",
    "Capability",
    "Template ID",
    "Capability Template",
    "Standardization",
    "Steps",
  ];

  const worksheetRows = [
    header,
    ...rows.map((row) => [
        row.domainId,
        row.domainName,
        row.areaId,
        row.areaName,
        row.processId,
        row.processName,
        row.capabilityId,
        row.capabilityName,
        row.templateId,
        row.templateName,
        row.standard,
        row.stepCount,
      ]),
  ];

  const blob = createXlsxWorkbook(worksheetRows);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectCode}-complete-scope.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createXlsxWorkbook(rows: unknown[][]) {
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${rows.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => {
      const cellRef = `${xlsxColumnName(columnIndex)}${rowIndex + 1}`;
      return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
    }).join("")}</row>`).join("")}
  </sheetData>
</worksheet>`;

  const files = [
    {
      path: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
    },
    {
      path: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      path: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Complete Scope" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
    },
    {
      path: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    },
    { path: "xl/worksheets/sheet1.xml", content: sheet },
  ];

  return new Blob([zipFiles(files)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function xlsxColumnName(index: number) {
  let name = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function zipFiles(files: { path: string; content: string }[]) {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const data = encoder.encode(file.content);
    const crc = crc32(data);
    const localHeader = createZipHeader(0x04034b50, name, data, crc, offset);
    parts.push(localHeader, data);
    centralDirectory.push(createZipHeader(0x02014b50, name, data, crc, offset));
    offset += localHeader.length + data.length;
  }

  const centralDirectoryOffset = offset;
  const centralDirectorySize = centralDirectory.reduce((sum, item) => sum + item.length, 0);
  parts.push(...centralDirectory, createEndOfCentralDirectory(files.length, centralDirectorySize, centralDirectoryOffset));
  return new Blob(parts as BlobPart[]);
}

function createZipHeader(signature: number, name: Uint8Array, data: Uint8Array, crc: number, offset: number) {
  const isCentral = signature === 0x02014b50;
  const size = isCentral ? 46 + name.length : 30 + name.length;
  const header = new Uint8Array(size);
  const view = new DataView(header.buffer);
  view.setUint32(0, signature, true);
  if (isCentral) {
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(28, name.length, true);
    view.setUint32(42, offset, true);
    header.set(name, 46);
  } else {
    view.setUint16(4, 20, true);
    view.setUint16(26, name.length, true);
    header.set(name, 30);
  }
  const base = isCentral ? 8 : 6;
  view.setUint16(base, 0, true);
  view.setUint16(base + 2, 0, true);
  view.setUint16(base + 4, 0, true);
  view.setUint16(base + 6, 0, true);
  view.setUint32(base + 8, crc, true);
  view.setUint32(base + 12, data.length, true);
  view.setUint32(base + 16, data.length, true);
  return header;
}

function createEndOfCentralDirectory(fileCount: number, centralDirectorySize: number, centralDirectoryOffset: number) {
  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralDirectorySize, true);
  view.setUint32(16, centralDirectoryOffset, true);
  return header;
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function BusinessTemplateScope({
  assigned,
  directTemplates,
  projectId,
  onSaved,
}: {
  assigned: NonNullable<ReturnType<typeof repo.businessTemplate>>[];
  directTemplates: NonNullable<ReturnType<typeof repo.template>>[];
  projectId: string;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("__all");
  const [selected, setSelected] = useState(() => new Set(assigned.map((bt) => bt.id)));
  const [selectedTemplates, setSelectedTemplates] = useState(() => new Set(directTemplates.map((template) => template.id)));
  const [capabilityQuery, setCapabilityQuery] = useState("");
  const [domainId, setDomainId] = useState("__all");
  const [areaId, setAreaId] = useState("__all");
  const [processId, setProcessId] = useState("__all");
  const [lastAddedCapabilityId, setLastAddedCapabilityId] = useState<string | null>(null);
  const assignedIds = useMemo(() => new Set(assigned.map((bt) => bt.id)), [assigned]);
  const levels = useMemo(() => Array.from(new Set(repo.businessTemplates().map((bt) => bt.level))), []);
  const selectedBusinessTemplates = useMemo(
    () => repo.businessTemplates().filter((bt) => selected.has(bt.id)),
    [selected],
  );
  const businessTemplateTemplateIds = useMemo(() => {
    const ids = new Set<number>();
    for (const bt of selectedBusinessTemplates) {
      for (const template of repo.templatesOfBT(bt.id)) ids.add(template.id);
    }
    return ids;
  }, [selectedBusinessTemplates]);
  const scopedTemplates = useMemo(
    () =>
      Array.from(new Set([...businessTemplateTemplateIds, ...selectedTemplates]))
        .map((id) => repo.template(id))
        .filter((template): template is NonNullable<ReturnType<typeof repo.template>> => Boolean(template))
        .sort((a, b) => a.id - b.id),
    [businessTemplateTemplateIds, selectedTemplates],
  );
  const areas = useMemo(
    () => (domainId === "__all" ? repo.areas() : repo.areasOf(domainId)),
    [domainId],
  );
  const processes = useMemo(
    () => (areaId === "__all" ? repo.processes() : repo.processesOf(areaId)),
    [areaId],
  );
  const capabilities = useMemo(() => {
    const q = capabilityQuery.trim().toLowerCase();
    return repo.capabilities().filter((capability) => {
      if (domainId !== "__all" && capability.processDomainId !== domainId) return false;
      if (areaId !== "__all" && capability.processAreaId !== areaId) return false;
      if (processId !== "__all" && capability.processId !== processId) return false;
      if (!q) return true;
      return capability.id.toLowerCase().includes(q) || capability.name.toLowerCase().includes(q);
    }).slice(0, 60);
  }, [areaId, capabilityQuery, domainId, processId]);
  const visibleTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repo.businessTemplates().filter((bt) => {
      if (level !== "__all" && bt.level !== level) return false;
      if (!q) return true;
      return (
        bt.id.toLowerCase().includes(q) ||
        bt.name.toLowerCase().includes(q) ||
        bt.productGroup.toLowerCase().includes(q) ||
        bt.geoScope.toLowerCase().includes(q)
      );
    });
  }, [level, query]);

  function startEditing() {
    setSelected(new Set(assignedIds));
    const initialTemplates = new Set(directTemplates.map((template) => template.id));
    for (const bt of assigned) {
      for (const template of repo.templatesOfBT(bt.id)) initialTemplates.add(template.id);
    }
    setSelectedTemplates(initialTemplates);
    setEditing(true);
  }

  function toggleBusinessTemplate(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      const isRemoving = next.has(id);
      if (isRemoving) next.delete(id);
      else next.add(id);

      setSelectedTemplates((templates) => {
        const scoped = new Set(templates);
        const changedTemplateIds = repo.templatesOfBT(id).map((template) => template.id);
        if (!isRemoving) {
          for (const templateId of changedTemplateIds) scoped.add(templateId);
          return scoped;
        }

        const remainingBusinessTemplateIds = Array.from(next);
        for (const templateId of changedTemplateIds) {
          const stillIncluded = remainingBusinessTemplateIds.some((btId) =>
            repo.templatesOfBT(btId).some((template) => template.id === templateId),
          );
          if (!stillIncluded) scoped.delete(templateId);
        }
        return scoped;
      });
      return next;
    });
  }

  function toggleTemplate(templateId: number) {
    setSelectedTemplates((current) => {
      const next = new Set(current);
      if (next.has(templateId)) next.delete(templateId);
      else next.add(templateId);
      return next;
    });
  }

  function addCapabilityTemplates(capabilityId: string) {
    const templates = repo.templatesOf(capabilityId);
    setSelectedTemplates((current) => {
      const next = new Set(current);
      for (const template of templates) next.add(template.id);
      return next;
    });
    setLastAddedCapabilityId(capabilityId);
  }

  function saveScope() {
    repo.setProjectScope(projectId, Array.from(selected).sort(), Array.from(selectedTemplates).sort((a, b) => a - b));
    setEditing(false);
    onSaved();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[13px] font-semibold">Business template scope</div>
          <div className="text-[12px] text-muted-foreground">
            {assigned.length} rollout package{assigned.length === 1 ? "" : "s"} assigned to this project.
          </div>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
              <X className="size-3.5" /> Cancel
            </Button>
            <Button type="button" size="sm" onClick={saveScope}>
              <Check className="size-3.5" /> Save scope
            </Button>
          </div>
        ) : (
          <Button type="button" size="sm" onClick={startEditing}>
            <Plus className="size-3.5" /> Scope templates
          </Button>
        )}
      </div>

      {editing && (
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
          <div className="rounded-md border border-border bg-surface">
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search business templates..."
                className="h-8 w-full rounded-md border border-input bg-background pl-7 pr-3 text-[12.5px] outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="__all">All levels</option>
              {levels.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <span className="num ml-auto text-[12px] text-muted-foreground">
              {selected.size} selected
            </span>
          </div>
          <div className="thin-scrollbar max-h-[360px] overflow-auto">
            {visibleTemplates.map((bt) => {
              const checked = selected.has(bt.id);
              return (
                <div
                  key={bt.id}
                  onClick={() => toggleBusinessTemplate(bt.id)}
                  className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-border/60 px-3 py-2 text-left text-[13px] hover:bg-surface-hover"
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleBusinessTemplate(bt.id)} onClick={(event) => event.stopPropagation()} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="num text-[11px] text-muted-foreground">{bt.id}</span>
                      <span className="truncate font-medium">{bt.name}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">{bt.description}</span>
                  </span>
                  <StatusBadge value={bt.productGroup} intent="neutral" />
                  <span className="text-[11.5px] text-muted-foreground">{bt.geoScope}</span>
                </div>
              );
            })}
            {visibleTemplates.length === 0 && (
              <div className="px-3 py-10 text-center text-[13px] text-muted-foreground">No business templates match this filter.</div>
            )}
          </div>
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <div className="rounded-md border border-border bg-surface">
              <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-2 px-3 py-2">
                <div>
                  <div className="text-[12.5px] font-semibold">Capability templates in scope</div>
                  <div className="text-[11.5px] text-muted-foreground">Business-template templates are selected by default.</div>
                </div>
                <span className="num text-[12px] text-muted-foreground">{selectedTemplates.size} selected</span>
              </div>
              <div className="thin-scrollbar max-h-[300px] overflow-auto">
                {scopedTemplates.map((template) => {
                  const fromBusinessTemplate = businessTemplateTemplateIds.has(template.id);
                  return (
                    <div
                      key={template.id}
                      onClick={() => toggleTemplate(template.id)}
                      className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/60 px-3 py-2 text-[13px] hover:bg-surface-hover"
                    >
                      <Checkbox checked={selectedTemplates.has(template.id)} onCheckedChange={() => toggleTemplate(template.id)} onClick={(event) => event.stopPropagation()} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="num text-[11px] text-muted-foreground">{template.id}</span>
                          <span className="truncate font-medium">{template.name}</span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-2 text-[11.5px] text-muted-foreground">
                          {fromBusinessTemplate ? "From selected business template" : "Added from BPML tree"}
                          <span>{template.stepCount} steps</span>
                        </span>
                      </span>
                      <StandardizationBadge value={template.standard} />
                    </div>
                  );
                })}
                {scopedTemplates.length === 0 && (
                  <div className="px-3 py-10 text-center text-[13px] text-muted-foreground">Select business templates or add capabilities from the BPML tree.</div>
                )}
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface">
              <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
                <Layers className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-[12.5px] font-semibold">Add from BPML tree</div>
                  <div className="text-[11.5px] text-muted-foreground">Pick a capability to add all its capability templates.</div>
                </div>
              </div>
              <div className="grid gap-2 border-b border-border/60 p-3">
                <div className="grid gap-2 md:grid-cols-3">
                  <select
                    value={domainId}
                    onChange={(event) => {
                      setDomainId(event.target.value);
                      setAreaId("__all");
                      setProcessId("__all");
                    }}
                    className="h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="__all">All domains</option>
                    {repo.domains().map((domain) => (
                      <option key={domain.id} value={domain.id}>{domain.id}</option>
                    ))}
                  </select>
                  <select
                    value={areaId}
                    onChange={(event) => {
                      setAreaId(event.target.value);
                      setProcessId("__all");
                    }}
                    className="h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="__all">All areas</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                  <select
                    value={processId}
                    onChange={(event) => setProcessId(event.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-[12.5px] outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="__all">All processes</option>
                    {processes.map((process) => (
                      <option key={process.id} value={process.id}>{process.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={capabilityQuery}
                    onChange={(event) => setCapabilityQuery(event.target.value)}
                    placeholder="Search capabilities..."
                    className="h-8 w-full rounded-md border border-input bg-background pl-7 pr-3 text-[12.5px] outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="thin-scrollbar max-h-[260px] overflow-auto">
                {capabilities.map((capability) => {
                  const templateCount = repo.templatesOf(capability.id).length;
                  const allTemplatesAdded = templateCount > 0 && repo.templatesOf(capability.id).every((template) => selectedTemplates.has(template.id));
                  const justAdded = lastAddedCapabilityId === capability.id && allTemplatesAdded;
                  return (
                    <div
                      key={capability.id}
                      className={
                        "flex items-center gap-3 border-b border-border/60 px-3 py-2 text-[13px] transition-colors " +
                        (justAdded ? "bg-primary-soft" : "")
                      }
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="num text-[11px] text-muted-foreground">{capability.id}</span>
                          <span className="truncate font-medium">{capability.name}</span>
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                          {justAdded ? "Added to project scope" : `${templateCount} capability templates`}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={allTemplatesAdded ? "secondary" : "outline"}
                        size="sm"
                        disabled={templateCount === 0 || allTemplatesAdded}
                        onClick={() => addCapabilityTemplates(capability.id)}
                        className={justAdded ? "bg-std-global-bg text-std-global shadow-none" : ""}
                      >
                        {allTemplatesAdded ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                        {allTemplatesAdded ? "Added" : "Add"}
                      </Button>
                    </div>
                  );
                })}
                {capabilities.length === 0 && (
                  <div className="px-3 py-10 text-center text-[13px] text-muted-foreground">No capabilities match this filter.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="grid gap-1 lg:grid-cols-2">
        {assigned.map((bt) => (
          <li key={bt.id}>
            <Link to="/business-templates/$btId" params={{ btId: bt.id }} className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-2 text-[13px] hover:bg-surface-hover">
              <span className="num text-[11px] text-muted-foreground">{bt.id}</span>
              <span className="truncate">{bt.name}</span>
              <span className="ml-auto text-[11.5px] text-muted-foreground">{bt.geoScope}</span>
            </Link>
          </li>
        ))}
        {assigned.length === 0 && <li className="text-[13px] text-muted-foreground">No business templates assigned.</li>}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (<div className="rounded-md border border-border bg-surface-2 px-2.5 py-2"><div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div><div className="num mt-0.5 text-[14px] font-semibold truncate">{value}</div></div>);
}
