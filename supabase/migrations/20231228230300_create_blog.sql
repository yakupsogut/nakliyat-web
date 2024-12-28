-- Blog tablosu
CREATE TABLE blog (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  baslik TEXT NOT NULL,
  ozet TEXT NOT NULL,
  icerik TEXT NOT NULL,
  kapak_resmi TEXT,
  yazar TEXT NOT NULL,
  kategori TEXT NOT NULL,
  etiketler TEXT[] DEFAULT '{}'::TEXT[],
  okunma_sayisi INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true,
  slug TEXT UNIQUE NOT NULL
);

-- RLS Politikası
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog yazılarını herkes görebilir" ON blog
  FOR SELECT USING (true);

-- Örnek blog yazıları
INSERT INTO blog (baslik, ozet, icerik, kapak_resmi, yazar, kategori, etiketler, aktif, slug) VALUES
(
  'Güvenli Taşınmanın 10 Altın Kuralı',
  'Taşınma sürecini sorunsuz atlatmak için dikkat edilmesi gereken önemli noktaları derledik.',
  'Taşınma süreci, hayatımızın en stresli dönemlerinden biri olabilir. Ancak doğru planlama ve hazırlık ile bu süreci çok daha kolay atlatabilirsiniz.

1. Erken Planlama Yapın
Taşınma tarihinden en az 1 ay önce planlamaya başlayın. Bu size yeterli hazırlık süresi sağlayacaktır.

2. Profesyonel Destek Alın
Güvenilir ve deneyimli bir nakliyat firması ile çalışmak, sürecin sorunsuz ilerlemesini sağlar.

3. Eşyalarınızı Düzenleyin
Taşınmadan önce kullanmadığınız eşyaları ayırın. Bu hem taşıma maliyetini düşürür hem de yeni evinizde gereksiz yer işgal etmez.

4. Doğru Paketleme
Kırılacak eşyalar için özel paketleme malzemeleri kullanın. Her kutunun üzerine içeriğini ve hangi odaya ait olduğunu yazın.

5. Değerli Eşyalarınıza Dikkat
Önemli evraklar, mücevherler gibi değerli eşyalarınızı yanınızda taşıyın.

6. Sigorta Yaptırın
Eşyalarınızın taşınma sırasında zarar görmesine karşı mutlaka sigorta yaptırın.

7. Yeni Evinizi Hazırlayın
Taşınmadan önce yeni evinizin temizliğini yaptırın ve gerekli tadilatları tamamlayın.

8. Hizmetleri Aktarın
İnternet, elektrik, su gibi aboneliklerin naklini önceden planlayın.

9. Acil Durum Çantası Hazırlayın
İlk gün ihtiyacınız olacak eşyaları ayrı bir çantada bulundurun.

10. Esnek Olun
Taşınma günü beklenmedik durumlar olabilir. Esnek ve sakin olmak süreci kolaylaştırır.',
  'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80',
  'Mehmet Yılmaz',
  'Taşınma İpuçları',
  ARRAY['taşınma', 'ipuçları', 'nakliyat', 'planlama'],
  true,
  'guvenli-tasinmanin-10-altin-kurali'
),
(
  'Eşya Depolamanın Püf Noktaları',
  'Eşyalarınızı güvenle depolamak için bilmeniz gereken önemli detayları açıklıyoruz.',
  'Eşya depolama, ev tadilatı, uzun süreli seyahat veya taşınma gibi durumlarda sıkça ihtiyaç duyulan bir hizmettir. İşte eşyalarınızı güvenle depolamak için dikkat etmeniz gerekenler:

Depolama Alanı Seçimi
- Klimatik kontrollü alanlar tercih edin
- Güvenlik sistemlerini kontrol edin
- Kolay ulaşılabilir lokasyonlar seçin

Paketleme İpuçları
- Nem alıcılar kullanın
- Mobilyaları örtülerle kaplayın
- Kırılacak eşyaları özel malzemelerle paketleyin

Düzenli Kontrol
- Belirli aralıklarla eşyalarınızı kontrol edin
- Havalandırma durumunu gözden geçirin
- Olası hasarları erken tespit edin

Sigorta
- Depolama süresince sigorta yaptırın
- Poliçe kapsamını detaylı inceleyin
- Değerli eşyaları ayrıca bildirin',
  'https://images.unsplash.com/photo-1586528116493-d654c66d18b7?auto=format&fit=crop&q=80',
  'Ayşe Demir',
  'Depolama',
  ARRAY['depolama', 'eşya depolama', 'güvenli depolama'],
  true,
  'esya-depolamanin-puf-noktalari'
); 