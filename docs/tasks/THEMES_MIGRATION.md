# 🧠 AGENT TASK: Full Theme System Refactor (DB + UI + Styles)

---
[!IMPORTANT]
## 🎯 Objective

Refactor the current theme system to:

* Remove "Custom vs Theme" separation
* Convert ALL styling into a unified **Theme प्रणाली**
* Store themes in database
* Support:

  * Default themes (global)
  * User-created themes (private)
* Include full UI styling:

  * Background colors
  * Font colors
  * Link styles (outline, flat, white, glass)
  * Button styles
  * Card styles

---

## 🧱 STEP 1: DATABASE SETUP

### Create `themes` table:

```sql
id UUID PRIMARY KEY
name TEXT
type TEXT CHECK (type IN ('default', 'user'))
user_id UUID NULL
config JSONB
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

### Create `user_settings` table:

```sql
user_id UUID PRIMARY KEY
selected_theme_id UUID
```

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
    "primary": "#e6edf6",
    "secondary": "#9aa4b2"
  },
  "links": {
    "style": "glass", 
    "radius": "rounded-xl",
    "padding": "p-4",
    "shadow": "soft"
  },
  "button": {
    "variant": "gradient",
    "accent": "#7c8cff"
  },
  "card": {
    "style": "glass",
    "border": "subtle"
  }
}
```

---

## 🎨 STEP 3: PREDEFINED LINK STYLES

Agent MUST support these styles:

### 1. `outline`

* transparent bg
* border visible

### 2. `flat`

* solid bg
* no border

### 3. `white`

* white bg
* dark text

### 4. `glass`

* bg: `rgba(255,255,255,0.05)`
* backdrop blur
* subtle border

---

## 🎯 STEP 4: MIGRATE EXISTING THEMES

* Convert all hardcoded themes → DB
* Mark them as:

```sql
type = 'default'
user_id = NULL
```

---

## 🔍 STEP 5: FETCH LOGIC

```sql
SELECT * FROM themes
WHERE type = 'default'
   OR user_id = CURRENT_USER_ID;
```

---

## ❌ STEP 6: REMOVE CUSTOM MODE

Agent MUST:

* Delete "Custom" tab completely
* Remove all custom-specific logic
* Treat everything as a theme

---

## ➕ STEP 7: ADD "CREATE THEME" FEATURE

### UI:

* Add last card:

```tsx
"+ Add Theme"
```

### Behavior:

On click:

* Open Theme Editor (Sheet preferred)

---

## 🧩 STEP 8: THEME EDITOR

Editor MUST include controls for:

### 🎨 Colors

* Background primary
* Background secondary
* Text primary
* Text secondary

---

### 🔘 Link Styles

* Select:

  * outline
  * flat
  * white
  * glass

---

### 🔳 Button Style

* solid
* gradient
* minimal

---

### 🧱 Card Style

* flat
* glass
* bordered

---

## 💾 STEP 9: SAVE THEME

On save:

```ts
createTheme({
  name,
  type: 'user',
  user_id: currentUser.id,
  config
})
```

---

## 🔐 RULES

* User themes MUST be private
* Do NOT expose other users' themes

---

## 🎯 STEP 10: APPLY THEME

On selection:

```ts
applyTheme(theme.config)
saveUserPreference(theme.id)
```

---

## 🌐 STEP 11: APPLY TO DOM

Agent MUST:

* Map config → CSS variables
* Apply globally

Example:

```ts
document.documentElement.style.setProperty("--bg-primary", config.background.primary)
```

---

## 🔄 STEP 12: HYDRATION

On app load:

```ts
loadUserTheme()
applyTheme()
```

---

## 🎨 STEP 13: THEME VARIATION (IMPORTANT)

Agent MUST ensure:

Different themes LOOK different:

### Example Variations:

#### Theme 1 (Minimal Dark)

* flat links
* no shadow
* subtle borders

#### Theme 2 (Glass Premium)

* glass cards
* blur
* glow accent

#### Theme 3 (Bold Gradient)

* gradient buttons
* vibrant accent
* stronger shadows

---

## 🧪 STEP 14: VALIDATION

* [ ] Themes load from DB
* [ ] User themes are private
* [ ] Editor saves correctly
* [ ] Theme applies instantly
* [ ] UI updates globally
* [ ] No "custom mode" remains

---

## 🧹 STEP 15: CLEANUP

* Remove old theme logic
* Remove duplicate styles
* Remove unused Tailwind classes

---

## 🚀 FINAL RESULT

* Unified theme system
* Dynamic theme creation
* Clean UX
* Scalable architecture

---

## 🔥 CORE PRINCIPLE

> Everything is a theme. No exceptions.

---

## 🏁 END TASK
