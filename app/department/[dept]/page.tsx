import React from "react"
import { notFound } from "next/navigation"
import { DEPARTMENTS } from "@/config/departments"
import { BannerHeader } from "@/components/shared/BannerHeader"
import { getSubjectsByDepartment, getAvailableRegulations } from "@/lib/subjects"
import { SemesterSubjectList } from "@/components/department/SemesterSubjectList"
import { TagsSection } from "@/components/shared/TagsSection"
import { CommentSection } from "@/components/shared/CommentSection"
import { GraduationCap } from "lucide-react"
import { RegulationSelector } from "@/components/department/RegulationSelector"

interface PageProps {
  params: Promise<{ dept: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate dynamic metadata for SEO compliance:
export async function generateMetadata({ params }: PageProps) {
  const { dept } = await params
  const department = DEPARTMENTS.find((d) => d.slug === dept.toLowerCase())
  if (!department) {
    return {
      title: "Department Not Found",
    }
  }

  return {
    title: `${department.fullName} (${department.shortName}) Study Materials — Arivon`,
    description: `Download Anna University lecture notes, curriculum guides, and previous exam question papers for ${department.fullName} (Regulation 2021).`,
  }
}

export default async function DepartmentPage({ params, searchParams }: PageProps) {
  const { dept } = await params
  const resolvedSearchParams = await searchParams
  const matchedSlug = dept.toLowerCase()

  // Look up department details
  const department = DEPARTMENTS.find((d) => d.slug === matchedSlug)
  if (!department) {
    return notFound()
  }

  // Fetch available regulations and determine the current one
  const availableRegulations = await getAvailableRegulations(department.shortName);
  const currentRegulation =
    typeof resolvedSearchParams.regulation === 'string' && availableRegulations.includes(resolvedSearchParams.regulation)
      ? resolvedSearchParams.regulation
      // Default to '2021' if available, otherwise the latest regulation, with a final fallback to '2021'.
      : availableRegulations.includes("2021") ? "2021" : availableRegulations[0] || "2021";

  // Fetch subjects for this department and the selected regulation
  const deptSubjects = await getSubjectsByDepartment(department.shortName, currentRegulation)

  // Calculations: views sum and latest updated date
  const totalViews = deptSubjects.reduce((sum, s) => sum + s.views, 0)
  
  let latestUpdate = "March 2025"
  if (deptSubjects.length > 0) {
    const sortedDates = deptSubjects
      .map((s) => new Date(s.updatedAt))
      .sort((a, b) => b.getTime() - a.getTime())
    const latestDate = sortedDates[0]
    latestUpdate = latestDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  // Collect unique related tags across all subjects in this departments
  const uniqueTags = Array.from(
    new Set(deptSubjects.flatMap((sub) => sub.tags))
  ).slice(0, 15) 

  return (
    <div id={`department-page-${matchedSlug}`} className="bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      
      {/* Dynamic Jumbotron Header */}
      <BannerHeader
        title={`${department.fullName} (${department.shortName}) Syllabus, Notes & Solved Papers`}
        backgroundImage={department.bannerImage}
        adminName="Arivon Team"
        lastUpdated={latestUpdate}
        totalViews={totalViews}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Semester Curriculum Breakdown */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                <h2 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Curriculum Resources
                </h2>
              </div>
              <RegulationSelector regulations={availableRegulations} currentRegulation={currentRegulation} />
            </div>
            
            <SemesterSubjectList subjects={deptSubjects} />
          </div>

          {/* Right Sidebar - Tags and Feedback comments system */}
          <div className="lg:col-span-1 space-y-6">
            <TagsSection tags={uniqueTags} />
            <CommentSection pageType="department" pageId={matchedSlug} />
          </div>

        </div>
      </div>
    </div>
  )
}