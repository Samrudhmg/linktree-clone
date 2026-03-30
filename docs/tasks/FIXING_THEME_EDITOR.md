# Theme Editor Fix & Upgrade (UI + Functionality)

## Objective

Fix missing controls and broken behaviors in the **Theme Editor**, and improve preview accuracy.

---

## ❗ Current Problems

- No option to edit **Title** and **Bio styles**
- Secondary background is not used in preview
- Secondary text color is not applied to subtext
- Border radius selection has no visual feedback
- Button/Accent styles (solid/gradient/minimal) not working
- Card styling interfering with theme preview
- Preview layout unstable / inconsistent

---

## ✏️ 1. Add Title & Bio Styling Controls

### Requirement

User must be able to customize:

#### Title

- Font size
- Font color
- Font weight/style

#### Bio

- Font size
- Font color
- Font weight/style

---

### UI (Inside Theme Editor)

Add new section:

```ts
[ Title Settings ]
- Font Size (slider/input)
- Color Picker
- Font Weight (normal / bold)

[ Bio Settings ]
- Font Size (slider/input)
- Color Picker
- Font Weight (normal / light)
```

---

### Database अपडेट

Add fields in `themes`:

```sql
ALTER TABLE themes ADD COLUMN title_color TEXT;
ALTER TABLE themes ADD COLUMN title_font_size TEXT;
ALTER TABLE themes ADD COLUMN title_font_weight TEXT;

ALTER TABLE themes ADD COLUMN bio_color TEXT;
ALTER TABLE themes ADD COLUMN bio_font_size TEXT;
ALTER TABLE themes ADD COLUMN bio_font_weight TEXT;
```

---

### Frontend Binding

```ts
title.style.color = theme.title_color;
title.style.fontSize = theme.title_font_size;
title.style.fontWeight = theme.title_font_weight;

bio.style.color = theme.bio_color;
bio.style.fontSize = theme.bio_font_size;
bio.style.fontWeight = theme.bio_font_weight;
```

---

## 🎨 2. Fix Background Usage

### Problem

- `primary_bg` is being used for preview incorrectly

---

### Fix

- Use:
  - `secondary_bg` → **Preview Background**
  - `primary_bg` → optional inner/container bg

---

### Implementation

```ts
preview.style.background = theme.secondary_bg;
```

---

## 📝 3. Fix Text Color Mapping

### Problem

- Secondary text color not applied

---

### Fix Mapping

```ts
Primary Text → Title
Secondary Text → Bio / Subtext
```

---

### Implementation

```ts
title.style.color = theme.primary_text_color;
bio.style.color = theme.secondary_text_color;
subtext.style.color = theme.secondary_text_color;
```

---

## 🔲 4. Border Radius Visual Feedback

### Problem

- Selecting Square / Rounded / Pill does nothing visually

---

### Fix

Update preview instantly:

```ts
const radiusMap = {
  square: "0px",
  rounded: "12px",
  pill: "999px",
};

link.style.borderRadius = radiusMap[theme.border_radius];
```

---

### Editor Preview Requirement

- Buttons inside editor must visually reflect selection
- No static buttons

---

## 🎛️ 5. Fix Button & Accent Styles

### Problem

- Solid / Gradient / Minimal → no effect

---

### Fix Logic

#### Solid

```ts
button.style.background = theme.accent_color;
button.style.color = "#fff";
```

---

#### Gradient

```ts
button.style.background = `linear-gradient(135deg, ${theme.accent_color}, #ffffff22)`;
button.style.color = "#fff";
```

---

#### Minimal

```ts
button.style.background = "transparent";
button.style.border = `1px solid ${theme.accent_color}`;
button.style.color = theme.accent_color;
```

---

### Requirement

- Must update LIVE in preview
- Must persist in DB

---

## 🚫 6. Remove Card Style from Theme Editor

### Problem

- "Card Style" option is unnecessary and confusing

---

### Action

- REMOVE completely from:
  - UI
  - DB usage
  - Preview logic

---

## 🖥️ 7. Fix Preview Window (CRITICAL)

### Problems

- Layout shifting
- Preview not consistent
- Styling leakage from editor

---

### Fix

#### Stable Frame

```css
.preview-frame {
  width: 375px;
  height: 667px;
  overflow: hidden;
  position: relative;
}
```

---

#### Isolation (IMPORTANT)

Use:

```ts
<iframe src="/preview-page" />
```

OR strict container isolation

---

### Rules

- Preview must NOT change size
- Preview must NOT inherit editor styles
- Preview must EXACTLY match hosted page

---

## 🎯 Final Behavior

- Editing theme updates preview instantly
- Title & Bio styling fully customizable
- Correct color mappings
- Working accent styles
- Clean UI (no unused options)
- Stable preview

---

## 🧪 Testing Checklist

- [ ] Title font size/color/weight updates
- [ ] Bio font size/color/weight updates
- [ ] Secondary bg used in preview
- [ ] Secondary text applied to subtext
- [ ] Border radius changes visually
- [ ] Accent styles (3 modes) working
- [ ] Card style removed
- [ ] Preview frame stable
- [ ] Preview = hosted page

---

## ⚠️ Do NOT Break

- Page → Theme connection
- Existing themes
- Slug page rendering
- Live preview sync

---

## Priority

HIGH — Core UX + Visual correctness
