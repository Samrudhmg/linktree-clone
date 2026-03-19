# 🧠 ANIMATION SYSTEM IMPLEMENTATION (shadcn + framer-motion)

---

## 📦 Step 1: Install (if not already)

```bash
npm install framer-motion
```

---

## 📁 Step 2: Create Animation Utilities

Create file:

```
/lib/animations.ts
```

---

## ✨ Animation Config

```tsx
import { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25 }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25 }
  }
}
```

---

## 🧩 Step 3: Animated Wrapper Components

Create:

```
/components/animated/AnimatedContainer.tsx
```

```tsx
"use client"

import { motion } from "framer-motion"
import { fadeInUp } from "@/lib/animations"

export function AnimatedContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}
```

---

## 🧱 Step 4: Animated Card (IMPORTANT)

```
/components/animated/AnimatedCard.tsx
```

```tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

---

## 🔘 Step 5: Animated Button

```
/components/animated/AnimatedButton.tsx
```

```tsx
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function AnimatedButton(props: any) {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button {...props} />
    </motion.div>
  )
}
```

---

## 📄 Step 6: Page-Level Animation

Wrap pages:

```tsx
import { motion } from "framer-motion"
import { fadeInUp } from "@/lib/animations"

export default function Page() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* content */}
    </motion.div>
  )
}
```

---

## ✨ Step 7: Staggered Animations (Pro Level)

```tsx
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
}
```

Use:

```tsx
<motion.div variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div variants={fadeInUp} key={item.id}>
      <AnimatedCard>{item.content}</AnimatedCard>
    </motion.div>
  ))}
</motion.div>
```

---

## 🎯 Animation Rules (IMPORTANT)

* Duration: `0.2s – 0.3s` only
* Scale:

  * hover → `1.02`
  * tap → `0.95–0.98`
* DO NOT over-animate
* Keep transitions smooth and subtle

---

## 🚀 Result

After implementation, UI will feel:

* More interactive
* More premium (SaaS-like)
* Less static / boring

---

## 🏁 DONE




