# 🧠 INTERACTION ANIMATION SYSTEM (Buttons + Panels + UI States)

---
[!IMPORTANT]
## 📁 File Structure

Create:

```
/components/animated/interaction.tsx
```

---

## 🔘 1. Animated Button (Hover + Active + Selected)

```tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: React.ReactNode
  selected?: boolean
  className?: string
  [key: string]: any
}

export function AnimatedButton({
  children,
  selected,
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <Button
        className={cn(
          "transition-all duration-200",
          selected && "ring-2 ring-primary shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
```

---

## 🎯 Behavior

* Hover → slight zoom (alive feel)
* Click → press feedback
* Selected → ring + shadow (clear state)

---

## 🧱 2. Animated Panel (Open / Close)

👉 Use this for:

* Appearance settings panel
* Sidebar
* Modal-like sections

```tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"

export function AnimatedPanel({
  open,
  children
}: {
  open: boolean
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## 🧠 Usage Example

```tsx
const [open, setOpen] = useState(false)

<AnimatedButton onClick={() => setOpen(!open)}>
  Toggle Appearance
</AnimatedButton>

<AnimatedPanel open={open}>
  <Card className="p-6">
    Appearance Settings
  </Card>
</AnimatedPanel>
```

---

## 🧊 3. Dropdown / Popover Animation

```tsx
export const dropdownAnimation = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.96 },
  transition: { duration: 0.18 }
}
```

---

## 🪄 4. Selected State Toggle (Tabs / Filters)

```tsx
<motion.div
  animate={{
    backgroundColor: selected ? "var(--primary)" : "transparent",
    color: selected ? "#fff" : "inherit"
  }}
  transition={{ duration: 0.2 }}
  className="px-4 py-2 rounded-md cursor-pointer"
>
  Option
</motion.div>
```

---

## ✨ 5. Smooth Height Expand (Advanced UI)

👉 For sections expanding (like settings)

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.25 }}
>
  {children}
</motion.div>
```

---

## ⚡ Animation Rules (VERY IMPORTANT)

* Hover scale → `1.02 – 1.03`
* Tap scale → `0.95`
* Duration → `0.15 – 0.25s`
* Keep animations **fast + subtle**
* NEVER overuse bounce or heavy motion

---

## 🎯 Where to Use

* Buttons → AnimatedButton
* Settings panel → AnimatedPanel
* Dropdowns → dropdownAnimation
* Tabs → selected state animation
* Expand sections → height animation

---

## 🚀 Final Result

UI will feel:

* Responsive
* Interactive
* Premium (like Linear / Vercel dashboards)

---

## 🏁 DONE

---

### Implementation Approach

I implemented the Interaction Elements using a component-driven approach with `framer-motion` to keep animations highly consistent and performant across the dashboard (like the Sidebar and PageAppearance editors) and link forms.

**Why this approach?**
1. **Reusable Wrappers (`AnimatedButton`, `AnimatedPanel`)**: Centralizing these in `interaction.tsx` guarantees that all interactive elements share the identical "feel" (durations, scalings).
2. **Next.js Integration**: Framer Motion works seamlessly on the client (`"use client"` directive). Wrapping existing shadcn `Button` elements within a `motion.div` avoids conflicting with React's event propagation while providing fluid animations.
3. **Smooth State Transitions**: Using `AnimatePresence` inside `AnimatedPanel` enables exit animations, which drastically enhances the perceived performance of expanding/collapsing sections like the Theme Customizer without relying on clunky CSS transitions.
4. **Targeted Replacements**: I selectively replaced static buttons with `AnimatedButton` in key navigational and action areas (Sidebar tabs, Link creation forms) to provide immediate tactile feedback when users hover or click.
