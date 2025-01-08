-- Hizmetler tablosunu güncelle
ALTER TABLE public.hizmetler 
ADD COLUMN IF NOT EXISTS aktif BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS siralama INTEGER DEFAULT 0;

-- Mevcut kayıtlar için sıralama değerlerini güncelle
WITH indexed_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_order
  FROM public.hizmetler
)
UPDATE public.hizmetler h
SET siralama = ir.new_order
FROM indexed_rows ir
WHERE h.id = ir.id;

-- RLS politikalarını güncelle
DROP POLICY IF EXISTS "Hizmetleri herkes görebilir" ON public.hizmetler;
DROP POLICY IF EXISTS "Sadece yetkililer düzenleyebilir" ON public.hizmetler;

ALTER TABLE public.hizmetler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hizmetleri herkes görebilir"
ON public.hizmetler FOR SELECT
TO public
USING (true);

CREATE POLICY "Sadece yetkililer düzenleyebilir"
ON public.hizmetler 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true); 