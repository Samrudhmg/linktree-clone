# Refactor: Attach Custom Themes to Pages (Not Users)

## Objective

Move the theme system from **user-based** to **page-based** without breaking:

* Hosting (public slug pages)
* Preview mode (editor/live preview)

---

## Current Issue

* Themes are currently linked to **users**
* This causes:

  * Same theme across all pages
  * Preview vs hosted page mismatch
  * Limited customization

---

## Target Architecture

### New Relationship

```
User → Pages → Theme
```

Each page must have its **own theme reference**

---

## Database Changes

### 1. Add `theme_id` to `pages`

```sql
ALTER TABLE pages
ADD COLUMN theme_id UUID REFERENCES themes(id) ON DELETE SET NULL;
```

---

### 2. Remove `theme_id` from `users`

```sql
ALTER TABLE users
DROP COLUMN IF EXISTS theme_id;
```

---

### 3. Ensure `themes` supports custom themes

Required structure:

```sql
themes
- id (uuid)
- name
- user_id (nullable for system themes)
- background_color
- text_color
- bio_color
- link_bg_color
- link_text_color
- link_style
- font_family
- avatar_style
- created_at
```

---

## Data Migration

If users already have themes:

```sql
UPDATE pages
SET theme_id = users.theme_id
FROM users
WHERE pages.user_id = users.id;
```

---

## Backend Changes

### 1. Fetch Theme from Page (CRITICAL)

Replace any logic like:

```ts
getUserTheme(userId)
```

With:

```ts
getPageTheme(pageId)
```

---

### 2. Always Join Theme with Page

When fetching page:

```sql
SELECT pages.*, themes.*
FROM pages
LEFT JOIN themes ON pages.theme_id = themes.id
WHERE pages.slug = $1;
```

---

### 3. API Response Shape

```json
{
  "page": {
    "id": "page_id",
    "title": "...",
    "theme": { ...themeObject }
  }
}
```

---

## Frontend Changes

### 1. Source of Truth

Replace everywhere:

```ts
const theme = user.theme;
```

With:

```ts
const theme = page.theme;
```

---

### 2. Preview = Hosting (IMPORTANT)

Both preview and hosted page must use the SAME data source:

```ts
// DO NOT use local-only state
const { data: page } = usePage(pageId);

// Always:
const theme = page.theme;
```

❗ No separate preview theme logic
❗ No fallback to user theme

---

### 3. Theme Update Flow

When user edits theme:

* Update `themes` table
* Ensure `pages.theme_id` points to correct theme

Optional (recommended):

* Clone theme on edit to avoid global overwrite

---

## Hosting Page Fix (Slug Page)

### Problem

Hosted page may still be using:

* Cached theme
* User-based theme
* Static props

### Fix

Ensure slug page fetch:

```ts
getPageBySlug(slug) → includes theme
```

And NOT:

```ts
getUserTheme(userId) ❌
```

---

### If using caching (Next.js / SSR)

Make sure:

```ts
export const revalidate = 0;
```

OR use:

```ts
cache: "no-store"
```

---

## Live Update Fix (IMPORTANT)

If theme changes are not reflecting instantly:

### Use real-time or refetch

Options:

* Supabase realtime subscription
* Manual refetch after update

Example:

```ts
await updateTheme(themeId, data);
await refetchPage();
```

---

## Safeguards

* If `theme_id` is NULL → apply default theme
* Do NOT break existing pages during migration
* Ensure backward compatibility during rollout

---

## Testing Checklist

* [ ] Create page → assign theme
* [ ] Different pages → different themes
* [ ] Preview matches hosted page exactly
* [ ] Theme updates reflect instantly
* [ ] No dependency on user theme
* [ ] Slug page shows the correct theme
* [ ] No caching issues

---

## Final Rule (DO NOT BREAK)

* Theme must ALWAYS come from: `page.theme`
* NEVER from: `user.theme`

---

## Summary

We are moving from:

```
User → Theme
```

To:

```
Page → Theme
```

This ensures:

* Per-page customization
* Correct preview behavior
* Consistent hosting output
* Scalable architecture

---

## Priority

HIGH — affects core UI, preview, and hosting behavior
Must be implemented cleanly without breaking existing pages
