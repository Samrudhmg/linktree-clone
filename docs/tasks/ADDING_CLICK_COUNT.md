# ADDING_CLICK_COUNT

## Status
COMPLETED – ADDING_CLICK_COUNT

---

## Objective

Implement a click tracking system for links in this Linktree clone project.

The system should record how many times each link is clicked and allow this information to be displayed later in the dashboard.

---

## Context

This project is a **Linktree clone built with Next.js and Supabase**.

Current database structure includes tables such as:

- `profiles`
- `link_pages`
- `links`

The click tracking feature should integrate cleanly with the existing architecture.
The Supabase CLI migrations may not run locally due to environment limitations. Because of this, the schema changes must also be provided separately so they can be applied manually in the Supabase SQL editor if needed.

---
---

## Requirements

agent should implement a solution that:

1. Tracks whenever a user clicks a link.
2. Stores the click information in Supabase.
3. Allows the click count to be displayed in the dashboard or link management UI.
4. Follows the current project standards (TypeScript, modular structure, Supabase usage).
5. Keeps the implementation simple and maintainable.
1. When a user clicks a link, the application should record the click in the database.
2. The user should then be redirected to the destination URL normally.
3. The public URL structure must remain unchanged.

---

## Implementation guidance

- Create an API route (for example `/api/track-click`) that records the click event in Supabase.
- The API should accept the `linkId`.
- Insert a record into a `click_events` table (or increment a click counter if that approach is used).
- Modify the public link component so that it first calls the API to record the click and then redirects the user to the actual URL.



## Database Changes

If a new table is required (for example `click_events`), agent must:

1. Provide the **complete SQL schema** for the table.
2. Update or create the appropriate **migration file inside the project**.
3. Ensure the schema is compatible with the existing `links` table.

Example structure (agent may adjust if necessary):

```sql
create table click_events (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references links(id) on delete cascade,
  clicked_at timestamptz default now(),
  referrer text,
  user_agent text
);

## Suggested Implementation (agent may adjust if necessary)

One possible approach is:

- Create a `click_events` table in Supabase that stores:
  - `id`
  - `link_id`
  - `clicked_at`
  - optional metadata (referrer, user_agent)

- Use a tracking route such as:

/l/[linkId]



This route should:

1. Record the click in the database
2. Redirect the user to the original link URL

---

## Deliverables

agent should:

- Implement the click tracking logic.
- Update the database schema if needed.
- Add any required API routes or utility functions.
- Ensure the UI can retrieve and display the click count.

---

## Required Explanation

After completing the task, agent must explain:

- Why this method was chosen for click tracking
- How the click tracking flow works
- What files were created or modified
- How the dashboard retrieves the click count

---

## Implementation Summary

I have implemented a robust click tracking system using a client-side approach with `navigator.sendBeacon()`.

### Why this method was chosen
Using `navigator.sendBeacon()` allows us to send tracking data to the server asynchronously without delaying the user's navigation to the destination link. It is more reliable than standard `fetch` when the page is about to unload.

### How the flow works
1. **Click Event (Public Page)**: When a user clicks a link on the public profile page, the `PublicLinkItem` component triggers its `handleClick` function, which sends a beacon and redirects.
2. **Click Event (Dashboard Preview)**: When a user clicks a link in the `LivePreview` within the dashboard:
   - **Optimistic UI Update**: The dashboard's `trackClick` function immediately increments the local click count for that link.
   - **Beacon Sent**: It concurrently sends a beacon to the tracking API.
   - **Redirection**: It opens the link in a new tab.
3. **Recording**: The API route receives the request and inserts a new record into the `click_events` table in Supabase.
4. **Dashboard Display**: The dashboard fetches the total count of these events per link using Supabase's aggregate functions and displays it in the `LinkCard` component. The counts are kept in sync via local state updates and periodic refetching.

### Files Modified/Created
- [NEW] [20260316000000_add_click_tracking.sql](file:///c:/dev/linktree-clone/supabase/migrations/20260316000000_add_click_tracking.sql) - Database schema.
- [NEW] [route.ts](file:///c:/dev/linktree-clone/app/api/track-click/route.ts) - Tracking API endpoint.
- [MODIFY] [PublicLinkItem.tsx](file:///c:/dev/linktree-clone/components/PublicLinkItem.tsx) - Client-side tracking logic.
- [MODIFY] [dashboard/page.tsx](file:///c:/dev/linktree-clone/app/dashboard/page.tsx) - Fetching click counts.
- [MODIFY] [LinkCard.tsx](file:///c:/dev/linktree-clone/components/LinkCard.tsx) - UI display for click counts.
- [MODIFY] [lib/types.ts](file:///c:/dev/linktree-clone/lib/types.ts) - TypeScript interfaces.

### Database Schema (SQL)
```sql
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON click_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow owners to select" ON click_events FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM links
    WHERE links.id = click_events.link_id
    AND links.user_id = auth.uid()
  )
);
```
