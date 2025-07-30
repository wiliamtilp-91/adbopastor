-- Fix security issues by restricting policies to authenticated users only

-- Fix app_configurations policies
DROP POLICY IF EXISTS "Only admins can manage app configurations" ON public.app_configurations;
CREATE POLICY "Only admins can manage app configurations" 
ON public.app_configurations 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Fix prayer_requests policies  
DROP POLICY IF EXISTS "Users can view their own prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Users can create their own prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Users can update their own prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can view all prayer requests" ON public.prayer_requests;
DROP POLICY IF EXISTS "Admins can update all prayer requests" ON public.prayer_requests;

CREATE POLICY "Users can view their own prayer requests" 
ON public.prayer_requests 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer requests" 
ON public.prayer_requests 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests" 
ON public.prayer_requests 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all prayer requests" 
ON public.prayer_requests 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update all prayer requests" 
ON public.prayer_requests 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Fix testimonies policies
DROP POLICY IF EXISTS "Users can view their own testimonies" ON public.testimonies;
DROP POLICY IF EXISTS "Users can create their own testimonies" ON public.testimonies;
DROP POLICY IF EXISTS "Users can update their own testimonies" ON public.testimonies;
DROP POLICY IF EXISTS "Admins can view all testimonies" ON public.testimonies;
DROP POLICY IF EXISTS "Admins can update all testimonies" ON public.testimonies;
DROP POLICY IF EXISTS "Everyone can view approved testimonies" ON public.testimonies;

CREATE POLICY "Users can view their own testimonies" 
ON public.testimonies 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own testimonies" 
ON public.testimonies 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonies" 
ON public.testimonies 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all testimonies" 
ON public.testimonies 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update all testimonies" 
ON public.testimonies 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Authenticated users can view approved testimonies" 
ON public.testimonies 
FOR SELECT 
TO authenticated
USING (is_approved = true);

-- Fix galleries policies
DROP POLICY IF EXISTS "Everyone can view active galleries" ON public.galleries;
DROP POLICY IF EXISTS "Admins can manage all galleries" ON public.galleries;

CREATE POLICY "Authenticated users can view active galleries" 
ON public.galleries 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage all galleries" 
ON public.galleries 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Fix gallery_photos policies
DROP POLICY IF EXISTS "Everyone can view approved photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Users can upload photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Admins can manage all photos" ON public.gallery_photos;

CREATE POLICY "Authenticated users can view approved photos" 
ON public.gallery_photos 
FOR SELECT 
TO authenticated
USING (is_approved = true);

CREATE POLICY "Users can upload photos" 
ON public.gallery_photos 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all photos" 
ON public.gallery_photos 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.generate_member_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;