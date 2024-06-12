CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NULL DEFAULT timezone('utc'::text, now()),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  twitter_handle TEXT NOT NULL,
  product_website TEXT NOT NULL,
  codename TEXT NOT NULL,
  punchline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_src TEXT NULL,
  user_id UUID NOT NULL,
  tags TEXT[] NULL,
  view_count INTEGER DEFAULT 0,
  approved BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  labels TEXT[] NULL,
  categories TEXT NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_slug_key UNIQUE (codename),
  CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
) TABLESPACE pg_default;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Can view own products') THEN
        DROP POLICY "Can view own products" ON public.products;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Can insert own products') THEN
        DROP POLICY "Can insert own products" ON public.products;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Can update own products') THEN
        DROP POLICY "Can update own products" ON public.products;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Can delete own products') THEN
        DROP POLICY "Can delete own products" ON public.products;
    END IF;
END
$$;

-- Policy for all users to view products
CREATE POLICY "Public can view products" ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Can view own products" ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Can insert own products" ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Can update own products" ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Can delete own products" ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance improvement
CREATE INDEX idx_products_categories ON public.products (categories);
CREATE INDEX idx_products_tags ON public.products USING GIN (tags);
CREATE INDEX idx_products_labels ON public.products USING GIN (labels);

-- Create product_views table
CREATE TABLE public.product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_views_pkey PRIMARY KEY (id),
  CONSTRAINT product_views_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id)
) TABLESPACE pg_default;

-- Define function to increment product view count
CREATE OR REPLACE FUNCTION increment_product_view_count(product_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.product_views (product_id) VALUES (product_id);
END;
$$ LANGUAGE plpgsql;

-- Define function to update product view count
CREATE OR REPLACE FUNCTION update_product_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET view_count = (
    SELECT COUNT(*) FROM public.product_views WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update product view count
CREATE TRIGGER trigger_update_product_view_count
AFTER INSERT ON public.product_views
FOR EACH ROW
EXECUTE FUNCTION update_product_view_count();
