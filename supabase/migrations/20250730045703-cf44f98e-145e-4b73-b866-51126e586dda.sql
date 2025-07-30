-- Add admin fields and create necessary tables for admin dashboard

-- Add is_admin field to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create table for app configurations
CREATE TABLE IF NOT EXISTS public.app_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for prayer requests
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for testimonies
CREATE TABLE IF NOT EXISTS public.testimonies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for photo galleries
CREATE TABLE IF NOT EXISTS public.galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for photos in galleries
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  is_approved BOOLEAN DEFAULT false,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.app_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for app_configurations (admin only)
CREATE POLICY "Only admins can manage app configurations" 
ON public.app_configurations 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create RLS policies for prayer_requests
CREATE POLICY "Users can view their own prayer requests" 
ON public.prayer_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prayer requests" 
ON public.prayer_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests" 
ON public.prayer_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all prayer requests" 
ON public.prayer_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update all prayer requests" 
ON public.prayer_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create RLS policies for testimonies
CREATE POLICY "Users can view their own testimonies" 
ON public.testimonies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own testimonies" 
ON public.testimonies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own testimonies" 
ON public.testimonies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all testimonies" 
ON public.testimonies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update all testimonies" 
ON public.testimonies 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Everyone can view approved testimonies" 
ON public.testimonies 
FOR SELECT 
USING (is_approved = true);

-- Create RLS policies for galleries
CREATE POLICY "Everyone can view active galleries" 
ON public.galleries 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all galleries" 
ON public.galleries 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create RLS policies for gallery_photos
CREATE POLICY "Everyone can view approved photos" 
ON public.gallery_photos 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can upload photos" 
ON public.gallery_photos 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all photos" 
ON public.gallery_photos 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Add foreign key constraints
ALTER TABLE public.prayer_requests 
ADD CONSTRAINT fk_prayer_requests_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.testimonies 
ADD CONSTRAINT fk_testimonies_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.gallery_photos 
ADD CONSTRAINT fk_gallery_photos_gallery_id 
FOREIGN KEY (gallery_id) REFERENCES public.galleries(id) ON DELETE CASCADE;

ALTER TABLE public.gallery_photos 
ADD CONSTRAINT fk_gallery_photos_uploaded_by 
FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add triggers for updated_at columns
CREATE TRIGGER update_app_configurations_updated_at
BEFORE UPDATE ON public.app_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at
BEFORE UPDATE ON public.prayer_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonies_updated_at
BEFORE UPDATE ON public.testimonies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_galleries_updated_at
BEFORE UPDATE ON public.galleries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default app configurations
INSERT INTO public.app_configurations (key, value) VALUES 
('app_name', 'Assembleia de Deus Bom Pastor'),
('daily_verse', 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna. - João 3:16'),
('contact_email', 'contato@adbompastor.org.br'),
('retreat_price', '150.00')
ON CONFLICT (key) DO NOTHING;