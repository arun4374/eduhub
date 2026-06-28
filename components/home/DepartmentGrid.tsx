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
        return <Laptop className="h-7 w-7" />
      case "ECE":
        return <Cpu className="h-7 w-7" />
      case "EEE":
        return <Zap className="h-7 w-7" />
      case "MECH":
        return <Settings className="h-7 w-7" />
      case "CIVIL":
        return <Building className="h-7 w-7" />
      default:
        return <Laptop className="h-7 w-7" />
    }
  }
  

  return (
    <section id="departments-section" className="py-16 md:py-20 bg-[#F9FAFB] dark:bg-[#121212] transition-colors duration-200 border-y border-[#E5E7EB] dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center md:text-left mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
            Browse by Department
          </h2>
          <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] mt-2">
            Access curated lecture syllabus checklist, textbooks notes and solved papers per branch.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {DEPARTMENTS.map((dept) => (
            <Link
              id={`department-card-${dept.slug}`}
              key={dept.slug}
              href={`/department/${dept.slug}`}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200"
            >
              <div>
                {/* Branch Icon badge */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-105 transition-transform">
                  {getIcon(dept.shortName)}
                </div>
                
                {/* Branch details */}
                <h3 className="font-extrabold text-lg text-[#111827] dark:text-[#F9FAFB] mt-5 mb-1">
                  {dept.shortName}
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed">
                  {dept.fullName}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-1.5 transition-all">
                <span>View Resources</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
