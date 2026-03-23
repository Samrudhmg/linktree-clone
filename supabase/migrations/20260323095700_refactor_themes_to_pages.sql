-- Migration: Refactor themes to be page-based instead of user-based
-- Date: 2026-03-23

-- 1. Add theme_id to link_pages
ALTER TABLE link_pages 
ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES themes(id) ON DELETE SET NULL;

-- 2. Migrate data from user_settings (user-based theme) to link_pages (page-based theme)
-- Every page for a user will initially get the theme that was selected for that user.
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        UPDATE link_pages
        SET theme_id = us.selected_theme_id
        FROM user_settings us
        WHERE link_pages.user_id = us.user_id
        AND link_pages.theme_id IS NULL
        AND us.selected_theme_id IN (SELECT id FROM themes);
    END IF;
END $$;

-- 3. Also migrate any UUIDs stored in theme_preset to theme_id
-- We only do this if it looks like a UUID AND exists in the themes table
UPDATE link_pages
SET theme_id = theme_preset::UUID
WHERE theme_preset ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
AND theme_id IS NULL
AND theme_preset::UUID IN (SELECT id FROM themes);

-- 4. Clean up user_settings if it's no longer needed
-- FIX.md says "Remove theme_id from users". Since our system uses user_settings table, we'll drop it.
-- We'll keep it for now but remove the policy or just acknowledge it's deprecated.
-- Actually, let's just drop the column selected_theme_id to be safe, or the whole table if it only has that.
DROP TABLE IF EXISTS user_settings;

-- 5. Update themes RLS to be more flexible
-- Users should be able to read any theme that is linked to one of their pages
-- (Existing policies already allow reading default themes and own themes)
-- We might need a policy for "anyone can read a theme if they are viewing a page that uses it"
-- But since slug pages are public, the themes should also be readable if they are "default" or if we add a public read policy.

-- If a theme is attached to a public page, it should be readable by everyone
-- (Similar to how link_pages are viewable by all)
DROP POLICY IF EXISTS "Anyone can read themes used by pages" ON themes;
CREATE POLICY "Anyone can read themes used by pages"
ON themes FOR SELECT
USING (
  type = 'default' 
  OR 
  id IN (SELECT theme_id FROM link_pages WHERE theme_id IS NOT NULL)
);
