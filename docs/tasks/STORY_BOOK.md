# Setup Storybook for Next.js (pnpm)

## Goal

Set up **Storybook for a Next.js project (using pnpm)** to visualize core UI components in isolation.

---

## 1. Install Storybook (Next.js compatible)

Run:

```
pnpm dlx storybook@latest init
```

Ensure:

* Framework detected: **Next.js**
* Uses existing project config

---

## 2. Verify Configuration

Ensure `.storybook/main.ts` looks like:

```
framework: {
  name: '@storybook/nextjs',
  options: {}
}
```

---

## 3. Clean Default Setup

After installation:

* Remove example stories
* Keep only required config files:

  * `.storybook/main.ts`
  * `.storybook/preview.ts`

---

## 4. Folder Structure

Co-locate stories with components:

```
src/
  components/
    Button.tsx
    Button.stories.tsx
    ThemeToggle.tsx
    ThemeToggle.stories.tsx
    PublicLinkItem.tsx
    PublicLinkItem.stories.tsx
```

---

## 5. Target Components (IMPORTANT)

Create stories ONLY for core reusable components:

### Include:

* ThemeToggle
* PublicLinkItem
* Button (if exists)
* Card / Link components
* Theme-based UI components

### Exclude:

* Pages (`/app` or `/pages`)
* Layout files
* API routes

---

## 6. Story Format (CSF)

Use this format:

```
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Click me',
  },
};
```

---

## 7. Add Multiple Variants

Each component must include multiple states:

### Button:

* Primary
* Secondary
* Disabled

### PublicLinkItem:

* With title only
* With subtext
* With full theme
* Without subtext

### ThemeToggle:

* Default
* Light mode
* Dark mode

---

## 8. Handle Next.js Features

Ensure compatibility for:

### next/image

* Use unoptimized mode if needed

### next/link

* Use plain anchor fallback if issues occur

### next-themes (if used)

* Mock or provide default theme context

---

## 9. Add Controls

Enable Storybook controls for props:

* text
* boolean
* theme variants

---

## 10. Scripts (pnpm)

Ensure `package.json` includes:

```
"scripts": {
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

---

## 11. Keep It Minimal

Do NOT:

* Add unnecessary addons
* Add testing tools inside Storybook
* Overconfigure

---

## 12. Success Criteria

* `pnpm storybook` runs successfully
* Stories exist for core components
* Variants are meaningful
* Components render without Next.js errors
* Props are editable via controls

---

## Expected Outcome

* UI components can be viewed in isolation
* Theme variations are easily previewed
* Faster development and debugging
