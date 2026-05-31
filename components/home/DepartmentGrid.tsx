'use client'

import React from "react"
import Link from "next/link"
import { DEPARTMENTS } from "@/config/departments"
import { Laptop, Cpu, Zap, Settings, Building, ChevronRight } from "lucide-react"

export function DepartmentGrid() {
  // Mapping shortNames to elegant icons
  const getIcon = (shortName: string) => {
    switch (shortName) {
      case "CSE":
        return <Laptop className="h-6 w-6" />
      case "ECE":
        return <Cpu className="h-6 w-6" />
      case "EEE":
        return <Zap className="h-6 w-6" />
      case "MECH":
        return <Settings className="h-6 w-6" />
      case "CIVIL":
        return <Building className="h-6 w-6" />
      default:
        return <Laptop className="h-6 w-6" />
    }
  }

  return (
    <section id="departments-section" className="py-12 bg-[#F9FAFB] dark:bg-[#121212] transition-colors duration-200 border-y border-[#E5E7EB] dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center md:text-left mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
            Browse by Department
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Access curated lecture syllabus checklist, textbooks notes and solved papers per branch.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DEPARTMENTS.map((dept) => (
            <Link
              id={`department-card-${dept.slug}`}
              key={dept.slug}
              href={`/department/${dept.slug}`}
              className="group flex flex-col justify-between p-5 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Branch Icon badge */}
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg w-fit group-hover:scale-105 transition-transform">
                  {getIcon(dept.shortName)}
                </div>
                
                {/* Branch details */}
                <h3 className="font-extrabold text-base text-[#111827] dark:text-[#F9FAFB] mt-4 mb-1">
                  {dept.shortName}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed">
                  {dept.fullName}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-1.5 transition-all">
                <span>View Resources</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
