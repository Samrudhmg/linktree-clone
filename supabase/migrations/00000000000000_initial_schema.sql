-- =========================================================================================
-- FINAL CONSOLIDATED DATABASE SCHEMA (Single Source of Truth)
-- =========================================================================================
-- This file consolidates all previous migrations into one representative, clean schema.
-- 🚨 RULES: 
-- 1. Correct FK order to avoid circular dependencies.
-- 2. Explicit ON DELETE CASCADE on auth.users relationships.
-- 3. themes.page_id is NULLABLE and NOT UNIQUE (multiple themes per page allowed).
-- 4. link_pages.theme_id uses ON DELETE SET NULL.
-- 5. link_pages.slug is lowercase corrected.
-- 6. links.page_id is NOT NULL.
-- 7. All tables include timestamps with auto-triggers.
-- 8. Storage bucket for link_images is initialized with scoped RLS.
-- =========================================================================================

-- =============================================
-- 0. EXTENSIONS & PREREQUISITES
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- =============================================
-- 1. TABLES (Correct FK Order & Constraints)
-- =============================================

-- THEMES: Aesthetic configurations (Template gallery + Custom user themes)
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('default', 'user')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL, -- Null for default/global themes
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Extracted Style Columns for high-performance retrieval
    title_color TEXT,
    bio_color TEXT,
    avatar_style TEXT DEFAULT 'circle',
    link_text_color TEXT,
    link_subtext_color TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LINK PAGES: Individual Linktree pages
CREATE TABLE IF NOT EXISTS public.link_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    slug TEXT UNIQUE NOT NULL CHECK (slug = LOWER(slug)), -- Globally unique & lowercase
    title TEXT NOT NULL DEFAULT 'My Link Page',
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Active theme reference
    theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL, -- Prevents page deletion if theme is removed
    
    avatar_style TEXT DEFAULT 'full' CHECK (avatar_style IN ('full', 'square', 'circle', 'rounded')),
    avatar_size INTEGER DEFAULT 80,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- THEMES CIRCULAR LINK: Add page_id now that link_pages exists
ALTER TABLE public.themes 
ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES public.link_pages(id) ON DELETE CASCADE; -- NULLABLE & NOT UNIQUE

-- PROFILES: Core user metadata (Minimalist)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LINKS: Individual links on a page
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    page_id UUID NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE, -- NOT NULL enforced
    title TEXT NOT NULL DEFAULT 'New Link',
    url TEXT NOT NULL DEFAULT 'https://example.com',
    subtext TEXT,
    position INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    icon TEXT,
    thumbnail_url TEXT,
    
    -- Link-specific styling overrides
    bg_type TEXT DEFAULT 'color',
    bg_color TEXT DEFAULT '#FFFFFF',
    bg_image TEXT,
    text_color TEXT,
    font TEXT DEFAULT 'sans',
    
    thumbnail_style TEXT DEFAULT 'circle' CHECK (thumbnail_style IN ('full', 'square', 'circle', 'rounded')),
    thumbnail_size INTEGER DEFAULT 40,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLICK EVENTS: Analytics
CREATE TABLE IF NOT EXISTS public.click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    referrer TEXT,
    user_agent TEXT
);

-- =============================================
-- 2. INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_link_pages_slug ON public.link_pages(slug);
CREATE INDEX IF NOT EXISTS idx_links_page_id ON public.links(page_id);
CREATE INDEX IF NOT EXISTS idx_click_events_link_id ON public.click_events(link_id);
CREATE INDEX IF NOT EXISTS idx_themes_page_id ON public.themes(page_id);

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Own profile manage" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Link Pages
ALTER TABLE public.link_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public pages read" ON public.link_pages FOR SELECT USING (true);
CREATE POLICY "Own pages manage" ON public.link_pages FOR ALL USING (auth.uid() = user_id);

-- Links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public links read" ON public.links FOR SELECT USING (true);
CREATE POLICY "Own links manage" ON public.links FOR ALL USING (auth.uid() = user_id);

-- Themes
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public themes read" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Own themes manage" ON public.themes FOR ALL USING (auth.uid() = user_id);

-- Click Events
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public click insert" ON public.click_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners view analytics" ON public.click_events FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.links 
        WHERE links.id = click_events.link_id AND links.user_id = auth.uid()
    )
);

-- =============================================
-- 4. TRIGGERS (Auto updated_at)
-- =============================================
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.link_pages FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.links FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.themes FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- =============================================
-- 5. STORAGE BUCKET (Link Images)
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('link_images', 'link_images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket-scoped storage policies
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'link_images');
CREATE POLICY "Auth Manage Access" ON storage.objects FOR ALL USING (
    bucket_id = 'link_images' AND auth.role() = 'authenticated'
);

-- =============================================
-- 6. SEEDING (Default Themes)
-- =============================================
INSERT INTO public.themes (id, name, type, user_id, page_id, title_color, bio_color, avatar_style, link_text_color, link_subtext_color, config) VALUES 
('11111111-1111-1111-1111-111111111111', 'Minimal Dark', 'default', NULL, NULL, '#ffffff', '#a1a1aa', 'circle', '#ffffff', '#a1a1aa', '{
  "background": { "primary": "#0a0a0a", "secondary": "#171717" },
  "text": { "primary": "#ffffff", "secondary": "#a1a1aa", "titleColor": "#ffffff", "bioColor": "#a1a1aa" },
  "links": { "style": "flat", "radius": "rounded-full", "shadow": "none", "textColor": "#ffffff", "subtextColor": "#a1a1aa" },
  "button": { "variant": "solid", "accent": "#3b82f6" },
  "card": { "style": "flat", "border": "none" },
  "avatar": { "style": "circle" }
}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Glass Premium', 'default', NULL, NULL, '#ffffff', 'rgba(255,255,255,0.8)', 'rounded', '#ffffff', 'rgba(255,255,255,0.8)', '{
  "background": { "primary": "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", "secondary": "rgba(255,255,255,0.1)" },
  "text": { "primary": "#ffffff", "secondary": "rgba(255,255,255,0.8)", "titleColor": "#ffffff", "bioColor": "rgba(255,255,255,0.8)" },
  "links": { "style": "glass", "radius": "rounded-2xl", "shadow": "md", "textColor": "#ffffff", "subtextColor": "rgba(255,255,255,0.8)" },
  "button": { "variant": "minimal", "accent": "#ffffff" },
  "card": { "style": "glass", "border": "subtle" },
  "avatar": { "style": "rounded" }
}'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Bold Gradient', 'default', NULL, NULL, '#ffffff', '#e5e7eb', 'full', '#ffffff', '#e5e7eb', '{
  "background": { "primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "secondary": "#1f2937" },
  "text": { "primary": "#ffffff", "secondary": "#e5e7eb", "titleColor": "#ffffff", "bioColor": "#e5e7eb" },
  "links": { "style": "outline", "radius": "rounded-xl", "shadow": "lg", "textColor": "#ffffff", "subtextColor": "#e5e7eb" },
  "button": { "variant": "gradient", "accent": "#ec4899" },
  "card": { "style": "bordered", "border": "strong" },
  "avatar": { "style": "full" }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
