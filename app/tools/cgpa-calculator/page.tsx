'use client'

import React, { useState } from "react"
import { Calculator, Plus, Trash2, RotateCcw, Award, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface SemesterRow {
  id: string
  label: string
  gpa: string
  credits: string
}

export default function CGPACalculatorPage() {
  const [rows, setRows] = useState<SemesterRow[]>([
    { id: "1", label: "Semester 1", gpa: "8.5", credits: "20" },
    { id: "2", label: "Semester 2", gpa: "8.0", credits: "22" },
  ])

 
  let totalScore = 0
  let totalCredits = 0

  rows.forEach((row) => {
    const gpaVal = parseFloat(row.gpa)
    const creditVal = parseFloat(row.credits)

    if (!isNaN(gpaVal) && !isNaN(creditVal) && gpaVal >= 0 && gpaVal <= 10 && creditVal > 0) {
      totalScore += gpaVal * creditVal
      totalCredits += creditVal
    }
  })

  const cgpa = totalCredits > 0 ? parseFloat((totalScore / totalCredits).toFixed(2)) : null

  const handleAddSemester = () => {
    const nextNum = rows.length + 1
    const newRow: SemesterRow = {
      id: Date.now().toString(),
      label: `Semester ${nextNum}`,
      gpa: "",
      credits: "",
    }
    setRows([...rows, newRow])
  }

  const handleRemoveSemester = (id: string) => {
    if (rows.length === 1) return // Keep at least one row
    const filtered = rows.filter((r) => r.id !== id)
    // Re-index labels for neat design
    const updated = filtered.map((r, idx) => ({
      ...r,
      label: `Semester ${idx + 1}`,
    }))
    setRows(updated)
  }

  const handleInputChange = (id: string, field: "gpa" | "credits", val: string) => {
    // Only allow decimal formats
    if (val !== "" && !/^\d*\.?\d*$/.test(val)) return

    const updated = rows.map((r) => {
      if (r.id === id) {
        return { ...r, [field]: val }
      }
      return r
    })
    setRows(updated)
  }

  const handleReset = () => {
    setRows([
      { id: "1", label: "Semester 1", gpa: "", credits: "" },
      { id: "2", label: "Semester 2", gpa: "", credits: "" },
    ])
  }

  // Determine Class tier text and styles
  const getClassification = (score: number) => {
    if (score >= 9.0) return { text: "Outstanding (First Class with Exemplary)", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200" }
    if (score >= 8.0) return { text: "Excellent (First Class with Distinction)", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200" }
    if (score >= 7.0) return { text: "Good (First Class)", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200" }
    if (score >= 6.0) return { text: "Average (Second Class)", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200" }
    return { text: "Needs Improvement", color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200" }
  }

  const classification = cgpa !== null ? getClassification(cgpa) : null

  return (
    <div id="cgpa-calculator-view" className="py-12 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title Header */}
        <div className="mb-10 text-center select-none">
          <div className="inline-flex p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3">
            <Calculator className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">Cumulative CGPA Calculator</h1>
          <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 text-center max-w-lg mx-auto leading-relaxed">
            A weighted calculation tool tailored to Anna University standards. Enter your GPA and exact credits count per semester below to gauge your cumulative grade score.
          </p>
        </div>

        {/* Dual Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Semester Input Rows Cards */}
          <div className="md:col-span-2 space-y-4">
            <Card id="semester-input-card" className="border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#2A2A2A] pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Semesters Ledger</span>
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">Row weightage (credits) count</span>
              </div>
              
              <div className="space-y-3">
                {rows.map((row) => (
                  <div
                    id={`row-semester-id-${row.id}`}
                    key={row.id}
                    className="flex items-center gap-3 bg-[#F9FAFB] dark:bg-[#151515] p-3 rounded-lg border border-[#E5E7EB] dark:border-[#2A2A2A]/40 animate-in fade-in"
                  >
                    {/* Labelling */}
                    <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] w-20 sm:w-24 shrink-0">
                      {row.label}
                    </span>

                    {/* GPA input */}
                    <div className="flex-1 min-w-[70px]">
                      <Input
                        id={`input-row-gpa-${row.id}`}
                        type="text"
                        placeholder="GPA (0-10)"
                        value={row.gpa}
                        onChange={(e) => handleInputChange(row.id, "gpa", e.target.value)}
                        className="h-9 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Credits input */}
                    <div className="flex-1 min-w-[70px]">
                      <Input
                        id={`input-row-credits-${row.id}`}
                        type="text"
                        placeholder="Credits"
                        value={row.credits}
                        onChange={(e) => handleInputChange(row.id, "credits", e.target.value)}
                        className="h-9 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Deletion button node */}
                    <Button
                      id={`delete-row-btn-${row.id}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSemester(row.id)}
                      disabled={rows.length === 1}
                      className="text-[#6B7280] hover:text-red-500 h-9 w-9 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Functional Bottom controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#2A2A2A]">
                <Button
                  id="add-semester-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSemester}
                  className="text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Semester
                </Button>

                <Button
                  id="reset-cgpa-btn"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset all
                </Button>
              </div>

            </Card>
          </div>

          {/* Right Live Sum Metrics Card */}
          <div className="md:col-span-1">
            <Card id="result-cgpa-card" className="sticky top-24 border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Cumulative CGPA</span>
              
              <div className="my-6">
                {cgpa !== null ? (
                  <div className="space-y-1">
                    <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight block animate-in zoom-in-95 duration-150">
                      {cgpa}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest font-bold">
                      Grade points summation
                    </span>
                  </div>
                ) : (
                  <div className="py-2.5">
                    <span className="text-xl font-bold text-[#6B7280] dark:text-[#9CA3AF] block">
                      --
                    </span>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] block mt-1">
                      Enter GPA & credits values to start
                    </span>
                  </div>
                )}
              </div>

              {/* Classification area */}
              {cgpa !== null && classification && (
                <div id="cgpa-ranking-box" className={`p-4 border rounded-xl flex flex-col items-center justify-center text-center ${classification.color} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <Award className="h-5 w-5 mb-1.5" />
                  <span className="text-xs font-bold">{classification.text}</span>
                </div>
              )}

              {/* Footer Audit Checklist */}
              <div className="mt-6 border-t border-[#E5E7EB] dark:border-[#2A2A2A] pt-4 text-left select-none text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                <span className="font-bold flex items-center gap-1 text-[#111827] dark:text-[#F9FAFB] mb-1">
                  <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                  Classification Criteria:
                </span>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>{"CGPA >= 9.0 : First Class Exemplary"}</li>
                  <li>{"CGPA 8.0 - 8.9 : First Class Distinction"}</li>
                  <li>{"CGPA 7.0 - 7.9 : First Class honors"}</li>
                  <li>{"Below 6.0 : Needs Improvement"}</li>
                </ul>
              </div>

            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
export const dynamicParams = true
