"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ComponentProps } from "react"

export function AnimatedButton(props: ComponentProps<typeof Button>) {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button {...props} />
    </motion.div>
  )
}
