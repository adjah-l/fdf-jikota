-- Add new fields to neighborhoods table for enhanced metrics
ALTER TABLE neighborhoods 
ADD COLUMN family_count integer DEFAULT 0,
ADD COLUMN family_groups_count integer DEFAULT 0,
ADD COLUMN current_season text DEFAULT 'Winter',
ADD COLUMN state_region text,
ADD COLUMN country text DEFAULT 'USA';

-- Update existing neighborhoods with default values
UPDATE neighborhoods 
SET family_count = 0, 
    family_groups_count = 0, 
    current_season = 'Winter',
    country = 'USA'
WHERE family_count IS NULL OR family_groups_count IS NULL;