-- Create volunteer roles table
CREATE TABLE IF NOT EXISTS public.volunteer_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role_name TEXT NOT NULL CHECK (role_name IN ('media_admin', 'content_creator', 'event_manager', 'study_coordinator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(user_id, role_name)
);

-- Enable RLS
ALTER TABLE public.volunteer_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for volunteer roles
CREATE POLICY "Only admins can manage volunteer roles"
ON public.volunteer_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Add ministry field to family_members table to match main profile
ALTER TABLE public.family_members 
ADD COLUMN IF NOT EXISTS ministry TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Brasil',
ADD COLUMN IF NOT EXISTS church_name TEXT,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Create bible_studies table for PDF/Word uploads
CREATE TABLE IF NOT EXISTS public.bible_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'doc', 'docx')),
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for bible_studies
ALTER TABLE public.bible_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for bible_studies
CREATE POLICY "Authenticated users can view active bible studies"
ON public.bible_studies
FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins and content creators can manage bible studies"
ON public.bible_studies
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  ) OR
  EXISTS (
    SELECT 1 FROM volunteer_roles 
    WHERE volunteer_roles.user_id = auth.uid() 
    AND volunteer_roles.role_name IN ('content_creator', 'study_coordinator')
  )
);

-- Create ebd_lessons table for Sunday School materials
CREATE TABLE IF NOT EXISTS public.ebd_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.ebd_categories(id),
  lesson_date DATE,
  file_url TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'doc', 'docx')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS for ebd_lessons
ALTER TABLE public.ebd_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for ebd_lessons
CREATE POLICY "Authenticated users can view active ebd lessons"
ON public.ebd_lessons
FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins and study coordinators can manage ebd lessons"
ON public.ebd_lessons
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  ) OR
  EXISTS (
    SELECT 1 FROM volunteer_roles 
    WHERE volunteer_roles.user_id = auth.uid() 
    AND volunteer_roles.role_name IN ('content_creator', 'study_coordinator')
  )
);

-- Update gallery_photos policy to restrict uploads to media admins only
DROP POLICY IF EXISTS "Users can upload photos" ON public.gallery_photos;

CREATE POLICY "Only media admins can upload photos"
ON public.gallery_photos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  ) OR
  EXISTS (
    SELECT 1 FROM volunteer_roles 
    WHERE volunteer_roles.user_id = auth.uid() 
    AND volunteer_roles.role_name = 'media_admin'
  )
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_volunteer_roles_updated_at
  BEFORE UPDATE ON public.volunteer_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bible_studies_updated_at
  BEFORE UPDATE ON public.bible_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ebd_lessons_updated_at
  BEFORE UPDATE ON public.ebd_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();