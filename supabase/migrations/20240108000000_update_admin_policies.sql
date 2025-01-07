-- Önce var olan politikaları temizle
DROP POLICY IF EXISTS "select_policy" ON admin_users;
DROP POLICY IF EXISTS "insert_policy" ON admin_users;
DROP POLICY IF EXISTS "update_policy" ON admin_users;
DROP POLICY IF EXISTS "delete_policy" ON admin_users;

-- Tüm politikaları yeniden oluştur
-- SELECT politikası - Giriş yapmış kullanıcılar okuyabilir
CREATE POLICY "enable_select_for_authenticated_users"
ON admin_users FOR SELECT
TO authenticated
USING (true);

-- INSERT politikası - Sadece servis rolü ekleyebilir
CREATE POLICY "enable_insert_for_service_role"
ON admin_users FOR INSERT
TO service_role
WITH CHECK (true);

-- UPDATE politikası - Sadece admin kullanıcıları güncelleyebilir
CREATE POLICY "enable_update_for_admins"
ON admin_users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- DELETE politikası - Sadece admin kullanıcıları silebilir
CREATE POLICY "enable_delete_for_admins"
ON admin_users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admin kullanıcıları için özel erişim politikası
CREATE POLICY "enable_all_for_admin_users"
ON admin_users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  )
);

-- Mevcut admin kullanıcısını güncelle (eğer varsa)
UPDATE admin_users
SET role = 'admin'
WHERE email = 'admin@nakliyatpro.com'; 