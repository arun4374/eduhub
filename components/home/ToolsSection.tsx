import React from "react"
import Link from "next/link"
import { Calculator, BookOpen, CalendarDays, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

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
    <section id="tools-section" className="py-12 bg-[#F9FAFB] dark:bg-[#121212] transition-colors duration-200 border-t border-[#E5E7EB] dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center md:text-left mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
            Quick Tools
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Handy calculators designed specifically to help Anna University students audit academic progress.
          </p>
        </div>

        {/* 3-card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              id={`tool-card-link-${tool.id}`}
              key={tool.id}
              href={tool.href}
              className="group flex flex-col justify-between p-1 rounded-xl transition-all"
            >
              <Card id={`tool-card-box-${tool.id}`} className="flex-1 flex flex-col justify-between hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-200 h-full p-6">
                <div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg w-fit group-hover:scale-105 transition-transform mb-4">
                    {tool.icon}
                  </div>
                  
                  <h3 className="font-extrabold text-base text-[#111827] dark:text-[#F9FAFB] mb-2 select-text">
                    {tool.name}
                  </h3>
                  
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-4 select-text">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-1.5 transition-all mt-auto pt-2">
                  <span>Open Tool</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
