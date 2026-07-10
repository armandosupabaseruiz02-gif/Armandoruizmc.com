-- Portal Diputado Armando Ruiz
-- Iniciativas legislativas: propuestas de ley del diputado / partido.
-- Publico: solo lectura de las publicadas. Admin: CRUD completo.

begin;

create table if not exists public.initiatives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text,
  status text not null default 'presentada' check (
    status in ('presentada', 'en_comisiones', 'aprobada', 'publicada')
  ),
  topic text,
  presented_at date,
  document_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists initiatives_published_idx
  on public.initiatives (published, presented_at desc);

drop trigger if exists initiatives_set_updated_at on public.initiatives;
create trigger initiatives_set_updated_at
  before update on public.initiatives
  for each row execute function public.set_updated_at();

alter table public.initiatives enable row level security;

-- Cualquiera puede leer las iniciativas publicadas (pagina publica).
drop policy if exists initiatives_public_read on public.initiatives;
create policy initiatives_public_read
  on public.initiatives for select
  to anon, authenticated
  using (published = true);

-- El equipo del diputado administra todo desde el panel.
drop policy if exists initiatives_admin_all on public.initiatives;
create policy initiatives_admin_all
  on public.initiatives for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

commit;
