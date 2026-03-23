# Global Styling Refactor: Remove Hardcoded Colors & Implement Theme-Based System

## Objective

* Remove ALL hardcoded colors from the app
* Centralize colors in `global.css`
* Implement consistent dark/light mode backgrounds
* Standardize buttons, hover states, and UI colors
* Use **grainy gray gradient** system for modern UI

---

## ❗ Current Problems

* Colors are hardcoded across components
* Inconsistent dark/light mode styling
* Buttons and hover states not unified
* Backgrounds differ between pages
* Difficult to maintain or scale themes

---

## 🎯 Target System

ALL colors must come from:

```ts
global.css (CSS variables)
```

NO inline colors like:

```ts
style={{ background: "#000" }} ❌
className="bg-black" ❌
```

---

## 🎨 1. Global Background System

### Dark Mode

Use **grainy gray gradient**

```css
:root.dark {
  --bg-primary: linear-gradient(
    135deg,
    #0f0f0f,
    #1a1a1a,
    #121212
  );
}
```

---

### Light Mode

Use **white-gray soft gradient**

```css
:root.light {
  --bg-primary: linear-gradient(
    135deg,
    #ffffff,
    #f5f5f5,
    #eaeaea
  );
}
```

---

### Apply Globally

```css
body {
  background: var(--bg-primary);
}
```

---

## 🌫️ 2. Add Grain Effect (IMPORTANT)

Add subtle noise texture:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("/noise.png");
  opacity: 0.04;
  pointer-events: none;
}
```

---

## 🔘 3. Button System (Global)

### Base Button Colors

```css
:root.dark {
  --btn-bg: #1a1a1a;
  --btn-hover: #2a2a2a;
  --btn-text: #ffffff;
}

:root.light {
  --btn-bg: #f2f2f2;
  --btn-hover: #e0e0e0;
  --btn-text: #111111;
}
```

---

### Button Styles

```css
.button {
  background: var(--btn-bg);
  color: var(--btn-text);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.button:hover {
  background: var(--btn-hover);
}
```

---

## 🎛️ 4. Remove Hardcoded Colors (CRITICAL)

### Must Remove

* Tailwind classes like:

  * `bg-black`
  * `text-white`
  * `hover:bg-gray-800`

* Inline styles:

```ts
style={{ color: "#fff" }} ❌
```

---

### Replace With

```ts
className="bg-[var(--btn-bg)] text-[var(--btn-text)]"
```

OR predefined classes:

```css
.bg-primary { background: var(--bg-primary); }
.text-primary { color: var(--text-primary); }
```

---

## 🎨 5. Global Color Variables

Define full system:

```css
:root.dark {
  --text-primary: #ffffff;
  --text-secondary: #a1a1a1;
  --border-color: #2a2a2a;
}

:root.light {
  --text-primary: #111111;
  --text-secondary: #555555;
  --border-color: #dddddd;
}
```

---

## 🧩 6. Hover & Interaction Consistency

ALL hover states must use variables:

```css
--hover-bg
--hover-border
--hover-text
```

Example:

```css
.card:hover {
  background: var(--hover-bg);
}
```

---

## 🧱 7. Component Rules

### Strict Rules

* No component should define its own colors
* All styling must come from global variables
* Theme overrides (if any) must extend global system

---

## 🧪 Testing Checklist

* [ ] No hardcoded hex values in components
* [ ] Dark mode uses grainy gradient
* [ ] Light mode uses soft gray-white gradient
* [ ] Buttons consistent across app
* [ ] Hover effects consistent
* [ ] Noise overlay visible but subtle
* [ ] Switching themes updates all UI instantly

---

## ⚠️ Do NOT Break

* Existing layouts
* Theme editor functionality
* Preview rendering
* Page performance

---

## ✅ Summary

We are moving to:

* Centralized color system
* Clean, modern gradient UI
* Fully scalable styling
* Zero hardcoded colors

---

## Priority

HIGH — affects entire UI system
