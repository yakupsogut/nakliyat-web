-- First disable RLS
ALTER TABLE iletisim_mesajlari DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'iletisim_mesajlari'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON iletisim_mesajlari', pol.policyname);
    END LOOP;
END $$;

-- Enable RLS
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;

-- Create a single policy for all operations
CREATE POLICY "iletisim_policy"
ON iletisim_mesajlari
FOR ALL
TO public
USING (true)
WITH CHECK (true); 