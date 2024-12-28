-- SSS tablosu
CREATE TABLE sss (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  soru TEXT NOT NULL,
  cevap TEXT NOT NULL,
  kategori TEXT NOT NULL,
  siralama INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true
);

-- RLS Politikası
ALTER TABLE sss ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SSS herkes görebilir" ON sss
  FOR SELECT USING (true);

-- Örnek SSS verileri
INSERT INTO sss (soru, cevap, kategori, siralama, aktif) VALUES
(
  'Eşyalarım taşınırken sigortalı mı?',
  'Evet, tüm eşyalarınız taşıma süresince tam kapsamlı olarak sigortalıdır. Nakliyat sigortası, eşyalarınızın taşınma sırasında oluşabilecek hasarlara karşı güvence altına alınmasını sağlar.',
  'Sigorta',
  1,
  true
),
(
  'Taşınma süreci ne kadar sürer?',
  'Taşınma süresi, eşya miktarı, mesafe ve kat durumu gibi faktörlere göre değişiklik gösterir. Ortalama bir ev taşıması 4-8 saat arasında tamamlanır. Şehirler arası taşımacılıkta bu süre mesafeye göre 1-3 gün olabilir.',
  'Süreç',
  2,
  true
),
(
  'Paketleme hizmeti veriyor musunuz?',
  'Evet, profesyonel paketleme hizmeti sunuyoruz. Uzman ekibimiz, eşyalarınızı özel paketleme malzemeleri kullanarak güvenle paketler. Bu hizmet, eşyalarınızın taşınma sırasında zarar görmesini önler.',
  'Hizmetler',
  3,
  true
),
(
  'Asansörlü taşıma hizmeti nasıl çalışır?',
  'Asansörlü taşıma sistemi, yüksek katlara eşya taşımayı kolaylaştıran modern bir çözümdür. 30 kata kadar ulaşabilen asansör sistemimiz, dar merdivenlerde oluşabilecek hasarları önler ve taşıma süresini kısaltır.',
  'Hizmetler',
  4,
  true
),
(
  'Depolama hizmetiniz güvenli mi?',
  'Depolama alanlarımız 7/24 kamera sistemi ile izlenmekte ve güvenlik personeli tarafından korunmaktadır. Klimatik kontrol sistemi ile eşyalarınız nem ve sıcaklık değişimlerinden etkilenmez.',
  'Depolama',
  5,
  true
),
(
  'Ödeme seçenekleriniz nelerdir?',
  'Nakit, kredi kartı ve kurumsal müşterilerimiz için havale/EFT ile ödeme kabul ediyoruz. Kredi kartına taksit imkanımız mevcuttur. Fiyat teklifimiz, keşif sonrası net olarak belirlenir.',
  'Ödeme',
  6,
  true
),
(
  'Şehirler arası taşımacılıkta teslimat süresi nedir?',
  'Şehirler arası taşımacılıkta teslimat süresi, mesafeye ve hava koşullarına göre değişiklik gösterir. Ortalama 500 km için 1 gün, 1000 km için 2 gün teslimat süremiz vardır.',
  'Süreç',
  7,
  true
),
(
  'Eşyalarım başka eşyalarla birlikte mi taşınıyor?',
  'Hayır, eşyalarınız sadece size özel araçlarımızla taşınır. Parsiyel taşıma talep edilmediği sürece, araç içerisinde başka müşterilere ait eşya bulunmaz.',
  'Hizmetler',
  8,
  true
),
(
  'Montaj/demontaj hizmeti veriyor musunuz?',
  'Evet, uzman marangoz ekibimiz tüm mobilyalarınızın sökümünü ve yeni evinizde montajını gerçekleştirir. Bu hizmet, standart taşıma paketimize dahildir.',
  'Hizmetler',
  9,
  true
),
(
  'Acil taşınma durumunda ne kadar sürede hizmet veriyorsunuz?',
  'Acil taşınma taleplerinize 24 saat içinde yanıt veriyoruz. Müsait araç ve ekip durumuna göre aynı gün içinde bile taşınma işleminizi gerçekleştirebiliriz.',
  'Süreç',
  10,
  true
); 