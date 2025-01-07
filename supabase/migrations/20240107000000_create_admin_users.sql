-- Önce var olan politikaları ve tabloyu temizle
DROP POLICY IF EXISTS "Admin kullanıcıları yönetebilir" ON admin_users;
DROP POLICY IF EXISTS "Kullanıcı kendi bilgilerini görebilir" ON admin_users;
DROP TABLE IF EXISTS admin_users;

-- Admin kullanıcıları tablosu
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  ad_soyad TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor'))
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Sadece admin kullanıcıları görebilir ve düzenleyebilir
CREATE POLICY "Admin kullanıcıları yönetebilir" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Kullanıcı kendi bilgilerini görebilir
CREATE POLICY "Kullanıcı kendi bilgilerini görebilir" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- İlk admin kullanıcısını oluştur
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@nakliyatpro.com', crypt('admin123', gen_salt('bf')), now())
ON CONFLICT (email) DO NOTHING;

-- İlk admin kullanıcısını admin_users tablosuna ekle
INSERT INTO admin_users (id, email, ad_soyad, role)
SELECT id, email, 'Admin Kullanıcı', 'admin'
FROM auth.users
WHERE email = 'admin@nakliyatpro.com'
ON CONFLICT (id) DO NOTHING; 