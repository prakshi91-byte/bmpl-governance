/**
 * One-off seed: pushes everything from src/data/bpml.generated.ts into Supabase.
 * Run with: bun run scripts/seed-bpml.ts
 * Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import {
  processDomains, processAreas, processes, capabilities, templates,
  capabilityTemplateLinks, templateSteps, businessTemplates,
  businessTemplateScope, projects, projectScope, coverageCells,
  entities, users, roles, productGroups, businessTemplateLevels,
  geographicalScope,
} from "../src/data/bpml.generated";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");

const sb = createClient(url, key, { auth: { persistSession: false } });

const camelToSnake = (s: string) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
function mapKeys<T extends Record<string, unknown>>(rows: T[]): Record<string, unknown>[] {
  return rows.map((r) => {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(r)) o[camelToSnake(k)] = v;
    return o;
  });
}

async function upsert(table: string, rows: unknown[], onConflict?: string) {
  if (!rows.length) return;
  const chunkSize = 500;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const q = sb.from(table).upsert(chunk as never, onConflict ? { onConflict } : undefined);
    const { error } = await q;
    if (error) throw new Error(`${table}[${i}]: ${error.message}`);
  }
  console.log(`✓ ${table}: ${rows.length}`);
}

async function main() {
  // Lookup tables (single name column)
  await upsert("product_groups", productGroups.map((n) => ({ name: n })), "name");
  await upsert("business_template_levels", businessTemplateLevels.map((n) => ({ name: n })), "name");
  await upsert("geographical_scope", geographicalScope.map((n) => ({ name: n })), "name");

  await upsert("bpml_roles", mapKeys(roles), "id");
  await upsert("bpml_users", mapKeys(users), "id");
  await upsert("entities", mapKeys(entities), "id");

  await upsert("process_domains", mapKeys(processDomains), "id");
  await upsert("process_areas", mapKeys(processAreas), "id");
  await upsert("processes", mapKeys(processes), "id");
  await upsert("capabilities", mapKeys(capabilities), "id");

  // templates: strip capabilityIds (relation lives in capability_template_links)
  await upsert(
    "templates",
    templates.map((t) => ({ id: t.id, name: t.name, standard: t.standard, step_count: t.stepCount })),
    "id",
  );

  await upsert("capability_template_links", mapKeys(capabilityTemplateLinks), "capability_id,template_id");
  await upsert("template_steps", mapKeys(templateSteps), "template_id,seq");

  await upsert("business_templates", mapKeys(businessTemplates), "id");
  await upsert("business_template_scope", mapKeys(businessTemplateScope), "business_template_id,template_id");

  await upsert("projects", mapKeys(projects), "id");
  // project_scope has surrogate uuid PK; just insert
  await upsert("project_scope", mapKeys(projectScope));
  await upsert("coverage_cells", mapKeys(coverageCells), "process_area_id,entity_id");

  console.log("\n✅ Seed complete");
}

main().catch((e) => { console.error(e); process.exit(1); });
