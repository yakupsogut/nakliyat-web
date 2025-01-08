-- İstatistikler tablosuna gerekli kolonları ekle
ALTER TABLE public.istatistikler 
ADD COLUMN IF NOT EXISTS aktif BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS siralama INTEGER DEFAULT 0;

-- Mevcut kayıtlar için sıralama değerlerini güncelle
WITH indexed_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_order
  FROM public.istatistikler
)
UPDATE public.istatistikler i
SET siralama = ir.new_order
FROM indexed_rows ir
WHERE i.id = ir.id;

-- Sıralama için index ekle
CREATE INDEX IF NOT EXISTS idx_istatistikler_siralama ON public.istatistikler(siralama);

-- RLS politikalarını güncelle
ALTER TABLE public.istatistikler ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Sadece yetkililer düzenleyebilir"
ON public.istatistikler FOR ALL
TO authenticated
USING (true)
WITH CHECK (true); 