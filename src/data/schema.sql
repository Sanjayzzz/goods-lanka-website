-- ==========================================
-- 1. Create traveler_stories Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.traveler_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.traveler_stories ENABLE ROW LEVEL SECURITY;

-- Enable anyone to read traveler stories
CREATE POLICY "Allow public read access to traveler_stories" 
ON public.traveler_stories FOR SELECT 
USING (true);

-- Enable authenticated users (admins) to write/update/delete traveler stories
CREATE POLICY "Allow admin write access to traveler_stories" 
ON public.traveler_stories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ==========================================
-- 2. Update reviews Table to Support Images
-- ==========================================
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ==========================================
-- 3. Storage Bucket Policies Hint
-- ==========================================
-- NOTE: Please ensure you go to Supabase Dashboard -> Storage and:
-- 1. Create a public bucket named "stories"
-- 2. Create a public bucket named "reviews"
-- Make sure both buckets are configured as "Public" so the URLs can be loaded by anyone.
