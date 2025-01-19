CREATE TABLE hero_slides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_url TEXT,
    order_no INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Otomatik updated_at güncellemesi için trigger
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON hero_slides
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS politikaları
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Herkes görebilir
CREATE POLICY "Herkes hero sliderları görüntüleyebilir"
ON hero_slides
FOR SELECT
TO public
USING (true);

-- Sadece yetkilendirilmiş kullanıcılar ekleyebilir/düzenleyebilir/silebilir
CREATE POLICY "Yetkili kullanıcılar hero slider ekleyebilir"
ON hero_slides
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yetkili kullanıcılar hero sliderı düzenleyebilir"
ON hero_slides
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Yetkili kullanıcılar hero sliderı silebilir"
ON hero_slides
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated'); 