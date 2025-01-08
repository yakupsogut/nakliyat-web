-- Create a new storage bucket for service images
insert into storage.buckets (id, name, public)
values ('hizmet-images', 'hizmet-images', true);

-- Create a policy to allow public access to the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'hizmet-images' );

-- Create a policy to allow authenticated users to upload files
create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check (
    bucket_id = 'hizmet-images'
    and auth.role() = 'authenticated'
  );

-- Create a policy to allow authenticated users to update files
create policy "Authenticated users can update files"
  on storage.objects for update
  with check (
    bucket_id = 'hizmet-images'
    and auth.role() = 'authenticated'
  );

-- Create a policy to allow authenticated users to delete files
create policy "Authenticated users can delete files"
  on storage.objects for delete
  using (
    bucket_id = 'hizmet-images'
    and auth.role() = 'authenticated'
  ); 