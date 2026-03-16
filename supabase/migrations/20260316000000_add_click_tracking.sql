-- Create click_events table for tracking link clicks
CREATE TABLE IF NOT EXISTS public.click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
    clicked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    referrer TEXT,
    user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (for tracking clicks from the public page)
CREATE POLICY "Allow public insert" ON public.click_events
    FOR INSERT WITH CHECK (true);

-- Allow link owners to view click data for their links
CREATE POLICY "Allow owners to select" ON public.click_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.links
            WHERE links.id = click_events.link_id
            AND links.user_id = auth.uid()
        )
    );

-- Index for better performance when counting clicks per link
CREATE INDEX IF NOT EXISTS idx_click_events_link_id ON public.click_events(link_id);
