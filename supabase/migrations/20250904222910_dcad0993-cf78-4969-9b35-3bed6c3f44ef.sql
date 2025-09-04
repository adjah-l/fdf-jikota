-- Create neighborhoods table
CREATE TABLE public.neighborhoods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_codes TEXT[] DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  active_dinners_count INTEGER DEFAULT 0,
  community_tags TEXT[] DEFAULT '{}',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

-- Create policies for neighborhoods (public read access)
CREATE POLICY "Anyone can view neighborhoods" 
ON public.neighborhoods 
FOR SELECT 
USING (true);

-- Create user_neighborhoods junction table
CREATE TABLE public.user_neighborhoods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES public.neighborhoods(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, neighborhood_id)
);

-- Enable RLS on user_neighborhoods
ALTER TABLE public.user_neighborhoods ENABLE ROW LEVEL SECURITY;

-- Create policies for user_neighborhoods
CREATE POLICY "Users can view their own neighborhood memberships" 
ON public.user_neighborhoods 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own neighborhood memberships" 
ON public.user_neighborhoods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own neighborhood memberships" 
ON public.user_neighborhoods 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for neighborhoods updated_at
CREATE TRIGGER update_neighborhoods_updated_at
BEFORE UPDATE ON public.neighborhoods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample neighborhoods
INSERT INTO public.neighborhoods (name, description, city, state, zip_codes, community_tags, latitude, longitude) VALUES
('Downtown Core', 'Vibrant urban living with great restaurants and nightlife', 'San Francisco', 'CA', ARRAY['94102', '94103', '94104'], ARRAY['Urban', 'Nightlife', 'Restaurants'], 37.7749, -122.4194),
('Mission District', 'Artistic community with amazing Mexican food and murals', 'San Francisco', 'CA', ARRAY['94110', '94114'], ARRAY['Artistic', 'Cultural', 'Food Scene'], 37.7599, -122.4148),
('Brooklyn Heights', 'Historic neighborhood with stunning Manhattan views', 'Brooklyn', 'NY', ARRAY['11201', '11202'], ARRAY['Historic', 'Family-Friendly', 'Views'], 40.6962, -73.9961),
('Williamsburg', 'Trendy area known for craft breweries and indie culture', 'Brooklyn', 'NY', ARRAY['11211', '11206'], ARRAY['Trendy', 'Breweries', 'Music'], 40.7081, -73.9571),
('Capitol Hill', 'Eclectic neighborhood with great coffee and music venues', 'Seattle', 'WA', ARRAY['98102', '98122'], ARRAY['Eclectic', 'Coffee', 'Music'], 47.6205, -122.3212);