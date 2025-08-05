-- Add WhatsApp field to profiles
ALTER TABLE public.profiles 
ADD COLUMN is_whatsapp BOOLEAN DEFAULT FALSE;

-- Update payment options in retreat_registrations
-- The payment_method field already exists, we'll update the application to use new options

-- Add EBD categories table
CREATE TABLE IF NOT EXISTS public.ebd_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  age_range TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on EBD categories
ALTER TABLE public.ebd_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view active EBD categories
CREATE POLICY "Everyone can view active EBD categories" 
ON public.ebd_categories 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage EBD categories
CREATE POLICY "Only admins can manage EBD categories" 
ON public.ebd_categories 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Insert default EBD categories
INSERT INTO public.ebd_categories (name, description, age_range) VALUES
('Adultos', 'Escola Bíblica para adultos', '18+ anos'),
('Jovens', 'Escola Bíblica para jovens', '15-25 anos'),
('Juvenil', 'Escola Bíblica para juvenis', '12-17 anos'),
('Infantil', 'Escola Bíblica para crianças', '4-11 anos');

-- Add trigger for updated_at on ebd_categories
CREATE TRIGGER update_ebd_categories_updated_at
BEFORE UPDATE ON public.ebd_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create home worship sessions table for "Culto nos Lares"
CREATE TABLE IF NOT EXISTS public.home_worship_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  study_material_url TEXT,
  date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on home worship sessions
ALTER TABLE public.home_worship_sessions ENABLE ROW LEVEL SECURITY;

-- Everyone can view active home worship sessions
CREATE POLICY "Everyone can view active home worship sessions" 
ON public.home_worship_sessions 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage home worship sessions
CREATE POLICY "Only admins can manage home worship sessions" 
ON public.home_worship_sessions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Add trigger for updated_at on home_worship_sessions
CREATE TRIGGER update_home_worship_sessions_updated_at
BEFORE UPDATE ON public.home_worship_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();