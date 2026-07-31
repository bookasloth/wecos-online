-- Storage bucket for founder-uploaded startup images (logo now; cover/gallery
-- later). Public read so images render on the public startup page via a plain
-- <img>; writes are restricted to the owner's own `{uid}/…` folder.

insert into storage.buckets (id, name, public)
values ('startup-assets', 'startup-assets', true)
on conflict (id) do nothing;

-- Anyone can read (bucket is public).
create policy "startup assets public read"
  on storage.objects for select
  using (bucket_id = 'startup-assets');

-- A signed-in user may write only under a top-level folder named for their uid.
create policy "startup assets owner insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'startup-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "startup assets owner update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'startup-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "startup assets owner delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'startup-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
