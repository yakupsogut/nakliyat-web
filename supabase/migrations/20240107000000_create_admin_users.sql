-- Önce var olan tabloyu temizle
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

-- Row Level Security'yi etkinleştir
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY; 