-- ============ ENUMS ============
create type public.app_role as enum ('admin', 'viewer');
create type public.coverage_state as enum ('covered', 'partial', 'not_covered', 'na');

-- ============ PROFILES + ROLES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Auto-create profile + bootstrap first user as admin
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  select count(*) into v_count from public.user_roles;
  if v_count = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'viewer')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

-- profiles policies
create policy "Profiles: view own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Profiles: view all signed in" on public.profiles for select to authenticated using (true);
create policy "Profiles: update own" on public.profiles for update to authenticated using (id = auth.uid());

-- user_roles policies
create policy "Roles: view own" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "Roles: admins view all" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Roles: admins insert" on public.user_roles for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Roles: admins delete" on public.user_roles for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ============ BPML CORE ============
create table public.process_domains (
  id text primary key,
  name text not null,
  it_domain text default '',
  it_service text default ''
);

create table public.process_areas (
  id text primary key,
  name text not null,
  process_domain_id text not null references public.process_domains(id) on delete cascade
);
create index on public.process_areas(process_domain_id);

create table public.processes (
  id text primary key,
  name text not null,
  process_area_id text not null references public.process_areas(id) on delete cascade,
  process_domain_id text not null references public.process_domains(id) on delete cascade,
  owner text default '',
  capability_count int not null default 0,
  template_count int not null default 0,
  status text default 'Active'
);
create index on public.processes(process_area_id);
create index on public.processes(process_domain_id);

create table public.capabilities (
  id text primary key,
  name text not null,
  process_id text not null references public.processes(id) on delete cascade,
  process_area_id text not null references public.process_areas(id) on delete cascade,
  process_domain_id text not null references public.process_domains(id) on delete cascade,
  status text default 'Active',
  template_count int not null default 0
);
create index on public.capabilities(process_id);
create index on public.capabilities(process_area_id);
create index on public.capabilities(process_domain_id);

create table public.templates (
  id int primary key,
  name text not null,
  standard text default '',
  step_count int not null default 0
);

create table public.template_steps (
  template_id int not null references public.templates(id) on delete cascade,
  seq int not null,
  name text not null,
  transaction text default '',
  standard text default '',
  status text default 'Active',
  primary key (template_id, seq)
);

create table public.capability_template_links (
  capability_id text not null references public.capabilities(id) on delete cascade,
  template_id int not null references public.templates(id) on delete cascade,
  primary key (capability_id, template_id)
);
create index on public.capability_template_links(template_id);

-- ============ BUSINESS TEMPLATES ============
create table public.business_templates (
  id text primary key,
  name text not null,
  level text default '',
  product_group text default '',
  geo_scope text default '',
  description text default ''
);

create table public.business_template_scope (
  business_template_id text not null references public.business_templates(id) on delete cascade,
  template_id int not null references public.templates(id) on delete cascade,
  primary key (business_template_id, template_id)
);
create index on public.business_template_scope(template_id);

-- ============ PROJECTS ============
create table public.projects (
  id text primary key,
  code text not null,
  name text not null,
  status text default 'Planning',
  manager text default '',
  start_date date,
  end_date date
);

create table public.project_scope (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  business_template_id text references public.business_templates(id) on delete cascade,
  template_id int references public.templates(id) on delete cascade,
  check (business_template_id is not null or template_id is not null)
);
create index on public.project_scope(project_id);
create unique index project_scope_bt_uniq on public.project_scope(project_id, business_template_id) where business_template_id is not null;
create unique index project_scope_tpl_uniq on public.project_scope(project_id, template_id) where template_id is not null;

-- ============ COVERAGE / ENTITIES ============
create table public.entities (
  id text primary key,
  name text not null,
  region text default ''
);

create table public.coverage_cells (
  process_area_id text not null references public.process_areas(id) on delete cascade,
  entity_id text not null references public.entities(id) on delete cascade,
  state public.coverage_state not null default 'na',
  primary key (process_area_id, entity_id)
);

-- ============ APP-LEVEL DIRECTORIES ============
-- These mirror the legacy bpml_users / bpml_roles concept (display info only).
create table public.bpml_roles (
  id text primary key,
  name text not null,
  description text default ''
);

create table public.bpml_users (
  id text primary key,
  name text not null,
  email text not null,
  role_id text references public.bpml_roles(id) on delete set null,
  active boolean not null default true
);

create table public.product_groups (
  name text primary key
);
create table public.business_template_levels (
  name text primary key
);
create table public.geographical_scope (
  name text primary key
);

-- ============ RLS: signed-in read, admin write ============
do $$
declare t text;
begin
  for t in select unnest(array[
    'process_domains','process_areas','processes','capabilities',
    'templates','template_steps','capability_template_links',
    'business_templates','business_template_scope',
    'projects','project_scope',
    'entities','coverage_cells',
    'bpml_users','bpml_roles',
    'product_groups','business_template_levels','geographical_scope'
  ])
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format($f$create policy "%1$s: read" on public.%1$I for select to authenticated using (true);$f$, t);
    execute format($f$create policy "%1$s: admin insert" on public.%1$I for insert to authenticated with check (public.has_role(auth.uid(),'admin'));$f$, t);
    execute format($f$create policy "%1$s: admin update" on public.%1$I for update to authenticated using (public.has_role(auth.uid(),'admin'));$f$, t);
    execute format($f$create policy "%1$s: admin delete" on public.%1$I for delete to authenticated using (public.has_role(auth.uid(),'admin'));$f$, t);
  end loop;
end$$;