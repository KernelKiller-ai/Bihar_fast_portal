-- Limit banner changes to accounts with the admin profile role.
drop policy if exists "Admins can update site settings" on public.site_settings;
drop policy if exists "Only admin role can update site settings" on public.site_settings;

create policy "Only admin role can update site settings"
  on public.site_settings
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and lower(coalesce(p.role, '')) = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and lower(coalesce(p.role, '')) = 'admin'
    )
  );
