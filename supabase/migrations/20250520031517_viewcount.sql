CREATE OR REPLACE FUNCTION increment_product_view_count(product_id UUID) 
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant the necessary privileges to the function owner
ALTER FUNCTION increment_product_view_count(product_id UUID) OWNER TO postgres;

-- Ensure the function is secure
REVOKE ALL ON FUNCTION increment_product_view_count(product_id UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_product_view_count(product_id UUID) TO postgres;
