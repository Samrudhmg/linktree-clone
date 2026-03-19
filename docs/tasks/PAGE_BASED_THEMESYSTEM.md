# 🧠 AGENT TASK: Page-Based Theme System (Themes Linked to Pages)

---

## 🎯 Objective

Refactor the theme system so that:

* Themes are applied **per page**, NOT per user
* Each page has its own theme
* Users can create multiple pages with different themes
* Themes can be:

  * Default (global)
  * Page-specific (customized for that page)

---

## 🧱 STEP 1: DATABASE DESIGN

---

### 1.1 `themes` table

```sql
id UUID PRIMARY KEY
name TEXT
type TEXT CHECK (type IN ('default', 'custom'))
config JSONB
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

### 1.2 `pages` table (UPDATE REQUIRED)

Add:

```sql
theme_id UUID REFERENCES themes(id)
```

---

## 💡 KEY IDEA

* Theme is NOT tied to user
* Theme is tied to page

👉 A user can have:

* Page A → Theme 1
* Page B → Theme 2

---

## 📦 STEP 2: THEME CONFIG STRUCTURE

Each theme MUST include:

```json
{
  "background": {
    "primary": "#0a0f1c",
    "secondary": "#0f172a"
  },
  "text": {
    "primary": "#ffffff",
    "secondary": "#9ca3af"
  },
  "links": {
    "style": "glass",
    "radius": "rounded-xl",
    "padding": "p-4"
  },
  "button": {
    "variant": "gradient",
    "accent": "#7c8cff"
  },
  "card": {
    "style": "glass"
  }
}
```

---

## 🎨 STEP 3: THEME TYPES

### `default`

* Predefined themes
* Available to all pages

### `custom`

* Created from editor
* Stored per page (not shared globally)

---

## 🔍 STEP 4: FETCH LOGIC

When loading themes for a page:

```sql
SELECT * FROM themes
WHERE type = 'default'
   OR id = CURRENT_PAGE.theme_id;
```

---

## 🎯 STEP 5: APPLY THEME

On page load:

```ts
const theme = getTheme(page.theme_id)
applyTheme(theme.config)
```

---

## 🌐 STEP 6: APPLY TO DOM

Agent MUST:

* Convert theme config → CSS variables

```ts
document.documentElement.style.setProperty("--bg-primary", config.background.primary)
document.documentElement.style.setProperty("--text-primary", config.text.primary)
```

---

## ➕ STEP 7: CREATE NEW THEME (PER PAGE)

### Flow:

1. User clicks **+ Add Theme**
2. Opens Theme Editor
3. User customizes theme
4. On save:

```ts
const theme = await createTheme({
  name: "Custom Theme",
  type: "custom",
  config
})

await updatePage(page.id, {
  theme_id: theme.id
})
```

---

## 🧠 IMPORTANT RULE

👉 Custom theme is ONLY used by that page

* No user-wide sharing
* No global visibility

---

## ✏️ STEP 8: EDIT THEME

When editing:

* Load current page theme into editor
* Update same theme record

```ts
updateTheme(theme.id, config)
```

---

## 🎨 STEP 9: UI CHANGES

---

### REMOVE:

* ❌ Custom vs Theme toggle
* ❌ User-based theme logic

---

### ADD:

* Theme grid
* * Add Theme card

---

### BEHAVIOR:

* Clicking theme → assigns to page
* Clicking + → opens editor
* Saving → creates new theme AND assigns to page

---

## 🧪 STEP 10: VALIDATION

* [ ] Each page has its own theme
* [ ] Switching pages changes theme
* [ ] Custom themes only affect one page
* [ ] Default themes reusable
* [ ] Theme persists after reload

---

## 🧹 STEP 11: CLEANUP

* Remove user-based theme storage
* Remove old custom logic
* Remove duplicate styles

---

## 🚀 FINAL RESULT

* Page-based theming system
* Clean architecture
* Scalable for:

  * multiple pages
  * different styles per page

---

## 🔥 CORE PRINCIPLE

> A theme belongs to a page, not a user.

---

## 🏁 END TASK
