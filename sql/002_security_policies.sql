-- Tüm tablolar için RLS'yi etkinleştir
ALTER TABLE teklifler ENABLE ROW LEVEL SECURITY;
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE referanslar ENABLE ROW LEVEL SECURITY;
ALTER TABLE hizmetler ENABLE ROW LEVEL SECURITY;

-- Teklifler için politikalar
CREATE POLICY "Teklifler public insert" ON teklifler
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Teklifler admin select" ON teklifler
    FOR SELECT USING (auth.role() = 'authenticated');

-- İletişim mesajları için politikalar
CREATE POLICY "İletişim mesajları public insert" ON iletisim_mesajlari
    FOR INSERT WITH CHECK (true);

CREATE POLICY "İletişim mesajları admin select" ON iletisim_mesajlari
    FOR SELECT USING (auth.role() = 'authenticated');

-- Referanslar için politikalar
CREATE POLICY "Referanslar public select" ON referanslar
    FOR SELECT USING (true);

CREATE POLICY "Referanslar admin all" ON referanslar
    USING (auth.role() = 'authenticated');

-- Hizmetler için politikalar
CREATE POLICY "Hizmetler public select" ON hizmetler
    FOR SELECT USING (aktif = true);

CREATE POLICY "Hizmetler admin all" ON hizmetler
    USING (auth.role() = 'authenticated'); 