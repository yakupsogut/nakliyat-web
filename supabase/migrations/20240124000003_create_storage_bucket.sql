-- Storage bucket oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true);

-- RLS politikaları
CREATE POLICY "Herkes görselleri görüntüleyebilir"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'public');

CREATE POLICY "Yetkili kullanıcılar görsel yükleyebilir"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Yetkili kullanıcılar görselleri düzenleyebilir"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Yetkili kullanıcılar görselleri silebilir"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'public'
    AND auth.role() = 'authenticated'
); 