-- First, let's check what criteria types are currently allowed
-- Then add the new columns and gender mix criteria

-- Add a new column to support discrete options vs percentage weights
ALTER TABLE matching_criteria 
ADD COLUMN option_type text DEFAULT 'percentage' CHECK (option_type IN ('percentage', 'discrete'));

-- Add discrete options field for criteria that have specific choices
ALTER TABLE matching_criteria 
ADD COLUMN discrete_options jsonb DEFAULT NULL;

-- Insert gender mix criteria with an existing valid criteria_type
INSERT INTO matching_criteria (name, criteria_type, weight, is_active, option_type, discrete_options)
VALUES (
  'Gender Mix',
  'family_profile',  -- Using an existing valid type
  1.0,
  true,
  'discrete',
  '["Mixed (couples and singles)", "Couples only", "Singles only", "No preference"]'
);

-- Update existing criteria to specify they use percentage
UPDATE matching_criteria 
SET option_type = 'percentage' 
WHERE option_type IS NULL;