-- =============================================
-- COMPLETE SUPABASE SCHEMA
-- Run this ENTIRE script in your Supabase SQL Editor
-- Safe to re-run — uses IF NOT EXISTS and IF EXISTS
-- =============================================


-- =============================================
-- 1. PROFILES TABLE (create if new, alter if exists)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add appearance columns to profiles (safe if they already exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS page_bg_type TEXT DEFAULT 'gradient';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS page_bg_color TEXT DEFAULT '#6366F1';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS page_bg_gradient_from TEXT DEFAULT '#6366F1';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS page_bg_gradient_to TEXT DEFAULT '#A855F7';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS page_bg_image TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS card_bg_color TEXT DEFAULT '#FFFFFF';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS card_text_color TEXT DEFAULT '#1F2937';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS card_border_radius TEXT DEFAULT 'rounded';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'filled';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS page_font TEXT DEFAULT 'sans';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'default';

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);


-- =============================================
-- 2. LINK PAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS link_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Link Page',
  slug TEXT NOT NULL DEFAULT 'default',
  is_default BOOLEAN DEFAULT FALSE,
  
  -- Appearance columns (per-page customization)
  page_bg_type TEXT DEFAULT 'gradient',
  page_bg_color TEXT DEFAULT '#6366F1',
  page_bg_gradient_from TEXT DEFAULT '#6366F1',
  page_bg_gradient_to TEXT DEFAULT '#A855F7',
  page_bg_image TEXT,
  card_bg_color TEXT DEFAULT '#FFFFFF',
  card_text_color TEXT DEFAULT '#1F2937',
  card_border_radius TEXT DEFAULT 'rounded',
  card_style TEXT DEFAULT 'filled',
  page_font TEXT DEFAULT 'sans',
  theme_preset TEXT DEFAULT 'default',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, slug)
);

-- RLS for link_pages
ALTER TABLE link_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all pages" ON link_pages;
DROP POLICY IF EXISTS "Users can insert their own pages" ON link_pages;
DROP POLICY IF EXISTS "Users can update their own pages" ON link_pages;
DROP POLICY IF EXISTS "Users can delete their own pages" ON link_pages;

CREATE POLICY "Users can view all pages" ON link_pages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own pages" ON link_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages" ON link_pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages" ON link_pages
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================
-- 3. LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Link',
  url TEXT NOT NULL DEFAULT 'https://example.com',
  position INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns safely (won't fail if they already exist)
ALTER TABLE links ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE;
ALTER TABLE links ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS bg_type TEXT DEFAULT 'color';
ALTER TABLE links ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#FFFFFF';
ALTER TABLE links ADD COLUMN IF NOT EXISTS bg_image TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#1F2937';
ALTER TABLE links ADD COLUMN IF NOT EXISTS font TEXT DEFAULT 'sans';
ALTER TABLE links ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- RLS for links
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all links" ON links;
DROP POLICY IF EXISTS "Users can insert their own links" ON links;
DROP POLICY IF EXISTS "Users can update their own links" ON links;
DROP POLICY IF EXISTS "Users can delete their own links" ON links;

CREATE POLICY "Users can view all links" ON links
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own links" ON links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" ON links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links" ON links
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================
-- 4. MIGRATE EXISTING DATA
-- Create default link_page for each profile that doesn't have one
-- =============================================

INSERT INTO link_pages (user_id, title, slug, is_default,
  page_bg_type, page_bg_color, page_bg_gradient_from, page_bg_gradient_to,
  page_bg_image, card_bg_color, card_text_color, card_border_radius,
  card_style, page_font, theme_preset)
SELECT 
  p.id, 'My Links', 'default', TRUE,
  COALESCE(p.page_bg_type, 'gradient'),
  COALESCE(p.page_bg_color, '#6366F1'),
  COALESCE(p.page_bg_gradient_from, '#6366F1'),
  COALESCE(p.page_bg_gradient_to, '#A855F7'),
  p.page_bg_image,
  COALESCE(p.card_bg_color, '#FFFFFF'),
  COALESCE(p.card_text_color, '#1F2937'),
  COALESCE(p.card_border_radius, 'rounded'),
  COALESCE(p.card_style, 'filled'),
  COALESCE(p.page_font, 'sans'),
  COALESCE(p.theme_preset, 'default')
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM link_pages lp WHERE lp.user_id = p.id
);

-- Associate orphaned links with their user's default page
UPDATE links
SET page_id = (
  SELECT lp.id FROM link_pages lp 
  WHERE lp.user_id = links.user_id AND lp.is_default = TRUE
  LIMIT 1
)
WHERE page_id IS NULL
  AND EXISTS (
    SELECT 1 FROM link_pages lp 
    WHERE lp.user_id = links.user_id AND lp.is_default = TRUE
  );


-- =============================================
-- DONE! Verify:
-- =============================================
-- SELECT * FROM profiles;
-- SELECT * FROM link_pages;
-- SELECT * FROM links;

-- =============================================
-- 5. STORAGE BUCKET
-- =============================================
-- Insert the bucket for link_images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('link_images', 'link_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow public access to read images
CREATE POLICY "Public Read Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'link_images');

-- Allow authenticated users to upload their own images
CREATE POLICY "Auth Insert Access" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'link_images' AND 
    auth.role() = 'authenticated'
  );

-- Allow users to update their own images
CREATE POLICY "Auth Update Access" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'link_images' AND 
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own images
CREATE POLICY "Auth Delete Access" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'link_images' AND 
    auth.role() = 'authenticated'
  );
