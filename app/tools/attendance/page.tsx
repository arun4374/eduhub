'use client'

import React, { useState } from "react"
import { CalendarDays, CheckCircle, AlertTriangle, XCircle, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AttendancePage() {
  const [conducted, setConducted] = useState("45")
  const [attended, setAttended] = useState("38")

  // Derive computations on render instead of inside useEffect
  const totalVal = parseInt(conducted)
  const attendVal = parseInt(attended)

  let percentage: number | null = null
  let status: "safe" | "warning" | "shortage" | null = null
  let consecutiveRequired = 0
  let skippable = 0

  if (!isNaN(totalVal) && !isNaN(attendVal) && totalVal > 0 && attendVal >= 0 && attendVal <= totalVal) {
    // Percentage
    percentage = parseFloat(((attendVal / totalVal) * 100).toFixed(1))

    // Status & predictors
    if (percentage >= 75) {
      status = "safe"
      skippable = Math.max(0, Math.floor(attendVal / 0.75 - totalVal))
    } else {
      status = percentage >= 65 ? "warning" : "shortage"
      consecutiveRequired = Math.max(0, Math.ceil((0.75 * totalVal - attendVal) / 0.25))
    }
  }

  const handleReset = () => {
    setConducted("")
    setAttended("")
  }

  // Get color codes mapping
  const getStatusStyle = () => {
    if (status === "safe") return {
      card: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30",
      pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50",
      text: "text-emerald-600 dark:text-emerald-400",
      infoIcon: <CheckCircle className="h-5 w-5 text-emerald-500" />
    }
    if (status === "warning") return {
      card: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30",
      pill: "bg-amber-100 text-[#78350F] dark:bg-amber-955/40 dark:text-amber-400 border-amber-200/50",
      text: "text-amber-600 dark:text-amber-450",
      infoIcon: <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
    if (status === "shortage") return {
      card: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
      pill: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border-red-200/50",
      text: "text-red-600 dark:text-red-400",
      infoIcon: <XCircle className="h-5 w-5 text-red-500" />
    }
    return {
      card: "border-[#E5E7EB] dark:border-[#2A2A2A] bg-white",
      pill: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      text: "text-gray-500",
      infoIcon: <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const moodStyles = getStatusStyle()

  return (
    <div id="attendance-calculator-view" className="py-12 bg-white dark:bg-[#0F0F0F] transition-colors duration-200 flex flex-col justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md px-4">
        
        {/* Title details */}
        <div className="mb-8 text-center select-none">
          <div className="inline-flex p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl mb-3">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">Attendance Calculator</h1>
          <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 text-center">
            Monitor if you meet the 75% minimum attendance requirement mandated by Anna University regulations.
          </p>
        </div>

        {/* Core calculation card */}
        <Card id="attendance-primary-card" className={`border p-6 transition-all duration-300 ${moodStyles.card} bg-white dark:bg-[#1A1A1A]`}>
          <div className="space-y-4">
            
            {/* Input conducted classes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="conducted-input" className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                Total Classes Conducted <span className="text-red-500">*</span>
              </label>
              <Input
                id="conducted-input"
                type="text"
                placeholder="e.g. 50"
                value={conducted}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d+$/.test(e.target.value)) {
                    setConducted(e.target.value)
                  }
                }}
                className="h-10 text-sm bg-white dark:bg-transparent"
              />
            </div>

            {/* Input attended classes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="attended-input" className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                Classes Attended <span className="text-red-500">*</span>
              </label>
              <Input
                id="attended-input"
                type="text"
                placeholder="e.g. 40"
                value={attended}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d+$/.test(e.target.value)) {
                    setAttended(e.target.value)
                  }
                }}
                className="h-10 text-sm bg-white dark:bg-transparent"
              />
            </div>

          </div>

          {/* Large Live percentage stats panel */}
          {percentage !== null && (
            <div className="mt-8 pt-6 border-t border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Your Attendance</span>
              
              <div className="my-2.5 flex items-baseline gap-1 animate-in zoom-in-95 duration-150">
                <span className={`text-5xl font-black ${moodStyles.text} tracking-tight`}>
                  {percentage}%
                </span>
              </div>

              {/* Status pill description */}
              <div className={`mt-2 text-xs font-bold border px-3 py-1.5 rounded-full flex items-center gap-1.5 select-none ${moodStyles.pill}`}>
                {moodStyles.infoIcon}
                <span>
                  {status === "safe" && "Attendance Standard Met"}
                  {status === "warning" && "Borderline - Watch Out"}
                  {status === "shortage" && "Condonation Bracket / Shortage"}
                </span>
              </div>

              {/* Dynamic predictive analytics description block */}
              <div id="analytics-predictions" className="mt-6 w-full p-4 bg-white/50 dark:bg-black/15 rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] text-xs text-justify leading-relaxed">
                {status === "safe" ? (
                  <div className="text-emerald-700 dark:text-emerald-400 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      You have met the required 75% standard. You can safely <strong>skip up to {skippable} more {skippable === 1 ? "class" : "classes"}</strong> and still maintain the necessary 75% baseline.
                    </span>
                  </div>
                ) : (
                  <div className="text-red-700 dark:text-red-400 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                    <span>
                      Your current score is below the 75% criteria. You must <strong>attend the next {consecutiveRequired} consecutive classes</strong> to bring your overall status back up to 75%.
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Reset button controller */}
          {(conducted || attended) && (
            <div className="mt-6 flex justify-center">
              <Button
                id="reset-attendance-btn"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-[#6B7280] flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Clear Inputs
              </Button>
            </div>
          )}

        </Card>
      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
export const dynamicParams = true
