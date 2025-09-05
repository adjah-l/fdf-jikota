-- Add comprehensive profile fields based on the 5C form
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS family_profile TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age_group TEXT;

-- Location fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state_region TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS neighborhood_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS development_subdivision TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS closest_fd_city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS new_to_city TEXT;

-- Spouse information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spouse_first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spouse_last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spouse_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spouse_phone TEXT;

-- Family details
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS children_ages TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS season_interest TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS group_interest TEXT;

-- Personal preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_dinner_meal TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_dessert TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activities TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_from_home TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hometown TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ways_to_serve TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS willing_to_welcome BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instagram_handle TEXT;

-- Update the full_name column to be computed from first and last name
UPDATE public.profiles 
SET first_name = SPLIT_PART(full_name, ' ', 1),
    last_name = CASE 
        WHEN LENGTH(full_name) - LENGTH(REPLACE(full_name, ' ', '')) > 0 
        THEN SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1) 
        ELSE '' 
    END
WHERE full_name IS NOT NULL AND first_name IS NULL;

-- Create enums for better data consistency
CREATE TYPE family_profile_type AS ENUM (
    'married_no_children',
    'single_no_children', 
    'married_with_children',
    'single_with_children'
);

CREATE TYPE age_group_type AS ENUM (
    '22-24',
    '25-34',
    '35-44', 
    '45-54',
    '55+'
);

CREATE TYPE work_from_home_type AS ENUM (
    'yes_100_percent',
    'yes_3_days',
    'hybrid',
    'no'
);

CREATE TYPE new_to_city_type AS ENUM (
    'yes_less_3_months',
    'yes_less_year',
    'no'
);

-- We'll keep the columns as TEXT for now to maintain flexibility, but these enums can be used for validation