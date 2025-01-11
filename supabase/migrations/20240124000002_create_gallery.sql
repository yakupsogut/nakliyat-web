CREATE TABLE gallery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    order_no INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Otomatik updated_at güncellemesi için trigger
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON gallery
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS politikaları
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Herkes görebilir
CREATE POLICY "Herkes galeri görsellerini görüntüleyebilir"
ON gallery
FOR SELECT
TO public
USING (true);

-- Sadece yetkilendirilmiş kullanıcılar ekleyebilir/düzenleyebilir/silebilir
CREATE POLICY "Yetkili kullanıcılar galeri ekleyebilir"
ON gallery
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yetkili kullanıcılar galeriyi düzenleyebilir"
ON gallery
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yetkili kullanıcılar galeriyi silebilir"
ON gallery
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated'); 