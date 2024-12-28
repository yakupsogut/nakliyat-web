-- İstatistikler tablosu
CREATE TABLE istatistikler (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  baslik TEXT NOT NULL,
  deger TEXT NOT NULL,
  aciklama TEXT,
  ikon TEXT,
  siralama INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true
);

-- RLS Politikası
ALTER TABLE istatistikler ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İstatistikleri herkes görebilir" ON istatistikler
  FOR SELECT USING (true);

-- Örnek istatistikler
INSERT INTO istatistikler (baslik, deger, aciklama, ikon, siralama, aktif) VALUES
(
  'Tamamlanan Taşıma',
  '10.000+',
  'Başarıyla tamamlanan ev ve ofis taşıma sayısı',
  'truck',
  1,
  true
),
(
  'Mutlu Müşteri',
  '15.000+',
  'Hizmetlerimizden memnun kalan müşteri sayısı',
  'smile',
  2,
  true
),
(
  'Hizmet Yılı',
  '25+',
  'Sektörde geçirdiğimiz yıl sayısı',
  'calendar',
  3,
  true
),
(
  'Uzman Personel',
  '100+',
  'Deneyimli çalışan sayımız',
  'users',
  4,
  true
),
(
  'Araç Filosu',
  '50+',
  'Modern nakliye araçlarımızın sayısı',
  'truck-moving',
  5,
  true
),
(
  'Hizmet Bölgesi',
  '81 İl',
  'Türkiye genelinde hizmet verdiğimiz il sayısı',
  'map-marker',
  6,
  true
); 