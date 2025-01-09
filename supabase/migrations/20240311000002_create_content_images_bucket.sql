-- Create content-images storage bucket
BEGIN;

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a dummy file to initialize the bucket
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES (
    'content-images',
    '.gitkeep',
    auth.uid(),
    '{}'::jsonb
)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
CREATE POLICY "Authenticated Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

DROP POLICY IF EXISTS "Authenticated Update Access" ON storage.objects;
CREATE POLICY "Authenticated Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images');

DROP POLICY IF EXISTS "Authenticated Delete Access" ON storage.objects;
CREATE POLICY "Authenticated Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images');

COMMIT; 