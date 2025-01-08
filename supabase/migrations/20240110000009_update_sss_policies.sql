-- Drop existing policies
DROP POLICY IF EXISTS "SSS herkes görebilir" ON sss;
DROP POLICY IF EXISTS "SSS sadece yetkililer düzenleyebilir" ON sss;
DROP POLICY IF EXISTS "SSS sadece yetkililer silebilir" ON sss;
DROP POLICY IF EXISTS "SSS sadece yetkililer ekleyebilir" ON sss;

-- Enable RLS
ALTER TABLE sss ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "SSS herkes görebilir"
ON sss FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "SSS sadece yetkililer düzenleyebilir"
ON sss FOR UPDATE
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

CREATE POLICY "SSS sadece yetkililer silebilir"
ON sss FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
);

CREATE POLICY "SSS sadece yetkililer ekleyebilir"
ON sss FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
); 