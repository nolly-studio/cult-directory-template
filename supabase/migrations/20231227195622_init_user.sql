CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  billing_address JSONB,
  payment_method JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Can view own user data') THEN
        DROP POLICY "Can view own user data" ON public.users;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Can update own user data') THEN
        DROP POLICY "Can update own user data" ON public.users;
    END IF;
END
$$;

-- Create new policies
CREATE POLICY "Can view own user data" ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Can update own user data" ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Create or replace function and trigger for handling new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
