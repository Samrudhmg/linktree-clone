# Feature Upgrade: Theme Editing, Copying & Stable Preview (Theme Editor Only)

## Objective

Enhance the **Theme Editor** with:

* Edit existing themes
* Copy theme styles between pages
* Keep all actions inside theme editor
* Improve UI (smaller theme cards)
* Fix unstable preview frame
* Remove card-style interference from preview

---

## 🧠 Core Principles

* All theme operations must happen **inside Theme Editor**
* Themes are **page-based**
* Preview must be **stable and consistent**
* No UI styling should interfere with preview rendering

---

## ✏️ 1. Edit Existing Theme

### Requirement

After a theme is created, user must be able to:

* Edit colors
* Edit fonts
* Edit avatar style
* Edit link styles

---

### Implementation

#### UI

Add button on each theme:

```ts
[ Edit Theme ]
```

---

#### Behavior

* Load selected theme into editor
* Update the same `theme_id`

```ts
await updateTheme(themeId, updatedValues);
```

---

#### Important

* Do NOT create new theme on edit
* Do NOT break page linkage

---

## 📋 2. Copy Theme Between Pages

### Requirement

User should be able to:

* Copy a theme
* Apply it to another page
* Retain ALL styles

---

### UI

Inside Theme Editor:

```ts
[ Copy Theme ]
[ Apply to Page ▼ ]
```

---

### Behavior

#### Step 1: Copy Theme

```ts
const copiedTheme = theme;
```

---

#### Step 2: Apply to another page

```ts
await updatePage(targetPageId, {
  theme_id: copiedTheme.id
});
```

---

### Optional (Better UX)

Clone theme before applying:

```ts
const newTheme = await createTheme({
  ...copiedTheme,
  id: newId
});

assignToPage(newTheme.id);
```

---

## 🎛️ 3. Keep Everything Inside Theme Editor

### Rules

* NO theme changes outside editor
* NO quick-edit from page UI
* NO hidden theme mutations

All actions must go through:

```ts
ThemeEditor.tsx
```

---

## 🎨 4. Make Theme Cards Smaller (Page Appearance)

### Problem

Theme cards are too large → cluttered UI

---

### Fix

Reduce size:

```css
.theme-card {
  width: 140px;
  height: 180px;
  padding: 8px;
}
```

---

### Improvements

* Show mini preview
* Show theme name
* Add hover actions (Edit / Apply)

---

## 🖥️ 5. Fix Preview Frame (CRITICAL)

### Problem

Preview frame is:

* Resizing
* Jumping
* Re-rendering inconsistently

---

### Fix

Lock preview container:

```css
.preview-frame {
  width: 375px;
  height: 667px;
  overflow: hidden;
  position: relative;
}
```

---

### Rules

* Fixed dimensions
* No layout shifts
* No dynamic resizing
* Only theme styles should change

---

## 🚫 6. Remove Card Styling from Preview

### Problem

Theme preview is affected by:

* Card UI styles
* Borders / shadows
* Container padding

---

### Fix

Preview must be **pure page render**

---

### Implementation

Wrap preview with reset:

```css
.preview-frame * {
  all: unset;
  box-sizing: border-box;
}
```

OR isolate with:

```ts
<iframe />  // recommended
```

---

### Rule

* Preview must match hosted page EXACTLY
* No editor styles should leak inside preview

---

## 🔁 7. Live Update Behavior

When editing theme:

```ts
await updateTheme(themeId, data);
await refetchPage();
```

---

### Requirement

* Instant update in preview
* No reload needed

---

## 🧪 Testing Checklist

* [ ] Edit theme → updates correctly
* [ ] Copy theme → applies to another page
* [ ] Theme styles fully preserved
* [ ] Theme editor is only control point
* [ ] Theme cards are smaller and clean
* [ ] Preview frame does NOT resize
* [ ] Preview matches hosted page exactly
* [ ] No card styles inside preview

---

## ⚠️ Do NOT Break

* Page → Theme relationship
* Slug page rendering
* Existing themes
* Preview consistency

---

## ✅ Summary

This upgrade ensures:

* Editable themes
* Reusable themes across pages
* Clean UI
* Stable preview system
* Accurate rendering (preview = production)

---

## Priority

HIGH — affects UX, preview accuracy, and theme usability
