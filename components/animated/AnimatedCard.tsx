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
