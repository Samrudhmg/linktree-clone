# 🧠 AGENT TASK: Migrate UI Codebase to shadcn/ui

## 🎯 Objective

Refactor the existing codebase UI layer to use **shadcn/ui** components instead of custom or inconsistent Tailwind-based components.

The agent must:

* Replace reusable UI primitives with shadcn equivalents
* Maintain functionality and visual consistency
* Avoid breaking existing logic

---

## ⚙️ Environment Assumptions

* Framework: React / Next.js (App Router preferred)
* Styling: Tailwind CSS already configured
* Language: TypeScript
* Project uses absolute imports (`@/`)

---

## 📦 Step 1: Initialize shadcn/ui

### Execute:

```bash
npx shadcn-ui@latest init
```

### Constraints:

* Components directory MUST be: `components/ui`
* Do NOT overwrite existing Tailwind config unless required
* Ensure `utils/cn.ts` exists

---

## 📥 Step 2: Install Required Components

### Install ALL commonly used primitives:

```bash
npx shadcn-ui@latest add button input card dialog form label textarea dropdown-menu toast
```

### Rule:

* If a component is used in code but not installed → install it
* Do NOT install unused components

---

## 🔍 Step 3: Identify Migration Targets

### Scan codebase for:

* Raw HTML elements:

  * `<button>`
  * `<input>`
  * `<select>`
  * `<textarea>`
* Custom components:

  * `Button.tsx`
  * `Modal.tsx`
  * `Card.tsx`
  * `Dropdown.tsx`

### Mark them as:

```
[MIGRATION_REQUIRED]
```

---

## 🔁 Step 4: Component Replacement Rules

### 4.1 Buttons

#### Replace:

```tsx
<button className="...">...</button>
```

#### With:

```tsx
import { Button } from "@/components/ui/button"

<Button>...</Button>
```

### Mapping Rules:

* `bg-red-*` → `variant="destructive"`
* bordered buttons → `variant="outline"`
* ghost styles → `variant="ghost"`

---

### 4.2 Inputs

#### Replace:

```tsx
<input className="..." />
```

#### With:

```tsx
import { Input } from "@/components/ui/input"

<Input />
```

---

### 4.3 Modals

#### Replace custom modal logic with:

```tsx
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
```

---

### 4.4 Cards

#### Replace:

```tsx
<div className="shadow rounded ...">...</div>
```

#### With:

```tsx
import { Card, CardContent } from "@/components/ui/card"

<Card>
  <CardContent>...</CardContent>
</Card>
```

---

### 4.5 Forms

* Replace manual form handling UI with shadcn `Form` components
* Preserve validation logic (e.g., react-hook-form)

---

## 🎨 Step 5: Styling Normalization

### Rules:

* REMOVE redundant Tailwind classes already handled by shadcn
* KEEP layout-related classes (flex, grid, spacing)
* USE `cn()` utility for conditional classes

---

## 🧱 Step 6: Structural Constraints

* DO NOT modify business logic
* DO NOT rename props unless required
* DO NOT change API calls or state management
* Ensure backward compatibility

---

## 🧪 Step 7: Validation Checklist

Agent MUST verify:

* [ ] No broken imports
* [ ] No missing components
* [ ] UI renders correctly
* [ ] No console errors
* [ ] TypeScript passes without errors
* [ ] Components are accessible (focus states, labels)

---

## 🧹 Step 8: Cleanup

* Remove deprecated components
* Delete unused styles
* Remove duplicated UI logic

---

## ⚠️ Edge Cases

* If custom component contains complex logic:
  → Wrap shadcn component instead of full replacement

* If styling is heavily customized:
  → Extend shadcn component, do NOT inline override excessively

---

## 🚀 Output Expectations

Agent must:

1. Produce updated files
2. Maintain readable code
3. Use consistent imports
4. Follow shadcn patterns

---

## 🧠 Priority Order

1. Buttons
2. Inputs
3. Modals / Dialogs
4. Forms
5. Layout components

---

## ✅ Completion Criteria

Migration is COMPLETE when:

* No raw UI primitives remain (unless justified)
* All major UI components use shadcn
* Codebase is consistent and minimal

---

## 📌 Notes

* shadcn is **copy-based**, not a runtime dependency
* Treat components as editable source, not external library
* Prefer composition over customization

---

## 🏁 END OF TASK
