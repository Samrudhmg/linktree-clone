"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/utils/cn"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  selected?: boolean
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
      className={className?.includes("w-full") ? "w-full" : undefined}
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

export const dropdownAnimation = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.96 },
  transition: { duration: 0.18 }
}
