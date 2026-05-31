import React from "react"
import Link from "next/link"
import { FileText, Edit3, BookOpen, GraduationCap } from "lucide-react"
import { Subject } from "@/data/mock-subjects"
import { Badge } from "@/components/ui/badge"

interface SemesterSubjectListProps {
  subjects: Subject[]
}

export function SemesterSubjectList({ subjects }: SemesterSubjectListProps) {
  // Semester order (1 to 8)
  const semesters: ("1" | "2" | "3" | "4" | "5" | "6" | "7" | "8")[] = [
    "1", "2", "3", "4", "5", "6", "7", "8"
  ]

  // Group subjects by semester
  const subjectsBySemester = semesters.reduce((acc, sem) => {
    const semSubjects = subjects.filter((s) => s.semester === sem)
    if (semSubjects.length > 0) {
      acc[sem] = semSubjects
    }
    return acc
  }, {} as Record<string, Subject[]>)

  // If no subjects found across semesters
  if (Object.keys(subjectsBySemester).length === 0) {
    return (
      <div id="no-subjects-view" className="text-center py-16 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A]">
        <GraduationCap className="h-10 w-10 text-[#6B7280] dark:text-[#9CA3AF] mx-auto mb-3" />
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          No subjects listed under this department yet. Our team is updating materials soon!
        </p>
      </div>
    )
  }

  return (
    <div id="semester-subject-list-container" className="space-y-10">
      {semesters.map((sem) => {
        const semSubjects = subjectsBySemester[sem]
        if (!semSubjects) return null

        return (
          <div id={`semester-group-${sem}`} key={sem} className="space-y-4">
            {/* Semester Heading */}
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] dark:border-[#2A2A2A] pb-2">
              <span className="flex items-center justify-center bg-indigo-600 text-white font-bold h-7 w-7 rounded-lg text-xs leading-none">
                {sem}
              </span>
              <h3 className="font-bold text-lg text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                Semester {sem} Subjects
              </h3>
              <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-mono ml-auto">
                ({semSubjects.length} {semSubjects.length === 1 ? "subject" : "subjects"})
              </span>
            </div>

            {/* List of Subjects in current Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {semSubjects.map((subject) => (
                <div
                  id={`subject-item-${subject._id}`}
                  key={subject._id}
                  className="flex flex-col justify-between p-5 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors shadow-sm"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2.5 mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40 px-2 py-0.5 rounded font-mono">
                        {subject.code}
                      </span>
                      <Badge variant="outline" className="text-[10px] py-0">
                        Reg {subject.regulation}
                      </Badge>
                    </div>

                    <Link
                      id={`subject-heading-link-${subject.slug}`}
                      href={`/subject/${subject.slug}`}
                      className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] hover:text-indigo-600 dark:hover:text-indigo-450 block hover:underline select-text leading-tight"
                    >
                      {subject.name}
                    </Link>
                    
                    <p className="mt-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed line-clamp-2 select-text">
                      {subject.description}
                    </p>
                  </div>

                  {/* 3 Quick Link buttons */}
                  <div className="grid grid-cols-3 gap-2 border-t border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] pt-3.5 mt-2">
                    <Link
                      id={`subject-qp-anchor-${subject.slug}`}
                      href={`/subject/${subject.slug}#qp`}
                      className="inline-flex py-1.5 px-2 bg-[#F9FAFB] dark:bg-[#151515] hover:bg-slate-100 dark:hover:bg-[#1E1E1E] text-[#111827] dark:text-[#F9FAFB] text-xs font-semibold rounded-lg justify-center items-center gap-1.5 transition-colors border border-[#E5E7EB] dark:border-[#2A2A2A]/50"
                    >
                      <FileText className="h-3.5 w-3.5 text-indigo-500" />
                      <span>QP</span>
                    </Link>

                    <Link
                      id={`subject-notes-anchor-${subject.slug}`}
                      href={`/subject/${subject.slug}#notes`}
                      className="inline-flex py-1.5 px-2 bg-[#F9FAFB] dark:bg-[#151515] hover:bg-slate-100 dark:hover:bg-[#1E1E1E] text-[#111827] dark:text-[#F9FAFB] text-xs font-semibold rounded-lg justify-center items-center gap-1.5 transition-colors border border-[#E5E7EB] dark:border-[#2A2A2A]/50"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Notes</span>
                    </Link>

                    <Link
                      id={`subject-syllabus-anchor-${subject.slug}`}
                      href={`/subject/${subject.slug}#syllabus`}
                      className="inline-flex py-1.5 px-2 bg-[#F9FAFB] dark:bg-[#151515] hover:bg-slate-100 dark:hover:bg-[#1E1E1E] text-[#111827] dark:text-[#F9FAFB] text-xs font-semibold rounded-lg justify-center items-center gap-1.5 transition-colors border border-[#E5E7EB] dark:border-[#2A2A2A]/50"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      <span>Syllabus</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
