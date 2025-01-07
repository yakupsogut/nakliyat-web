-- Önce tüm politikaları temizle
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete_policy" ON admin_users;
DROP POLICY IF EXISTS "enable_select_for_authenticated_users" ON admin_users;
DROP POLICY IF EXISTS "enable_insert_for_service_role" ON admin_users;
DROP POLICY IF EXISTS "enable_update_for_admins" ON admin_users;
DROP POLICY IF EXISTS "enable_delete_for_admins" ON admin_users;
DROP POLICY IF EXISTS "enable_all_for_admin_users" ON admin_users;

-- RLS'yi devre dışı bırak ve tekrar etkinleştir
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Tek bir basit politika oluştur - Giriş yapmış kullanıcılar tüm işlemleri yapabilir
CREATE POLICY "admin_users_all_operations"
ON admin_users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Admin kullanıcısını yeniden ekle
DELETE FROM admin_users WHERE email = 'admin@nakliyatpro.com';

INSERT INTO admin_users (id, email, ad_soyad, role)
SELECT id, email, 'Admin Kullanıcı', 'admin'
FROM auth.users
WHERE email = 'admin@nakliyatpro.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin'; 