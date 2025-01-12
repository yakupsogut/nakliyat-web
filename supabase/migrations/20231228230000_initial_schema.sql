-- Hizmetler tablosu
CREATE TABLE hizmetler (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  baslik TEXT NOT NULL,
  aciklama TEXT NOT NULL,
  resim_url TEXT,
  aktif BOOLEAN DEFAULT true,
  siralama INTEGER DEFAULT 0,
  ozellikler TEXT[] DEFAULT '{}'::TEXT[]
);

-- Teklifler tablosu
CREATE TABLE teklifler (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ad_soyad TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL,
  hizmet_turu TEXT NOT NULL,
  tasima_tarihi TEXT NOT NULL,
  nereden_adres TEXT NOT NULL,
  nereye_adres TEXT NOT NULL,
  notlar TEXT
);

-- İletişim mesajları tablosu
CREATE TABLE iletisim_mesajlari (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ad_soyad TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL,
  mesaj TEXT NOT NULL
);

-- Referanslar tablosu
CREATE TABLE referanslar (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  musteri_adi TEXT NOT NULL,
  yorum TEXT NOT NULL,
  puan INTEGER NOT NULL CHECK (puan >= 1 AND puan <= 5),
  hizmet_turu TEXT NOT NULL,
  gorsel_url TEXT
);

-- RLS Politikaları
ALTER TABLE hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE teklifler ENABLE ROW LEVEL SECURITY;
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE referanslar ENABLE ROW LEVEL SECURITY;

-- Hizmetler için politikalar
CREATE POLICY "Hizmetleri herkes görebilir" ON hizmetler
  FOR SELECT USING (true);

-- Teklifler için politikalar
CREATE POLICY "Herkes teklif oluşturabilir" ON teklifler
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sadece yöneticiler teklifleri görebilir" ON teklifler
  FOR SELECT USING (auth.role() = 'authenticated');

-- İletişim mesajları için politikalar
CREATE POLICY "Herkes mesaj gönderebilir" ON iletisim_mesajlari
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sadece yöneticiler mesajları görebilir" ON iletisim_mesajlari
  FOR SELECT USING (auth.role() = 'authenticated');

-- Referanslar için politikalar
CREATE POLICY "Referansları herkes görebilir" ON referanslar
  FOR SELECT USING (true);

-- Başlangıç hizmetleri
INSERT INTO hizmetler (baslik, aciklama, resim_url, aktif, siralama, ozellikler) VALUES
(
  'Evden Eve Nakliyat',
  'Profesyonel ekibimiz ve modern ekipmanlarımızla evinizi güvenle yeni adresinize taşıyoruz. Eşyalarınızın güvenliği ve sizin memnuniyetiniz bizim için en önemli öncelik.',
  'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80',
  true,
  1,
  ARRAY[
    'Profesyonel paketleme hizmeti',
    'Demontaj ve montaj hizmeti',
    'Sigortalı taşımacılık',
    'Özel eşya taşıma',
    'Eşya depolama imkanı',
    'Ücretsiz ekspertiz'
  ]
),
(
  'Kurumsal Nakliyat',
  'Ofis ve şirket taşımacılığında uzman kadromuzla kesintisiz hizmet sunuyoruz. İş süreçlerinizi aksatmadan, profesyonel çözümlerle taşınmanızı gerçekleştiriyoruz.',
  'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80',
  true,
  2,
  ARRAY[
    'Ofis ekipmanları taşıma',
    'Arşiv ve döküman taşıma',
    'Hafta sonu taşıma seçeneği',
    'IT ekipmanları taşıma',
    'Proje yönetimi',
    'Sigortalı taşımacılık'
  ]
),
(
  'Asansörlü Taşımacılık',
  'Modern asansör sistemlerimizle yüksek katlara güvenli ve hızlı taşıma hizmeti sağlıyoruz. Dar merdiven ve koridorlarda bile eşyalarınızı hasarsız şekilde taşıyoruz.',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
  true,
  3,
  ARRAY[
    '30 kata kadar ulaşım',
    'Geniş platform',
    'Hızlı kurulum',
    'Güvenlik sistemleri',
    'Deneyimli operatör',
    'Sigortalı hizmet'
  ]
),
(
  'Şehirler Arası Nakliyat',
  'Türkiye''nin her noktasına güvenli ve hızlı taşımacılık hizmeti sunuyoruz. Şehirler arası taşınmalarınızda profesyonel çözümler üretiyoruz.',
  'https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?auto=format&fit=crop&q=80',
  true,
  4,
  ARRAY[
    'Parsiyel taşıma seçeneği',
    'Araç takip sistemi',
    'Profesyonel şoförler',
    'Tam zamanlı teslimat',
    'Özel ambalajlama',
    'Sigortalı taşıma'
  ]
),
(
  'Depolama Hizmetleri',
  'Güvenli ve modern depolama tesislerimizde eşyalarınızı istediğiniz süre boyunca muhafaza ediyoruz. Kısa ve uzun dönem depolama çözümleri sunuyoruz.',
  'https://images.unsplash.com/photo-1719937206341-38a6392dfdef?auto=format&fit=crop&q=80',
  true,
  5,
  ARRAY[
    'Klimatik kontrol',
    '7/24 güvenlik',
    'Sigortalı depolama',
    'Esnek süre seçenekleri',
    'Online takip sistemi',
    'Profesyonel paketleme'
  ]
); 