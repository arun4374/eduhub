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
                <Link
                  id={`subject-item-${subject._id}`}
                  key={subject._id}
                  href={`/subject/${subject.slug}`}
                  className="group block p-4 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-2.5 mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      {subject.code}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0">
                      Reg {subject.regulation}
                    </Badge>
                  </div>

                  <h4 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {subject.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
