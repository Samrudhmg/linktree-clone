-- =============================================
-- SUPABASE MIGRATION: Add appearance columns
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Add appearance columns to PROFILES table (page-level settings)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS page_bg_type TEXT DEFAULT 'gradient',
ADD COLUMN IF NOT EXISTS page_bg_color TEXT DEFAULT '#6366F1',
ADD COLUMN IF NOT EXISTS page_bg_gradient_from TEXT DEFAULT '#6366F1',
ADD COLUMN IF NOT EXISTS page_bg_gradient_to TEXT DEFAULT '#A855F7',
ADD COLUMN IF NOT EXISTS page_bg_image TEXT,
ADD COLUMN IF NOT EXISTS card_bg_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS card_text_color TEXT DEFAULT '#1F2937',
ADD COLUMN IF NOT EXISTS card_border_radius TEXT DEFAULT 'rounded',
ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'filled',
ADD COLUMN IF NOT EXISTS page_font TEXT DEFAULT 'sans',
ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'default';

-- 2. Add appearance columns to LINKS table (link-level settings)
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS bg_type TEXT DEFAULT 'color',
ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS bg_image TEXT,
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#1F2937',
ADD COLUMN IF NOT EXISTS font TEXT DEFAULT 'sans',
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- =============================================
-- VERIFY: Run these to check if columns were added
-- =============================================
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'links';
