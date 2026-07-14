'use client'

import React from "react"
import Link from "next/link"
import { DEPARTMENTS } from "@/config/departments"
import { ChevronRight, Laptop, Cpu, Zap, Settings, Building, type LucideProps } from "lucide-react"

// Map icon names from the config to actual React components.
// This keeps the config serializable and avoids errors in Server Components.
const iconMap: Record<typeof DEPARTMENTS[number]['iconName'], React.ComponentType<LucideProps>> = {
  Laptop,
  Cpu,
  Zap,
  Settings,
  Building,
};

export function DepartmentGrid() {

  return (
    <section id="departments-section" className="py-16 md:py-20 bg-[#F9FAFB] dark:bg-[#121212] transition-colors duration-200 border-y border-[#E5E7EB] dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center md:text-left mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
             Browse by Department
          </h2>
          <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] mt-2 max-w-2xl">
            Find curated notes, question papers, and syllabus details organized for your engineering branch.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {DEPARTMENTS.map((dept) => {
            const IconComponent = iconMap[dept.iconName];
            return (
              <Link
                id={`department-card-${dept.slug}`}
                key={dept.slug}
                href={`/department/${dept.slug}`}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] shadow-sm hover:shadow-lg dark:shadow-none dark:ring-1 dark:ring-white/10 hover:ring-indigo-500 dark:hover:ring-indigo-400 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative background icon */}
                <div className="absolute z-0 -top-4 -right-4 text-gray-100 dark:text-white/5 transition-transform duration-500 ease-out group-hover:scale-125 group-hover:-rotate-12">
                  <div className="h-28 w-28">
                    {IconComponent && <IconComponent className="h-full w-full" />}
                  </div>
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Branch Icon badge */}
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg w-fit transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60">
                    {IconComponent && <IconComponent className="h-6 w-6" />}
                  </div>
                  
                  {/* Branch details */}
                  <h3 className="font-extrabold text-lg text-[#111827] dark:text-[#F9FAFB] mt-4">
                    {dept.shortName}
                  </h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-snug mt-1">
                    {dept.fullName}
                  </p>
                </div>

                {/* "View" link at the bottom */}
                <div className="relative z-10 mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-1.5 transition-all">
                  <span>View Resources</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
