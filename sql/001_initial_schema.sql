-- Teklif tablosu
CREATE TABLE IF NOT EXISTS teklifler (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_soyad TEXT NOT NULL,
    email TEXT NOT NULL,
    telefon TEXT NOT NULL,
    nereden TEXT NOT NULL,
    nereye TEXT NOT NULL,
    esya_boyutu TEXT NOT NULL,
    asansor_var_mi BOOLEAN DEFAULT false,
    tarih DATE NOT NULL,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İletişim mesajları tablosu
CREATE TABLE IF NOT EXISTS iletisim_mesajlari (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_soyad TEXT NOT NULL,
    email TEXT NOT NULL,
    telefon TEXT NOT NULL,
    mesaj TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referanslar tablosu
CREATE TABLE IF NOT EXISTS referanslar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    musteri_adi TEXT NOT NULL,
    yorum TEXT NOT NULL,
    puan INTEGER CHECK (puan >= 1 AND puan <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hizmetler tablosu
CREATE TABLE IF NOT EXISTS hizmetler (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    baslik TEXT NOT NULL,
    aciklama TEXT NOT NULL,
    resim_url TEXT,
    sira INTEGER,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 