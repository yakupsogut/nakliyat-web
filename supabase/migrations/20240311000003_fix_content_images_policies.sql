-- Fix content-images storage policies
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;

-- Create new policies with anon access
CREATE POLICY "Give anon users access to content-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

CREATE POLICY "Allow authenticated users to upload content-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'content-images'
    AND (storage.foldername(name))[1] = 'content-images'
);

CREATE POLICY "Allow authenticated users to update own content-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'content-images'
    AND owner = auth.uid()
);

CREATE POLICY "Allow authenticated users to delete own content-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'content-images'
    AND owner = auth.uid()
);

-- Enable liberal CORS
UPDATE storage.buckets
SET public = true,
    file_size_limit = 52428800, -- 50MB in bytes
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    owner = null
WHERE id = 'content-images';

COMMIT; 