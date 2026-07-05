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
    classes: "bg-green-600 text-white",
  },
  error: {
    icon: XCircle,
    classes: "bg-red-600 text-white",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-500 text-white",
  },
  info: {
    icon: Info,
    classes: "bg-indigo-600 text-white",
  },
}

/**
 * Reusable alert popup card. Toasts auto-close after 7s by default.
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

export function Alertcard({
  open,
  type,
  message,
  title,
  onClose,
  autoCloseMs,
  variant = "toast",
}: AlertCardProps) {
  const { icon: Icon, classes } = STYLES[type]

  // Toasts auto-close after 7s by default, unless overridden.
  const effectiveAutoCloseMs = autoCloseMs ?? (variant === "toast" ? 7000 : undefined)

  useEffect(() => {
    if (!open || !effectiveAutoCloseMs) return
    const timer = setTimeout(onClose, effectiveAutoCloseMs)
    return () => clearTimeout(timer)
  }, [open, effectiveAutoCloseMs, onClose])

  const containerClasses =
    variant === "toast"
      ? "fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:w-full"
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
            <div className={`flex items-start gap-3 p-4 rounded-xl shadow-lg ${classes}`}>
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
                <p className="text-sm leading-relaxed break-words">{message}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss"
                className="shrink-0 rounded-md p-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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


export default Alertcard