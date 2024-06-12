-- Create the bucket called "product-logos"
insert into storage.buckets
  (id, name, public)
values
  ('product-logos', 'product-logos', true);

-- Enable Row Level Security for storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for storage.objects table if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'select product product-logos') THEN
        DROP POLICY "select product product-logos" ON storage.objects;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'insert product product-logos') THEN
        DROP POLICY "insert product product-logos" ON storage.objects;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'update product product-logos') THEN
        DROP POLICY "update product product-logos" ON storage.objects;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'delete product product-logos') THEN
        DROP POLICY "delete product product-logos" ON storage.objects;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'public read product-logos') THEN
        DROP POLICY "public read product-logos" ON storage.objects;
    END IF;
END
$$;

-- Create new policies for the product-logos bucket
CREATE POLICY "select product product-logos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'product-logos');
CREATE POLICY "insert product product-logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-logos');
CREATE POLICY "update product product-logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-logos');
CREATE POLICY "delete product product-logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-logos');
CREATE POLICY "public read product-logos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-logos');
