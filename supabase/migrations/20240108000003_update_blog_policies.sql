-- Blog tablosu için RLS politikalarını güncelle
DROP POLICY IF EXISTS "Blog yazılarını herkes görebilir" ON blog;
DROP POLICY IF EXISTS "Blog yazılarını admin ekleyebilir" ON blog;
DROP POLICY IF EXISTS "Blog yazılarını admin düzenleyebilir" ON blog;
DROP POLICY IF EXISTS "Blog yazılarını admin silebilir" ON blog;

-- RLS'yi yeniden yapılandır
ALTER TABLE blog DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;

-- Okuma politikası - Herkes okuyabilir
CREATE POLICY "Blog yazılarını herkes görebilir"
ON blog FOR SELECT
TO public
USING (true);

-- Ekleme politikası - Sadece giriş yapmış kullanıcılar ekleyebilir
CREATE POLICY "Blog yazılarını admin ekleyebilir"
ON blog FOR INSERT
TO authenticated
WITH CHECK (true);

-- Güncelleme politikası - Sadece giriş yapmış kullanıcılar güncelleyebilir
CREATE POLICY "Blog yazılarını admin düzenleyebilir"
ON blog FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Silme politikası - Sadece giriş yapmış kullanıcılar silebilir
CREATE POLICY "Blog yazılarını admin silebilir"
ON blog FOR DELETE
TO authenticated
USING (true); 