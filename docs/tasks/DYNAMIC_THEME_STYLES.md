# 🎨 Update Plan – Dynamic Theme Generator (Manual Trigger Mode)

## 🎯 Goal

Modify the existing **Dynamic Theme Generator** so that:

- ❌ NO automatic interval-based changes
- ✅ Theme changes happen **ONLY when user clicks a button**
- ✅ All controls live inside the **Theme Editor UI**
- ✅ Keeps smart constraints (contrast, no ugly combos)

---

## 🧠 Behavior Change (IMPORTANT)

### ❌ REMOVE:

- `setInterval`
- Continuous random generation
- Auto-changing themes

### ✅ ADD:

- **"Generate Theme" button**
- Optional: **"Shuffle Once"**
- Optional: **"Lock Elements" (bg, text, etc.)**

---

## ⚙️ State Management

```ts
const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
const [lockedFields, setLockedFields] = useState({
  bg: false,
  text: false,
  links: false,
});
```

---

## 🎲 Theme Generation (Manual Trigger)

### Function: `handleGenerateTheme`

```ts
const handleGenerateTheme = () => {
  let theme;

  do {
    theme = generateRandomTheme(lockedFields, currentTheme);
  } while (!isValidTheme(theme));

  setCurrentTheme(theme);
  applyTheme(theme); // preview only
};
```

---

## 🎨 Smart Theme Generator

### `generateRandomTheme`

```ts
function generateRandomTheme(locks, prevTheme) {
  const baseHue = Math.floor(Math.random() * 360);

  const bg = locks.bg ? prevTheme.bg : `hsl(${baseHue}, 40%, 10%)`;

  const textLight = `hsl(${baseHue}, 20%, 90%)`;
  const textDark = `hsl(${baseHue}, 20%, 10%)`;

  const isDarkBg = getLuminance(bg) < 0.5;

  const title_color = locks.text
    ? prevTheme.title_color
    : isDarkBg
      ? textLight
      : textDark;

  const link_text_color = locks.links ? prevTheme.link_text_color : title_color;

  const link_subtext_color = isDarkBg
    ? `rgba(255,255,255,0.7)`
    : `rgba(0,0,0,0.6)`;

  return {
    bg,
    title_color,
    bio_color: title_color,
    link_text_color,
    link_subtext_color,
    avatar_style: randomAvatarStyle(),
    font_family: randomFont(),
  };
}
```

---

## 🧪 Theme Validation (UNCHANGED)

```ts
function isValidTheme(theme) {
  return (
    theme.bg !== theme.title_color &&
    theme.bg !== theme.link_text_color &&
    hasGoodContrast(theme.bg, theme.title_color) &&
    hasGoodContrast(theme.bg, theme.link_text_color)
  );
}
```

---

## 🧠 Luminance + Contrast

```ts
function getLuminance(hsl) {
  // convert HSL → RGB → luminance
  // simplified or use library
}

function hasGoodContrast(bg, text) {
  return Math.abs(getLuminance(bg) - getLuminance(text)) > 0.4;
}
```

---

## 🖥️ Theme Editor UI (IMPORTANT)

### [MODIFY] `Theme Editor Component`

Add controls:

### 🔘 Generate Button

```tsx
<Button onClick={handleGenerateTheme}>🎨 Generate Theme</Button>
```

---

### 🔒 Lock Controls (Optional but powerful)

```tsx
<Checkbox checked={lockedFields.bg} onChange={() => toggleLock("bg")}>
  Lock Background
</Checkbox>
```

Same for:

- Text
- Links

---

### 🎛️ Font + Avatar Integration

Ensure generator also updates:

```ts
font_family: randomFont();
avatar_style: randomAvatarStyle();
```

---

## 💾 Persistence Rules (IMPORTANT)

- ❌ DO NOT auto-save on generate
- ✅ Save only when:

```ts
updatePage({
  theme_config: currentTheme,
});
```

Triggered by:

- Save button
- OR explicit user action

---

## 🔄 Apply Theme (Preview Only)

```ts
function applyTheme(theme) {
  // update UI preview state
  setPreviewTheme(theme);
}
```

---

## 🧩 Integration Points

### [MODIFY]

- `components/appearance/ThemeEditor.tsx` ✅ MAIN PLACE
- Remove any interval logic ❌
- Add button + generator ✅

---

## 🚀 Optional Enhancements

- “Generate Variations” (3 options at once)
- Theme history (undo)
- Favorite/save preset
- Speed slider (if you re-enable auto mode later)

---

## ✅ Expected Result

- User clicks button → new theme generated
- Always readable + clean
- No auto-changing distractions
- Fully controlled inside Theme Editor
- Better UX + performance

---

## 🧠 Final Insight

👉 You’ve basically converted:
**"Auto random chaos engine" → "Controlled smart generator"**

Which is WAY better UX for real users.

---
