-- Create member_id sequence
CREATE SEQUENCE IF NOT EXISTS member_id_seq START 1;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Brasil',
  document_type TEXT,
  document_number TEXT,
  birth_date DATE,
  church_name TEXT,
  profile_photo_url TEXT,
  member_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  main_user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  document_type TEXT,
  document_number TEXT,
  birth_date DATE,
  relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create retreat_registrations table
CREATE TABLE IF NOT EXISTS public.retreat_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  payment_method TEXT,
  payment_type TEXT,
  payment_proof_url TEXT,
  status TEXT DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retreat_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for family_members
CREATE POLICY "Users can view their family members" ON public.family_members
  FOR SELECT USING (auth.uid() = main_user_id);

CREATE POLICY "Users can insert their family members" ON public.family_members
  FOR INSERT WITH CHECK (auth.uid() = main_user_id);

CREATE POLICY "Users can update their family members" ON public.family_members
  FOR UPDATE USING (auth.uid() = main_user_id);

CREATE POLICY "Users can delete their family members" ON public.family_members
  FOR DELETE USING (auth.uid() = main_user_id);

-- Create RLS policies for retreat_registrations
CREATE POLICY "Users can view their retreat registrations" ON public.retreat_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their retreat registrations" ON public.retreat_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their retreat registrations" ON public.retreat_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for announcements
CREATE POLICY "Everyone can view announcements" ON public.announcements
  FOR SELECT USING (true);

-- Create RLS policies for events
CREATE POLICY "Everyone can view events" ON public.events
  FOR SELECT USING (true);

-- Create function to generate member ID
CREATE OR REPLACE FUNCTION public.generate_member_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.member_id := 'AD' || LPAD(nextval('member_id_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER generate_member_id_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_member_id();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_retreat_registrations_updated_at
  BEFORE UPDATE ON public.retreat_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();