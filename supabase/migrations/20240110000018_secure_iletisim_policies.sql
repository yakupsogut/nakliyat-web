-- Drop existing policies if any
DROP POLICY IF EXISTS "iletisim_policy" ON iletisim_mesajlari;
DROP POLICY IF EXISTS "iletisim_insert_policy" ON iletisim_mesajlari;
DROP POLICY IF EXISTS "iletisim_select_policy" ON iletisim_mesajlari;
DROP POLICY IF EXISTS "iletisim_delete_policy" ON iletisim_mesajlari;

-- Enable RLS (if not already enabled)
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;

-- Create new secure policies
CREATE POLICY "iletisim_insert_policy"
ON iletisim_mesajlari 
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "iletisim_select_policy"
ON iletisim_mesajlari 
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
);

CREATE POLICY "iletisim_delete_policy"
ON iletisim_mesajlari 
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
); 