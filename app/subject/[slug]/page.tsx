import React from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, FileText, Edit3, MessageCircle, Info } from "lucide-react"
import { BannerHeader } from "@/components/shared/BannerHeader"
import { findSubjectBySlug, getDocumentsForSubject } from "@/lib/subjects"
import type { Document } from "@/data/mock-documents"
import { QPTable } from "@/components/subject/QPTable"
import { NotesList } from "@/components/subject/NotesList"
import { SyllabusSection } from "@/components/subject/SyllabusSection"
import { TagsSection } from "@/components/shared/TagsSection"
import { CommentSection } from "@/components/shared/CommentSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PageProps {
  // The `params` prop is typed as a Promise to maintain consistency with other pages in the project,
  // even though Next.js typically passes it as a plain object.
  params: Promise<{ slug: string }>
}

// Generate dynamic metadata for SEO compliance
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const subject = await findSubjectBySlug(slug.toLowerCase())
  if (!subject) {
    return {
      title: "Subject Not Found — Arivon",
    }
  }

  return {
    title: `${subject.name} (${subject.code}) Study Materials — Arivon`,
    description: subject.metaDescription,
    keywords: subject.keywords.join(", "),
  }
}

export default async function SubjectPage({ params }: PageProps) {
  const { slug } = await params
  const subject = await findSubjectBySlug(slug.toLowerCase())
  
  // Custom fallback page if subject slug is not located in dummy archives
  if (!subject) {
    return (
      <div id="subject-not-found-container" className="max-w-xl mx-auto px-4 py-20 text-center select-none">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full w-fit mx-auto mb-6">
          <BookOpen className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight mb-2">
          Subject Material Not Found
        </h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed mb-8">
          The requested syllabus details or question paper archives for &quot;{slug}&quot; are missing or still being compiled by our academic authors.
        </p>
        <Link id="not-found-back-btn" href="/">
          <Button className="font-semibold flex items-center gap-1.5 mx-auto cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Go Back to Homepage
          </Button>
        </Link>
      </div>
    )
  }

  // Fetch corresponding files (notes, question papers, etc.)
  const documents = await getDocumentsForSubject(subject._id)

  // Formatting date stamp
  const formattedDate = new Date(subject.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div id={`subject-page-${subject.code.toLowerCase()}`} className="bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      
      {/* Upper Jumbotron Title Node */}
      <BannerHeader
        title={subject.pageTitle}
        adminName="Arivon Team"
        lastUpdated={formattedDate}
        totalViews={subject.views}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb back Node */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            id="back-to-department-breadcrumb"
            href={`/department/${subject.department.toLowerCase()}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline hover:gap-1.5 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {subject.department} Department</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[11px] font-mono px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
              {subject.code}
            </Badge>
            <Badge variant="outline" className="text-[11px] px-2.5 py-0.5">
              Reg {subject.regulation}
            </Badge>
          </div>
        </div>


        {/* Triple grid splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main materials list */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section A: Question Papers */}
            <div id="qp" className="scroll-mt-36 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                  University Question Papers
                </h2>
              </div>
              <QPTable documents={documents as Document[]} />
            </div>

            {/* Section B: Notes */}
            <div id="notes" className="scroll-mt-36 space-y-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                  Lecture Revision Notes
                </h2>
              </div>
              <NotesList documents={documents as Document[]} />
            </div>

            {/* Section C: Syllabus */}
            <div id="syllabus" className="scroll-mt-36">
              <SyllabusSection syllabusMarkdown={subject.syllabus_markdown} />
            </div>

            {/* Direct Description footnote */}
            <div id="subject-description-box" className="p-5 rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] bg-slate-50/50 dark:bg-[#151515]/30 flex gap-3 text-justify items-start">
              <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] uppercase tracking-wider mb-1">
                  Revision Brief
                </h4>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed select-text">
                  {subject.description}
                </p>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TagsSection tags={subject.tags} />
            <CommentSection pageType="subject" pageId={subject._id} />
          </div>

        </div>
      </div>
    </div>
  )
}
