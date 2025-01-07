-- Teklifler tablosu için RLS politikalarını güncelle
DROP POLICY IF EXISTS "Teklifleri herkes görebilir" ON teklifler;
DROP POLICY IF EXISTS "Teklifleri herkes ekleyebilir" ON teklifler;
DROP POLICY IF EXISTS "Teklifleri admin düzenleyebilir" ON teklifler;
DROP POLICY IF EXISTS "Teklifleri admin silebilir" ON teklifler;

-- RLS'yi yeniden yapılandır
ALTER TABLE teklifler DISABLE ROW LEVEL SECURITY;
ALTER TABLE teklifler ENABLE ROW LEVEL SECURITY;

-- Okuma politikası - Sadece adminler okuyabilir
CREATE POLICY "Teklifleri admin görebilir"
ON teklifler FOR SELECT
TO authenticated
USING (true);

-- Ekleme politikası - Herkes ekleyebilir
CREATE POLICY "Teklifleri herkes ekleyebilir"
ON teklifler FOR INSERT
TO public
WITH CHECK (true);

-- Güncelleme politikası - Sadece adminler güncelleyebilir
CREATE POLICY "Teklifleri admin düzenleyebilir"
ON teklifler FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Silme politikası - Sadece adminler silebilir
CREATE POLICY "Teklifleri admin silebilir"
ON teklifler FOR DELETE
TO authenticated
USING (true); 