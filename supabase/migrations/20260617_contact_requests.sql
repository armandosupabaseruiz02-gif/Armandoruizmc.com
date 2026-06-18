-- Portal Diputado Armando Ruiz
-- Bandeja interna de solicitudes: vacantes, aliados, donaciones y reportes.

begin;

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (
    request_type in (
      'job_application',
      'vacancy_registration',
      'ally',
      'donation',
      'accessibility',
      'general'
    )
  ),
  full_name text not null,
  phone text,
  email text,
  organization text,
  subject text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (
    status in ('new', 'in_review', 'contacted', 'closed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

create index if not exists contact_requests_status_idx
  on public.contact_requests (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_requests_set_updated_at on public.contact_requests;
create trigger contact_requests_set_updated_at
  before update on public.contact_requests
  for each row execute function public.set_updated_at();

alter table public.contact_requests enable row level security;

drop policy if exists contact_requests_public_insert on public.contact_requests;
create policy contact_requests_public_insert
  on public.contact_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists contact_requests_admin_select on public.contact_requests;
create policy contact_requests_admin_select
  on public.contact_requests for select
  to authenticated
  using (public.is_admin());

drop policy if exists contact_requests_admin_update on public.contact_requests;
create policy contact_requests_admin_update
  on public.contact_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

commit;
