-- Set a test user as admin (replace with actual email when testing)
-- You can change this email to your test user's email
UPDATE public.profiles 
SET is_admin = true 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'admin@test.com' -- Change this to your test email
  LIMIT 1
);

-- If the above doesn't work (no users yet), we'll create a function to set admin later
-- Create a function that can be called to make any user admin
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_found RECORD;
BEGIN
  -- Find the user by email
  SELECT id INTO user_found FROM auth.users WHERE email = user_email;
  
  IF NOT FOUND THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Update the profile to set as admin
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE user_id = user_found.id;
  
  IF NOT FOUND THEN
    RETURN 'Profile not found for user: ' || user_email;
  END IF;
  
  RETURN 'User ' || user_email || ' has been set as admin successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;