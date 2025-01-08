-- Add siralama column
ALTER TABLE referanslar ADD COLUMN IF NOT EXISTS siralama INTEGER DEFAULT 0;

-- Update existing records with sequential siralama
WITH indexed_referanslar AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM referanslar
)
UPDATE referanslar
SET siralama = indexed_referanslar.row_num
FROM indexed_referanslar
WHERE referanslar.id = indexed_referanslar.id;

-- Create function to auto-increment siralama for new records
CREATE OR REPLACE FUNCTION set_referans_siralama()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.siralama IS NULL OR NEW.siralama = 0 THEN
    SELECT COALESCE(MAX(siralama), 0) + 1
    INTO NEW.siralama
    FROM referanslar;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-set siralama
DROP TRIGGER IF EXISTS set_referans_siralama_trigger ON referanslar;
CREATE TRIGGER set_referans_siralama_trigger
BEFORE INSERT ON referanslar
FOR EACH ROW
EXECUTE FUNCTION set_referans_siralama(); 