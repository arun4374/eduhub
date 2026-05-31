import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import { DEPARTMENTS } from "@/config/departments"
import { MOCK_SUBJECTS } from "@/data/mock-subjects"
import { Laptop, Cpu, Zap, Settings, Building, ChevronRight, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: 'Engineering Departments — EduHub Anna University',
  description: 'Choose your engineering discipline to view syllabus, lecture notes, textbook solutions and semester question papers for CSE, ECE, EEE, MECH and CIVIL branches.',
}

export default function DepartmentsPage() {
  // Map icons
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

  // Count subjects per department to make directory look extremely realistic
  const getSubjectCount = (shortName: string) => {
    return MOCK_SUBJECTS.filter((s) => s.department === shortName).length
  }

  return (
    <div id="departments-directory-page" className="py-12 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header title */}
        <div className="text-center max-w-2xl mx-auto mb-12 select-text">
          <h1 className="text-3xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
            Engineering Branches Directory
          </h1>
          <p className="mt-3 text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
            Select your curriculum department below to browse hand-picked study guides, units lecture notes, and last semester university question papers.
          </p>
        </div>

        {/* Dynamic branches grid */}
        <div id="dept-directory-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept) => {
            const subjectCount = getSubjectCount(dept.shortName)
            return (
              <div
                id={`directory-card-${dept.slug}`}
                key={dept.slug}
                className="group flex flex-col justify-between p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F9FAFB] dark:bg-[#1A1A1A] hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Icon Node wrapper */}
                  <div className="p-3.5 bg-white dark:bg-[#151515] border border-[#E5E7EB]/55 dark:border-[#2A2A2A] text-indigo-600 dark:text-indigo-400 rounded-xl width-fit w-fit group-hover:scale-105 transition-transform mb-5">
                    {getIcon(dept.shortName)}
                  </div>
                  
                  {/* Headers */}
                  <h2 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-1">
                    {dept.fullName} ({dept.shortName})
                  </h2>
                  
                  {/* Counts tag */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full mb-4">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {subjectCount} {subjectCount === 1 ? "Subject" : "Subjects"} Available
                  </span>

                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed select-text mt-1 text-justify">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] pt-4">
                  <Link
                    id={`directory-link-btn-${dept.slug}`}
                    href={`/department/${dept.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all cursor-pointer"
                  >
                    <span>Browse Branch Materials</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
