"use client"

import { createClient } from "@/lib/supabase-browser"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

const supabase = createClient()

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const message = searchParams.get("message")

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px]"
      >
        <Card className="rounded-2xl p-6 shadow-2xl text-center border-0 bg-white dark:bg-gray-900">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
            ELTLINKTREE
          </h1>
          <p className="text-gray-500 text-base">
            All your links in one place
          </p>
        </div>

        {/* Error Message */}
        {error === "unauthorized" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">
              {message || "Access denied. Only authorized users can sign in."}
            </p>
          </div>
        )}

        {/* Decorative Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-8 flex items-center justify-center">
          <Link className="w-10 h-10 text-white" />
        </div>

        {/* Login Button */}
        <Button
          onClick={signIn}
          className="w-full py-6 text-base font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 mt-4"
          size="lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        {/* Footer */}
        {/* <p className="mt-8 text-sm text-gray-400">
          Only @eltglobal.in emails allowed
        </p> */}
        </Card>
      </motion.div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}