-- =============================================================
-- BiharFast — Feature: Dynamic Top Alert Banner + Site Settings
-- Run this once in the Supabase SQL Editor.
-- =============================================================

create table if not exists public.site_settings (
  id            text primary key,                        -- e.g. 'top_banner'
  banner_active boolean not null default false,
  banner_text   text,
  banner_link   text,
  banner_bg     text not null default 'bg-[#0B4F8A]',
  updated_at    timestamptz not null default now()
);

-- Seed the singleton row so UPDATEs (not INSERTs) are all the admin ever needs.
insert into public.site_settings (id, banner_active)
values ('top_banner', false)
on conflict (id) do nothing;

-- Keep updated_at fresh automatically.
create or replace function public.set_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_site_settings_updated_at();

-- ------------------------------------------------------------
-- RLS: anonymous visitors may READ the banner;
-- writes must come from an authenticated admin.
-- ------------------------------------------------------------
alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- Anyone (logged-in) may update the singleton row.
-- Tighten `to authenticated` / add a profiles.role = 'admin' check if desired.
drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

-- Optional hardening (comment out the permissive policy above and
-- uncomment this if you use a profiles.role column):
-- create policy "Only admin role can update site settings"
--   on public.site_settings
--   for update
--   to authenticated
--   using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
--   with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
