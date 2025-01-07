-- Blog resimleri için storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Blog resimleri için storage politikaları
CREATE POLICY "Blog resimlerini herkes görebilir"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Blog resimlerini sadece giriş yapmış kullanıcılar yükleyebilir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Blog resimlerini sadece giriş yapmış kullanıcılar güncelleyebilir"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Blog resimlerini sadece giriş yapmış kullanıcılar silebilir"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images'); 