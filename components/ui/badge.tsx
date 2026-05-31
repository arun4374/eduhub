import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
        variant === "default" && "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
        variant === "secondary" && "border-transparent bg-[#F9FAFB] dark:bg-[#1A1A1A] text-[#111827] dark:text-[#F9FAFB]",
        variant === "destructive" && "border-transparent bg-red-600 text-white hover:bg-red-700",
        variant === "outline" && "border-[#E5E7EB] dark:border-[#2A2A2A] text-[#6B7280] dark:text-[#9CA3AF]",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
