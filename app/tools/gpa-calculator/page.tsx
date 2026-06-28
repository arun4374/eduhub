'use client'

import React, { useState } from "react"
import { Calculator, Plus, Trash2, RotateCcw, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface SubjectRow {
  id: string
  name: string
  grade: "O" | "A+" | "A" | "B+" | "B" | "C" | ""
  credits: string
}

export default function GPACalculatorPage() {
  const [rows, setRows] = useState<SubjectRow[]>([
    { id: "1", name: "Professional Mathematics", grade: "A+", credits: "4" },
    { id: "2", name: "Design & Analysis of Algorithms", grade: "O", credits: "4" },
    { id: "3", name: "Operating Systems Laboratory", grade: "A", credits: "2" },
  ])

  // Grade points mapping
  const gradePoints: Record<string, number> = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
  }

  // Derive GPA during render dynamically
  let totalScore = 0
  let totalCredits = 0

  rows.forEach((row) => {
    const points = gradePoints[row.grade]
    const creditVal = parseFloat(row.credits)

    if (points !== undefined && !isNaN(creditVal) && creditVal > 0) {
      totalScore += points * creditVal
      totalCredits += creditVal
    }
  })

  const gpa = totalCredits > 0 ? parseFloat((totalScore / totalCredits).toFixed(2)) : null

  const handleAddSubject = () => {
    const nextNum = rows.length + 1
    const newRow: SubjectRow = {
      id: Date.now().toString(),
      name: `Subject Course ${nextNum}`,
      grade: "",
      credits: "",
    }
    setRows([...rows, newRow])
  }

  const handleRemoveSubject = (id: string) => {
    if (rows.length === 1) return // Keep at least one
    const filtered = rows.filter((r) => r.id !== id)
    setRows(filtered)
  }

  const handleInputChange = (id: string, field: "name" | "grade" | "credits", val: string) => {
    if (field === "credits" && val !== "" && !/^\d*\.?\d*$/.test(val)) return

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
      { id: "1", name: "", grade: "", credits: "" },
      { id: "2", name: "", grade: "", credits: "" },
    ])
  }

  return (
    <div id="gpa-calculator-view" className="py-12 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header section */}
        <div className="mb-10 text-center select-none">
          <div className="inline-flex p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl mb-3">
            <Calculator className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">GPA Calculator</h1>
          <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 text-center max-w-lg mx-auto leading-relaxed">
            Determine your single-semester Grade Point Average (GPA) live. Select grades conforming to AU guidelines and specify credit weightages.
          </p>
        </div>

        {/* Triple column grid splits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Group Inputs list */}
          <div className="md:col-span-2 space-y-4">
            <Card id="gpa-ledger-card" className="border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] p-6">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#2A2A2A] pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Course Listing Ledger</span>
                <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono">Academic parameters config</span>
              </div>
              
              <div className="space-y-3">
                {rows.map((row) => (
                  <div
                    id={`gpa-subject-row-${row.id}`}
                    key={row.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#F9FAFB] dark:bg-[#151515] p-3 rounded-lg border border-[#E5E7EB] dark:border-[#2A2A2A]/40 animate-in fade-in"
                  >
                    {/* Subject Course Name */}
                    <div className="flex-1 min-w-[124px]">
                      <Input
                        id={`gpa-row-name-${row.id}`}
                        type="text"
                        placeholder="Subject Name / Code"
                        value={row.name}
                        onChange={(e) => handleInputChange(row.id, "name", e.target.value)}
                        className="h-9 text-xs sm:text-sm bg-white dark:bg-transparent"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Grade Dropdown selection */}
                      <div className="w-24 shrink-0">
                        <Select
                          value={row.grade}
                          onValueChange={(val) => handleInputChange(row.id, "grade", val)}
                        >
                          <SelectTrigger id={`gpa-row-grade-${row.id}`} className="h-9 text-xs select-none bg-white dark:bg-[#151515]">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="O">O (10)</SelectItem>
                            <SelectItem value="A+">A+ (9)</SelectItem>
                            <SelectItem value="A">A (8)</SelectItem>
                            <SelectItem value="B+">B+ (7)</SelectItem>
                            <SelectItem value="B">B (6)</SelectItem>
                            <SelectItem value="C">C (5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Credits Input */}
                      <div className="w-20 shrink-0">
                        <Input
                          id={`gpa-row-credits-${row.id}`}
                          type="text"
                          placeholder="Credits"
                          value={row.credits}
                          onChange={(e) => handleInputChange(row.id, "credits", e.target.value)}
                          className="h-9 text-xs sm:text-sm bg-white dark:bg-transparent text-center"
                        />
                      </div>

                      {/* Trash action button */}
                      <Button
                        id={`gpa-row-delete-${row.id}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSubject(row.id)}
                        disabled={rows.length === 1}
                        className="text-[#6B7280] hover:text-red-500 h-9 w-9 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Grid bottom action control deck */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#2A2A2A]">
                <Button
                  id="add-subject-course-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSubject}
                  className="text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>

                <Button
                  id="reset-gpa-btn"
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

          {/* Right Live Results Widget Column */}
          <div className="md:col-span-1">
            <Card id="gpa-result-card" className="sticky top-24 border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] p-6 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Semester GPA Result</span>
              
              <div className="my-6">
                {gpa !== null ? (
                  <div className="space-y-1">
                    <span className="text-5xl font-black text-sky-600 dark:text-sky-400 tracking-tight block animate-in zoom-in-95 duration-150">
                      {gpa}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest font-bold">
                      Calculated Weighted GPA
                    </span>
                  </div>
                ) : (
                  <div className="py-2.5">
                    <span className="text-xl font-bold text-[#6B7280] dark:text-[#9CA3AF] block">
                      --
                    </span>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] block mt-1 select-none">
                      Map grades and specify credits to calculate GPA.
                    </span>
                  </div>
                )}
              </div>

              {/* Standard conversion charts */}
              <div id="gpa-criteria-legend" className="p-4 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl text-left text-xs bg-[#F9FAFB]/50 dark:bg-transparent">
                <span className="font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-1 mb-2">
                  <Bookmark className="h-3.5 w-3.5 text-sky-500" />
                  Grade Weight Points Legend:
                </span>
                <div className="grid grid-cols-2 gap-y-1 text-center text-[#6B7280] dark:text-[#9CA3AF] font-mono">
                  <div className="flex justify-between px-2"><span>O</span> <span className="font-bold text-sky-600 leading-none">10</span></div>
                  <div className="flex justify-between px-2"><span>A+</span> <span className="font-bold text-sky-600 leading-none">9</span></div>
                  <div className="flex justify-between px-2"><span>A</span> <span className="font-bold text-sky-600 leading-none">8</span></div>
                  <div className="flex justify-between px-2"><span>B+</span> <span className="font-bold text-sky-600 leading-none">7</span></div>
                  <div className="flex justify-between px-2"><span>B</span> <span className="font-bold text-sky-600 leading-none">6</span></div>
                  <div className="flex justify-between px-2"><span>C</span> <span className="font-bold text-sky-600 leading-none">5</span></div>
                </div>
              </div>

              {/* Policy note footer */}
              <p className="mt-5 select-none text-[10px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed text-justify">
                * Note: Grade weight index scales mapping standard 10-point Anna University Regulation 2021 criteria. Failing grades (U/UA) carry 0 credits weight.
              </p>

            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
export const dynamicParams = true
