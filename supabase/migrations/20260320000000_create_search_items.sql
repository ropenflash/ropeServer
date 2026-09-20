-- Typeahead search items (applied to Supabase project zgwtehnofcahlrzeselb)
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.search_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS search_items_name_lower_idx
  ON public.search_items (lower(name));

CREATE INDEX IF NOT EXISTS search_items_name_trgm_idx
  ON public.search_items
  USING gin (name extensions.gin_trgm_ops);

ALTER TABLE public.search_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read search_items" ON public.search_items;
CREATE POLICY "Allow public read search_items"
  ON public.search_items
  FOR SELECT
  TO anon, authenticated
  USING (true);
