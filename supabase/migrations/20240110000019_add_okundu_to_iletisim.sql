ALTER TABLE iletisim_mesajlari
ADD COLUMN okundu boolean DEFAULT false;

-- Mevcut kayıtları false olarak işaretle
UPDATE iletisim_mesajlari SET okundu = false WHERE okundu IS NULL; 