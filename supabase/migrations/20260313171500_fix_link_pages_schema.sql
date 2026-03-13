-- Rename gradient columns in profiles
ALTER TABLE profiles RENAME COLUMN page_bg_gradient_from TO page_bg_gradient_start;
ALTER TABLE profiles RENAME COLUMN page_bg_gradient_to TO page_bg_gradient_end;

-- Rename gradient columns in link_pages
ALTER TABLE link_pages RENAME COLUMN page_bg_gradient_from TO page_bg_gradient_start;
ALTER TABLE link_pages RENAME COLUMN page_bg_gradient_to TO page_bg_gradient_end;

-- Add profile fields to link_pages
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE link_pages ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Move data from profiles to link_pages (for the default page)
UPDATE link_pages lp
SET 
  display_name = p.display_name,
  bio = p.bio,
  avatar_url = p.avatar_url
FROM profiles p
WHERE lp.user_id = p.id AND lp.slug = 'default';
