-- Add updated_at column to sss table
ALTER TABLE sss ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to have updated_at value
UPDATE sss SET updated_at = created_at WHERE updated_at IS NULL; 