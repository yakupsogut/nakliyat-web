-- Önce mevcut kayıtları temizleyelim ama en son eklenen kayıtları saklayalım
DO $$
BEGIN
  -- site_settings tablosunu temizle
  DELETE FROM site_settings
  WHERE id NOT IN (
    SELECT id 
    FROM site_settings 
    ORDER BY created_at DESC 
    LIMIT 1
  );

  -- site_ayarlari tablosunu temizle
  DELETE FROM site_ayarlari
  WHERE id NOT IN (
    SELECT id 
    FROM site_ayarlari 
    ORDER BY created_at DESC 
    LIMIT 1
  );
END $$;

-- Her tabloya bir dummy column ekle ve UNIQUE constraint ile sınırla
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS is_singleton boolean DEFAULT true;
ALTER TABLE site_settings ADD CONSTRAINT site_settings_singleton_unique UNIQUE (is_singleton);

ALTER TABLE site_ayarlari ADD COLUMN IF NOT EXISTS is_singleton boolean DEFAULT true;
ALTER TABLE site_ayarlari ADD CONSTRAINT site_ayarlari_singleton_unique UNIQUE (is_singleton);

-- Trigger fonksiyonu oluştur
CREATE OR REPLACE FUNCTION prevent_multiple_settings()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_singleton := true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları ekle
DROP TRIGGER IF EXISTS prevent_multiple_site_settings ON site_settings;
CREATE TRIGGER prevent_multiple_site_settings
BEFORE INSERT OR UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION prevent_multiple_settings();

DROP TRIGGER IF EXISTS prevent_multiple_site_ayarlari ON site_ayarlari;
CREATE TRIGGER prevent_multiple_site_ayarlari
BEFORE INSERT OR UPDATE ON site_ayarlari
FOR EACH ROW
EXECUTE FUNCTION prevent_multiple_settings(); 