-- =============================================
-- COMPLETE SUPABASE SCHEMA
-- Baseline migration
-- Safe to re-run
-- =============================================


-- =============================================
-- 1. PROFILES TABLE
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

-- Appearance settings
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view all profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);



-- =============================================
-- 2. LINK PAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS link_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Link Page',
  slug TEXT NOT NULL DEFAULT 'default',
  is_default BOOLEAN DEFAULT FALSE,

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
  avatar_shape TEXT DEFAULT 'rounded',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, slug)
);

ALTER TABLE link_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all pages" ON link_pages;
DROP POLICY IF EXISTS "Users can insert their own pages" ON link_pages;
DROP POLICY IF EXISTS "Users can update their own pages" ON link_pages;
DROP POLICY IF EXISTS "Users can delete their own pages" ON link_pages;

CREATE POLICY "Users can view all pages"
ON link_pages FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own pages"
ON link_pages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages"
ON link_pages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages"
ON link_pages FOR DELETE
USING (auth.uid() = user_id);



-- =============================================
-- 3. LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE,

  title TEXT NOT NULL DEFAULT 'New Link',
  url TEXT NOT NULL DEFAULT 'https://example.com',
  position INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,

  icon TEXT,
  bg_type TEXT DEFAULT 'color',
  bg_color TEXT DEFAULT '#FFFFFF',
  bg_image TEXT,
  text_color TEXT DEFAULT '#1F2937',
  font TEXT DEFAULT 'sans',
  thumbnail_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all links" ON links;
DROP POLICY IF EXISTS "Users can insert their own links" ON links;
DROP POLICY IF EXISTS "Users can update their own links" ON links;
DROP POLICY IF EXISTS "Users can delete their own links" ON links;

CREATE POLICY "Users can view all links"
ON links FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own links"
ON links FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
ON links FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
ON links FOR DELETE
USING (auth.uid() = user_id);



-- =============================================
-- 4. CREATE DEFAULT PAGE FOR USERS
-- =============================================
INSERT INTO link_pages (
  user_id,
  title,
  slug,
  is_default
)
SELECT
  p.id,
  'My Links',
  'default',
  TRUE
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM link_pages lp
  WHERE lp.user_id = p.id
);



-- =============================================
-- 5. ASSIGN EXISTING LINKS TO DEFAULT PAGE
-- =============================================
UPDATE links
SET page_id = (
  SELECT lp.id
  FROM link_pages lp
  WHERE lp.user_id = links.user_id
  AND lp.is_default = TRUE
  LIMIT 1
)
WHERE page_id IS NULL;



-- =============================================
-- 6. STORAGE BUCKET
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('link_images', 'link_images', true)
ON CONFLICT (id) DO NOTHING;


CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'link_images');


CREATE POLICY "Auth Insert Access"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'link_images'
  AND auth.role() = 'authenticated'
);


CREATE POLICY "Auth Update Access"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'link_images'
  AND auth.role() = 'authenticated'
);


CREATE POLICY "Auth Delete Access"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'link_images'
  AND auth.role() = 'authenticated'
);