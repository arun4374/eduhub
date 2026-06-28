"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { ArrowLeft, Home, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.back()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="relative w-32 h-32 mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 text-indigo-100 dark:text-indigo-900/30"
          >
            <Compass className="w-full h-full" strokeWidth={1} />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600">
              404
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto">
            Looks like you've ventured into the unknown. We're redirecting you back in{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{countdown}s</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-10 text-sm border-gray-200 dark:border-gray-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Now
          </Button>
          <Button
            className="w-full sm:w-auto h-10 text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
