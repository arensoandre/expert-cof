-- Add file_hash to analyses table for version control and duplicate detection
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS file_hash VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_analyses_file_hash ON analyses(file_hash);

-- Add version column to track COF versions for the same franchise
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS cof_version VARCHAR(20);
