-- Create the trigger for handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies on profiles to allow the trigger to insert
CREATE POLICY "Enable service role to insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Make sure users can view their own profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);