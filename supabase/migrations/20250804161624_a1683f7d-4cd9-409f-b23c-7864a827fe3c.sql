-- CRITICAL SECURITY FIX: Prevent admin role escalation
-- Drop the existing policy that allows users to update their own profile (including is_admin)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create separate policies: one for regular profile updates, one for admin-only fields
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent users from updating admin status and member_id
  is_admin = (SELECT is_admin FROM public.profiles WHERE user_id = auth.uid()) AND
  member_id = (SELECT member_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Only admins can update admin status and member_id
CREATE POLICY "Only admins can update admin fields" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- FIX DATABASE FUNCTIONS: Add proper search_path for security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_member_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.member_id := 'AD' || LPAD(nextval('member_id_seq')::text, 6, '0');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- FIX MISSING RLS POLICIES: Add policies for tables with RLS enabled but no policies
-- For nods_page - only admins should manage these
CREATE POLICY "Only admins can manage nods_page" 
ON public.nods_page 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- For nods_page_section - only admins should manage these
CREATE POLICY "Only admins can manage nods_page_section" 
ON public.nods_page_section 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- For table_name - this appears to be a test/placeholder table, disable RLS or add admin-only policy
CREATE POLICY "Only admins can manage table_name" 
ON public.table_name 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- SECURITY ENHANCEMENT: Add audit logging for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- RESTRICT ANONYMOUS ACCESS: Require authentication for announcements and events
DROP POLICY IF EXISTS "Everyone can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Everyone can view events" ON public.events;

-- Replace with authenticated user policies
CREATE POLICY "Authenticated users can view announcements" 
ON public.announcements 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view events" 
ON public.events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only admins can manage announcements and events
CREATE POLICY "Only admins can manage announcements" 
ON public.announcements 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can manage events" 
ON public.events 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Add trigger for updated_at on admin_audit_log
CREATE TRIGGER update_admin_audit_log_updated_at
BEFORE UPDATE ON public.admin_audit_log
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();