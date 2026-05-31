'use client'

import React from "react"
import Markdown from "react-markdown"
import { BookOpen } from "lucide-react"

interface SyllabusSectionProps {
  syllabusMarkdown?: string
}

export function SyllabusSection({ syllabusMarkdown }: SyllabusSectionProps) {
  if (!syllabusMarkdown || !syllabusMarkdown.trim()) {
    return (
      <div id="no-syllabus-box" className="text-center py-12 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] select-none text-xs text-[#6B7280] dark:text-[#9CA3AF] flex flex-col items-center justify-center gap-2">
        <BookOpen className="h-6 w-6 text-gray-400" />
        <span>Syllabus coming soon. Check back shortly for unit descriptions.</span>
      </div>
    )
  }

  return (
    <div id="subject-syllabus-display" className="p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] transition-colors duration-200">
      <div className="flex items-center gap-2.5 mb-6 border-b border-[#E5E7EB] dark:border-[#2A2A2A] pb-3">
        <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
          <BookOpen className="h-5 w-5" />
        </span>
        <h3 className="font-bold text-base text-[#111827] dark:text-[#F9FAFB] tracking-tight">
          Syllabus Unit-Wise Breakdown
        </h3>
      </div>

      {/* Styled React Markdown View wrapper */}
      <div className="markdown-body select-text prose prose-indigo max-w-none dark:prose-invert text-sm text-[#6B7280] dark:text-[#9CA3AF] space-y-4 leading-relaxed">
        <Markdown
          components={{
            h2: ({ ...props }) => (
              <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-6 mb-2 select-text" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mt-4 mb-2 select-text" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 space-y-1 mb-4 select-text text-sm" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="text-justify select-text leading-relaxed" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-justify mb-3 select-text leading-relaxed" {...props} />
            ),
          }}
        >
          {syllabusMarkdown}
        </Markdown>
      </div>
    </div>
  )
}
