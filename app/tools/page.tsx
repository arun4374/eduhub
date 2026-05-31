import React from "react"
import { Metadata } from "next"
import { LayoutGrid } from "lucide-react"
import { ToolsSection } from "@/components/home/ToolsSection"

export const metadata: Metadata = {
  title: "Academic Tools & Calculators — EduHub Anna University",
  description: "Dynamic calculators designed for Anna University students: compute cumulative CGPA, check semester GPA, and audit classes attendance status live.",
}

export default function ToolsIndexPage() {
  return (
    <div id="tools-page-wrapper" className="py-12 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="mb-10 text-center select-none">
          <div className="inline-flex p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl mb-3">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">Academic Tools Chest</h1>
          <p className="text-xs md:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 text-center max-w-lg mx-auto leading-relaxed">
            Curated mathematical utilities designed to assist Anna University engineering students in checking academic scores, class requirements, and grade averages.
          </p>
        </div>

        {/* Reusing Tools Section */}
        <div className="border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-2xl overflow-hidden bg-[#F9FAFB]/30 dark:bg-transparent">
          <ToolsSection />
        </div>

      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
export const dynamicParams = true
