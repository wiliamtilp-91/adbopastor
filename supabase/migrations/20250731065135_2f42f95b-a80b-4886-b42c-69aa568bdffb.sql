-- First, ensure the column exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create a function to set admin status
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email text)
RETURNS void AS $$
BEGIN
    UPDATE profiles p
    SET is_admin = TRUE
    FROM auth.users u
    WHERE u.email = user_email AND u.id = p.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example of calling the function
SELECT public.set_user_as_admin('wiliamtilp@gmail.com');