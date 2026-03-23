-- Update existing themes with new Title and Bio styling fields in the JSONB config
-- This ensures all themes have the expected structure for the upgraded editor.

UPDATE themes 
SET config = jsonb_set(
  CASE 
    WHEN config ? 'title' THEN config 
    ELSE jsonb_set(config, '{title}', '{"color": "#ffffff", "fontSize": "1.5rem", "fontWeight": "bold"}'::jsonb)
  END,
  '{bio}', 
  CASE 
    WHEN config ? 'bio' THEN config->'bio'
    ELSE '{"color": "#a1a1aa", "fontSize": "1rem", "fontWeight": "normal"}'::jsonb
  END
)
WHERE config->'title' IS NULL OR config->'bio' IS NULL;

-- Specifically update the 'Minimal Dark' default theme to match its style
UPDATE themes
SET config = config || '{
  "title": { "color": "#ffffff", "fontSize": "1.5rem", "fontWeight": "bold" },
  "bio": { "color": "#a1a1aa", "fontSize": "1.1rem", "fontWeight": "normal" }
}'::jsonb
WHERE name = 'Minimal Dark' AND type = 'default';

-- Specifically update 'Glass Premium'
UPDATE themes
SET config = config || '{
  "title": { "color": "#ffffff", "fontSize": "1.6rem", "fontWeight": "extrabold" },
  "bio": { "color": "rgba(255,255,255,0.8)", "fontSize": "1.1rem", "fontWeight": "normal" }
}'::jsonb
WHERE name = 'Glass Premium' AND type = 'default';
