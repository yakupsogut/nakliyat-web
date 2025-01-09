-- trigger_set_timestamp fonksiyonunu oluştur
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Telegram bildirimleri tablosunu oluştur
CREATE TABLE telegram_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Otomatik updated_at güncellemesi için trigger
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON telegram_notifications
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS politikaları
ALTER TABLE telegram_notifications ENABLE ROW LEVEL SECURITY;

-- Sadece yetkilendirilmiş kullanıcılar okuyabilir
CREATE POLICY "Yetkili kullanıcılar telegram bildirimlerini görüntüleyebilir"
ON telegram_notifications
FOR SELECT
TO authenticated
USING (
    auth.role() = 'authenticated'
);

-- Sadece yetkilendirilmiş kullanıcılar ekleyebilir/düzenleyebilir/silebilir
CREATE POLICY "Yetkili kullanıcılar telegram bildirimleri ekleyebilir"
ON telegram_notifications
FOR INSERT
TO authenticated
WITH CHECK (
    auth.role() = 'authenticated'
);

CREATE POLICY "Yetkili kullanıcılar telegram bildirimlerini düzenleyebilir"
ON telegram_notifications
FOR UPDATE
TO authenticated
USING (
    auth.role() = 'authenticated'
)
WITH CHECK (
    auth.role() = 'authenticated'
);

CREATE POLICY "Yetkili kullanıcılar telegram bildirimlerini silebilir"
ON telegram_notifications
FOR DELETE
TO authenticated
USING (
    auth.role() = 'authenticated'
); 