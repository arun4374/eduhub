"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export function ConfirmationDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmationDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
          >
            <Card>
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                {isDestructive && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="mt-2 leading-relaxed">{message}</CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="mt-4 flex justify-end gap-3 border-none p-4 pt-0">
                <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
                <Button variant={isDestructive ? "destructive" : "default"} onClick={onConfirm}>{confirmText}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}