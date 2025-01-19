-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON features;
DROP POLICY IF EXISTS "Enable all access for service role" ON features;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON features
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON features
    FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Enable update for authenticated users" ON features
    FOR UPDATE USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Enable delete for authenticated users" ON features
    FOR DELETE USING (auth.role() IN ('authenticated', 'service_role'));

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_features_updated_at ON features;

CREATE TRIGGER update_features_updated_at
    BEFORE UPDATE ON features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 