"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react"

export type AlertType = "success" | "error" | "warning" | "info"

type AlertCardProps = {
  open: boolean
  type: AlertType
  message: string
  title?: string
  onClose: () => void
  /** Auto-dismiss after this many ms. Omit to require manual dismiss. */
  autoCloseMs?: number
  /** "toast" floats fixed in the corner; "inline" sits in normal document flow. */
  variant?: "toast" | "inline"
}

const STYLES: Record<AlertType, { icon: typeof CheckCircle; classes: string }> = {
  success: {
    icon: CheckCircle,
    classes: "bg-green-50 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
  },
  error: {
    icon: XCircle,
    classes: "bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800",
  },
  info: {
    icon: Info,
    classes: "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800",
  },
}

/**
 * Reusable alert popup card. Drop it into any page or component:
 *
 *   const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null)
 *
 *   <AlertCard
 *     open={!!alert}
 *     type={alert?.type ?? "info"}
 *     message={alert?.message ?? ""}
 *     onClose={() => setAlert(null)}
 *   />
 *
 * Use variant="toast" (default) for a floating corner notification, or
 * variant="inline" to render it in place within a form or page section.
 */

export function AlertCard({
  open,
  type,
  message,
  title,
  onClose,
  autoCloseMs,
  variant = "toast",
}: AlertCardProps) {
  const { icon: Icon, classes } = STYLES[type]

  useEffect(() => {
    if (!open || !autoCloseMs) return
    const timer = setTimeout(onClose, autoCloseMs)
    return () => clearTimeout(timer)
  }, [open, autoCloseMs, onClose])

  const containerClasses =
    variant === "toast"
      ? "fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:w-full"
      : "w-full"

  return (
    <div className={variant === "toast" ? containerClasses : undefined}>
      <AnimatePresence>
        {open && (
          <motion.div
            role="alert"
            initial={variant === "toast" ? { opacity: 0, y: 16, scale: 0.95 } : { opacity: 0, height: 0 }}
            animate={variant === "toast" ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, height: "auto" }}
            exit={variant === "toast" ? { opacity: 0, y: 16, scale: 0.95 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={variant === "inline" ? containerClasses : undefined}
          >
            <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm ${classes}`}>
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
                <p className="text-sm leading-relaxed break-words">{message}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss"
                className="shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AlertCard