import React from "react"
import Link from "next/link"
import { Calculator, BookOpen, CalendarDays, ArrowRight } from "lucide-react"

export function ToolsSection() {
  const tools = [
    {
      id: "cgpa",
      name: "CGPA Calculator",
      description: "Combine multiple semesters grade points to calculate your cumulative CGPA dynamically according to Anna University standards.",
      icon: <Calculator className="h-6 w-6" />,
      href: "/tools/cgpa-calculator",
    },
    {
      id: "gpa",
      name: "GPA Calculator",
      description: "Input individual subject grades (O, A+, A, etc.) and credit weights to calculate your exact current semester GPA instantly.",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/tools/gpa-calculator",
    },
    {
      id: "attendance",
      name: "Attendance Calculator",
      description: "Determine your current attendance percentage, check if you meet the 75% threshold, and calculate skipped/needed classes.",
      icon: <CalendarDays className="h-6 w-6" />,
      href: "/tools/attendance",
    },
  ]

  return (
    <section id="tools-section" className="py-16 md:py-20 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
            Student Toolkit
          </h2>
          <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] mt-3 max-w-2xl mx-auto">
            Handy calculators and utilities designed to help you manage your academic journey at Anna University with ease.
          </p>
        </div>

        {/* New List-based design */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] overflow-hidden shadow-sm">
            <div className="divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
              {tools.map((tool) => (
                <Link
                  id={`tool-link-${tool.id}`}
                  key={tool.id}
                  href={tool.href}
                  className="group block p-6 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg w-fit mt-1 shrink-0">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#111827] dark:text-[#F9FAFB]">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-snug mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200 ml-4 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
