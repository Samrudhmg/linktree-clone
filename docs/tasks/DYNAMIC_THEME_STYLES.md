# 🎨 FEATURE: Dynamic Theme Generator (Smart Random Mode)

## 🎯 Goal

Add a **"Dynamic Mode"** that generates random themes continuously **with smart constraints** to ensure good design and readability.

---

## 🧠 Behavior

### Toggle ON:

* Start generating random themes
* Apply in real-time (every 300–800ms)

### Toggle OFF:

* Stop generation
* Keep last generated theme

---

## 🎨 What Changes Dynamically

* Background (color or gradient)
* Card background + text
* Title + bio colors
* Link text + subtext
* Avatar style

---

## 🚨 STRICT COLOR RULES (IMPORTANT)

### 1. No Same Colors (Readability Rule)

* Background color MUST NOT equal:

  * title_color
  * bio_color
  * link_text_color

---

### 2. Contrast Enforcement (MANDATORY)

Ensure sufficient contrast:

* Light background → dark text
* Dark background → light text

👉 Implement using luminance check:

```ts
function getLuminance(hex) { ... }
```

Rule:

```
abs(luminance(bg) - luminance(text)) > threshold
```

---

### 3. Links Must Match (Consistency Rule)

* `link_text_color` = SAME for all links
* `link_subtext_color` = slightly lighter/darker version of link_text_color

Example:

```
link_text_color: #ffffff
link_subtext_color: rgba(255,255,255,0.7)
```

---

### 4. Avoid Ugly Combos

❌ Avoid:

* Neon on neon
* Low contrast (gray on gray)
* Fully random RGB chaos

✅ Prefer:

* HSL-based color generation
* Controlled saturation + lightness

---

## 🎲 Smart Color Generation Strategy

Use HSL:

* Base hue: random (0–360)
* Generate palette from same hue:

  * background
  * text (contrast adjusted)
  * links (derived tone)

---

## 🧩 Theme Validation (CRITICAL)

Before applying a generated theme:

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

👉 If invalid:

* regenerate until valid

---

## ⚙️ Implementation

### State

```ts
const [isDynamic, setIsDynamic] = useState(false);
const intervalRef = useRef(null);
```

---

### Interval Logic

```ts
if (isDynamic) {
  intervalRef.current = setInterval(() => {
    let theme;
    do {
      theme = generateRandomTheme();
    } while (!isValidTheme(theme));

    applyTheme(theme);
  }, 500);
}
```

---

### Cleanup

```ts
clearInterval(intervalRef.current);
```

* on toggle OFF
* on unmount

---

## 💾 Persistence Rules

* DO NOT auto-save during dynamic mode
* Save only when:

  * user clicks "Save"
  * OR stops dynamic mode

---

## 🖥️ UI Requirements

* Toggle: "Dynamic Mode"
* Indicator: "🎨 Live Preview Running"
* Optional:

  * Speed control
  * “Shuffle Once” button

---

## 🚀 Bonus Enhancements

* “Lock Colors” (lock bg but randomize others)
* Favorite theme button
* History (undo previous theme)

---

## ✅ Expected Result

* Colors change continuously
* Always readable
* No duplicate/ugly combos
* Links stay visually consistent

---
