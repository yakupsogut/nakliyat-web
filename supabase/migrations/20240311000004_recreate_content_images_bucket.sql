-- Content resimleri için storage bucket oluştur
BEGIN;

-- Önce mevcut politikaları temizle
DROP POLICY IF EXISTS "Give anon users access to content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update own content-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete own content-images" ON storage.objects;
DROP POLICY IF EXISTS "Content resimlerini herkes görebilir" ON storage.objects;
DROP POLICY IF EXISTS "Content resimlerini sadece giriş yapmış kullanıcılar yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Content resimlerini sadece giriş yapmış kullanıcılar güncelleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Content resimlerini sadece giriş yapmış kullanıcılar silebilir" ON storage.objects;

-- Önce objects tablosundan kayıtları sil
DELETE FROM storage.objects WHERE bucket_id = 'content-images';

-- Sonra bucket'ı sil ve yeniden oluştur
DELETE FROM storage.buckets WHERE id = 'content-images';
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Content resimleri için storage politikaları
CREATE POLICY "Content resimlerini herkes görebilir"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-images');

CREATE POLICY "Content resimlerini sadece giriş yapmış kullanıcılar yükleyebilir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

CREATE POLICY "Content resimlerini sadece giriş yapmış kullanıcılar güncelleyebilir"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images');

CREATE POLICY "Content resimlerini sadece giriş yapmış kullanıcılar silebilir"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images');

-- Bucket ayarlarını güncelle
UPDATE storage.buckets
SET public = true,
    file_size_limit = 52428800, -- 50MB in bytes
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
WHERE id = 'content-images';

COMMIT; 