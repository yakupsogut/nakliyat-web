-- Drop existing policies
DROP POLICY IF EXISTS "Referansları herkes görebilir" ON referanslar;
DROP POLICY IF EXISTS "Referansları sadece yetkililer düzenleyebilir" ON referanslar;
DROP POLICY IF EXISTS "Referansları sadece yetkililer silebilir" ON referanslar;
DROP POLICY IF EXISTS "Referansları sadece yetkililer ekleyebilir" ON referanslar;

-- Enable RLS
ALTER TABLE referanslar ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Referansları herkes görebilir"
ON referanslar FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Referansları sadece yetkililer düzenleyebilir"
ON referanslar FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
);

CREATE POLICY "Referansları sadece yetkililer silebilir"
ON referanslar FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
);

CREATE POLICY "Referansları sadece yetkililer ekleyebilir"
ON referanslar FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
); 