"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import type { Document as QPDocument } from "@/lib/documents"
import type { Subject } from "@/lib/subjects"

// This is a minimal type definition based on usage.
// Ideally, this would be imported from a shared types file.
interface Department {
  slug: string
  fullName: string
  shortName: string
}

// Helper component for styling sections
const SitemapSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      {title}
    </h2>
    <ul className="space-y-2 list-inside">{children}</ul>
  </section>
)

// Helper component for list items
const SitemapLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li className="flex items-start">
    <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0 mt-0.5" />
    <Link href={href} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
      {children}
    </Link>
  </li>
)

interface SitemapClientProps {
  staticPages: { name: string; href: string }[]
  departments: Department[]
  subjects: Subject[]
  questionPapers: QPDocument[]
}

export function SitemapClient({ staticPages, departments, subjects, questionPapers }: SitemapClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const lowercasedTerm = searchTerm.toLowerCase().trim()

  const filteredStaticPages = useMemo(() => {
    if (!lowercasedTerm) return staticPages
    return staticPages.filter(page => page.name.toLowerCase().includes(lowercasedTerm))
  }, [lowercasedTerm, staticPages])

  const filteredDepartments = useMemo(() => {
    if (!lowercasedTerm) return departments
    return departments.filter(dept => dept.fullName.toLowerCase().includes(lowercasedTerm) || dept.shortName.toLowerCase().includes(lowercasedTerm))
  }, [lowercasedTerm, departments])

  const filteredSubjects = useMemo(() => {
    if (!lowercasedTerm) return subjects
    return subjects.filter(subject => subject.name.toLowerCase().includes(lowercasedTerm) || subject.code.toLowerCase().includes(lowercasedTerm))
  }, [lowercasedTerm, subjects])

  const filteredQuestionPapers = useMemo(() => {
    if (!lowercasedTerm) return questionPapers
    return questionPapers.filter(doc => doc.subject_name.toLowerCase().includes(lowercasedTerm) || (doc.code || "").toLowerCase().includes(lowercasedTerm) || doc.exam_period.toLowerCase().includes(lowercasedTerm))
  }, [lowercasedTerm, questionPapers])

  const noResults = filteredStaticPages.length === 0 && filteredDepartments.length === 0 && filteredSubjects.length === 0 && filteredQuestionPapers.length === 0

  return (
    <div className="space-y-12">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search sitemap (e.g., 'CSE', 'CS3491', 'Privacy')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
        />
      </div>

      {filteredStaticPages.length > 0 && <SitemapSection title="Main Pages">{filteredStaticPages.map(page => <SitemapLink key={page.href} href={page.href}>{page.name}</SitemapLink>)}</SitemapSection>}
      {filteredDepartments.length > 0 && <SitemapSection title="Departments">{filteredDepartments.map(dept => <SitemapLink key={dept.slug} href={`/department/${dept.slug}`}>{dept.fullName}</SitemapLink>)}</SitemapSection>}
      {filteredSubjects.length > 0 && <SitemapSection title="Subjects & Syllabus">{filteredSubjects.filter(s => s.slug).map(s => <SitemapLink key={s._id} href={`/subject/${s.slug}`}>{s.name} ({s.code})</SitemapLink>)}</SitemapSection>}
      {filteredQuestionPapers.length > 0 && <SitemapSection title="Question Papers">{filteredQuestionPapers.filter(d => d.type === 'question_paper' && (d as any).slug).map(d => <SitemapLink key={d._id} href={`/question-papers/${(d as any).slug}`}>{d.subject_name} ({d.code}) - {d.exam_period}</SitemapLink>)}</SitemapSection>}

      {noResults && (
        <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
          <p className="text-lg font-medium text-gray-900 dark:text-white">No results found</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search term.
          </p>
        </div>
      )}
    </div>
  )
}