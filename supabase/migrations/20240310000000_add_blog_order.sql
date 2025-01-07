-- Blog tablosuna sıralama kolonu ekleme
ALTER TABLE blog ADD COLUMN siralama INTEGER DEFAULT 0;

-- Mevcut blog yazılarına otomatik sıralama atama
WITH numbered_blogs AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM blog
)
UPDATE blog
SET siralama = numbered_blogs.row_num
FROM numbered_blogs
WHERE blog.id = numbered_blogs.id; 