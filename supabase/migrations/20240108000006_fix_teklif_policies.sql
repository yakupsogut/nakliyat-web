-- Önce tüm mevcut policy'leri kaldır
DROP POLICY IF EXISTS "Teklifleri admin görebilir" ON teklifler;
DROP POLICY IF EXISTS "Teklifleri herkes ekleyebilir" ON teklifler;
DROP POLICY IF EXISTS "Teklifleri admin düzenleyebilir" ON teklifler;
DROP POLICY IF EXISTS "Teklifleri admin silebilir" ON teklifler;

-- RLS'yi tamamen devre dışı bırak
ALTER TABLE teklifler DISABLE ROW LEVEL SECURITY;

-- Basit bir policy ekle - herkes ekleyebilir ve görüntüleyebilir
CREATE POLICY "Enable all access for teklifler"
ON teklifler
FOR ALL
TO public
USING (true)
WITH CHECK (true); 