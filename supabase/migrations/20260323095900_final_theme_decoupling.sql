-- Run these one by one or as a block in Supabase SQL Editor

-- 1. Ensure columns exist
ALTER TABLE themes ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES link_pages(id) ON DELETE CASCADE;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES themes(id) ON DELETE SET NULL;

-- 2. Clean up redundant columns (Optional but recommended)
ALTER TABLE profiles DROP COLUMN IF EXISTS page_bg_type;
ALTER TABLE profiles DROP COLUMN IF EXISTS page_bg_color;
ALTER TABLE profiles DROP COLUMN IF EXISTS page_bg_gradient_from;
ALTER TABLE profiles DROP COLUMN IF EXISTS page_bg_gradient_to;
ALTER TABLE profiles DROP COLUMN IF EXISTS page_bg_image;
ALTER TABLE profiles DROP COLUMN IF EXISTS card_bg_color;
ALTER TABLE profiles DROP COLUMN IF EXISTS card_text_color;
ALTER TABLE profiles DROP COLUMN IF EXISTS card_border_radius;
ALTER TABLE profiles DROP COLUMN IF EXISTS card_style;
ALTER TABLE profiles DROP COLUMN IF EXISTS page_font;
ALTER TABLE profiles DROP COLUMN IF EXISTS theme_preset;

-- 3. Update RLS Policies
DROP POLICY IF EXISTS "Anyone can read themes used by pages" ON themes;
CREATE POLICY "Anyone can read themes used by pages"
ON themes FOR SELECT
USING (
  type = 'default' 
  OR 
  page_id IN (SELECT id FROM link_pages WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert own themes" ON themes;
CREATE POLICY "Users can insert own themes" 
ON themes FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND 
  (page_id IS NULL OR page_id IN (SELECT id FROM link_pages WHERE user_id = auth.uid()))
);

DROP POLICY IF EXISTS "Users can update own themes" ON themes;
CREATE POLICY "Users can update own themes" 
ON themes FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND 
  (page_id IS NULL OR page_id IN (SELECT id FROM link_pages WHERE user_id = auth.uid()))
);
