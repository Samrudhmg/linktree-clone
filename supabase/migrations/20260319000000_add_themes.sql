-- Create themes table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('default', 'user')),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    selected_theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for themes
-- Anyone can read default themes
CREATE POLICY "Anyone can read default themes" 
ON themes FOR SELECT 
USING (type = 'default');

-- Users can read their own themes
CREATE POLICY "Users can read own themes" 
ON themes FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own themes
CREATE POLICY "Users can insert own themes" 
ON themes FOR INSERT 
WITH CHECK (auth.uid() = user_id AND type = 'user');

-- Users can update their own themes
CREATE POLICY "Users can update own themes" 
ON themes FOR UPDATE 
USING (auth.uid() = user_id AND type = 'user');

-- Users can delete their own themes
CREATE POLICY "Users can delete own themes" 
ON themes FOR DELETE 
USING (auth.uid() = user_id AND type = 'user');

-- Policies for user_settings
-- Users can read their own settings
CREATE POLICY "Users can read own settings" 
ON user_settings FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" 
ON user_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" 
ON user_settings FOR UPDATE 
USING (auth.uid() = user_id);

-- Seeding Default Themes
INSERT INTO themes (id, name, type, config) VALUES 
('11111111-1111-1111-1111-111111111111', 'Minimal Dark', 'default', '{
  "background": { "primary": "#0a0a0a", "secondary": "#171717" },
  "text": { "primary": "#ffffff", "secondary": "#a1a1aa" },
  "links": { "style": "flat", "radius": "rounded-full", "shadow": "none" },
  "button": { "variant": "solid", "accent": "#3b82f6" },
  "card": { "style": "flat", "border": "none" }
}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'Glass Premium', 'default', '{
  "background": { "primary": "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", "secondary": "rgba(255,255,255,0.1)" },
  "text": { "primary": "#ffffff", "secondary": "rgba(255,255,255,0.8)" },
  "links": { "style": "glass", "radius": "rounded-2xl", "shadow": "md" },
  "button": { "variant": "minimal", "accent": "#ffffff" },
  "card": { "style": "glass", "border": "subtle" }
}'::jsonb),
('33333333-3333-3333-3333-333333333333', 'Bold Gradient', 'default', '{
  "background": { "primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "secondary": "#1f2937" },
  "text": { "primary": "#ffffff", "secondary": "#e5e7eb" },
  "links": { "style": "outline", "radius": "rounded-xl", "shadow": "lg" },
  "button": { "variant": "gradient", "accent": "#ec4899" },
  "card": { "style": "bordered", "border": "strong" }
}'::jsonb);

-- Ensure we update the timestamps automatically
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on themes 
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at before update on user_settings 
  for each row execute procedure moddatetime (updated_at);
