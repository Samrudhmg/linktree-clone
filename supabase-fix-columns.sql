-- =============================================
-- FIX: Add missing columns to link_pages
-- Run this in Supabase SQL Editor to ensure all 
-- appearance columns exist
-- =============================================

-- Appearance columns
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS page_bg_type TEXT DEFAULT 'gradient';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS page_bg_color TEXT DEFAULT '#6366F1';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS page_bg_gradient_from TEXT DEFAULT '#6366F1';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS page_bg_gradient_to TEXT DEFAULT '#A855F7';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS page_bg_image TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS card_bg_color TEXT DEFAULT '#FFFFFF';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS card_text_color TEXT DEFAULT '#1F2937';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS card_border_radius TEXT DEFAULT 'rounded';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'filled';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS page_font TEXT DEFAULT 'sans';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'default';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS avatar_shape TEXT DEFAULT 'rounded';

-- Per-page identity columns
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT '';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';

-- Verify columns exist (run this to check)
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'link_pages'
ORDER BY ordinal_position;
