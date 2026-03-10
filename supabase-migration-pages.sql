-- =============================================
-- SUPABASE MIGRATION: Add link_pages table
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create link_pages table
CREATE TABLE IF NOT EXISTS link_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Link Page',
  slug TEXT NOT NULL DEFAULT 'default',
  is_default BOOLEAN DEFAULT FALSE,
  
  -- Appearance columns (moved from profiles)
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

-- 2. Add page_id to links table
ALTER TABLE links
ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE;

-- 3. Create a default page for each existing user who has a profile
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
  SELECT 1 FROM link_pages lp WHERE lp.user_id = p.id AND lp.slug = 'default'
);

-- 4. Associate existing links with their user's default page
UPDATE links
SET page_id = (
  SELECT lp.id FROM link_pages lp 
  WHERE lp.user_id = links.user_id AND lp.is_default = TRUE
  LIMIT 1
)
WHERE page_id IS NULL;

-- 5. Enable RLS on link_pages
ALTER TABLE link_pages ENABLE ROW LEVEL SECURITY;

-- RLS policies for link_pages
CREATE POLICY "Users can view their own pages" ON link_pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pages" ON link_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages" ON link_pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages" ON link_pages
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for link_pages (needed for public profile pages)
CREATE POLICY "Anyone can view public pages" ON link_pages
  FOR SELECT USING (true);

-- =============================================
-- VERIFY: Run these to check
-- =============================================
-- SELECT * FROM link_pages;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'link_pages';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'links';
