'use client'

import React from "react"
import { ArrowRight, FileText, Download } from "lucide-react"
import Link from "next/link"
import { MOCK_DOCUMENTS, Document } from "@/data/mock-documents"
import { MOCK_SUBJECTS } from "@/data/mock-subjects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"


export function RecentQPSection() {
  // Extract only question papers and sort them by date
  const allQPs = MOCK_DOCUMENTS
    .filter((doc) => doc.type === "question_paper")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Get the most recent QP for up to 5 unique subjects
  const recentUniqueQPs: Document[] = [];
  const seenSubjectIds = new Set<string>();

  for (const qp of allQPs) {
    if (!seenSubjectIds.has(qp.subjectId)) {
      recentUniqueQPs.push(qp);
      seenSubjectIds.add(qp.subjectId);
    }
    if (recentUniqueQPs.length >= 5) {
      break;
    }
  }

  // Map to find the subject code for each document
  const getSubjectCode = (subjectId: string) => {
    const subject = MOCK_SUBJECTS.find((sub) => sub._id === subjectId)
    return subject ? subject.code : "N/A"
  }

  // Get subject slug for linking
  const getSubjectSlug = (subjectId: string) => {
    const subject = MOCK_SUBJECTS.find((sub) => sub._id === subjectId)
    return subject ? subject.slug : ""
  }

  return (
    <section id="recent-qp-section" className="py-16 md:py-20 bg-[#F9FAFB] dark:bg-[#121212] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Recently Added Question Papers
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              The latest university exam papers, curated for your quick reference.
            </p>
          </div>
          
          <Link
            id="view-all-qps-top-link"
            href="/question-papers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all self-start md:self-auto"
          >
            <span>Browse All Question Papers</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Responsive Table for Desktop, Card Lists for Mobile */}
        <div className="hidden md:block border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          <Table id="recent-qp-table">
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] dark:bg-[#1A1A1A]">
                <TableHead>Subject Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Exam Period</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUniqueQPs.map((qp) => {
                const slug = getSubjectSlug(qp.subjectId)
                return (
                  <TableRow id={`table-row-${qp._id}`} key={qp._id} className="bg-white dark:bg-[#161616] hover:bg-gray-50/50 dark:hover:bg-[#1f1f1f]">
                    <TableCell className="font-semibold text-[#111827] dark:text-[#F9FAFB]">
                      {slug ? (
                        <Link
                          id={`subject-link-${qp._id}`}
                          href={`/subject/${slug}`}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors block"
                        >
                          {qp.subject_name}
                        </Link>
                      ) : (
                        qp.subject_name
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-none">
                        {getSubjectCode(qp.subjectId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{qp.department}</TableCell>
                    <TableCell className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF]">{qp.exam_period}</TableCell>
                    <TableCell className="text-right">
                      <a
                        id={`download-link-desktop-${qp._id}`}
                        href={qp.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button
                          id={`download-btn-desktop-${qp._id}`}
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 h-8 px-3"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View Card Stack */}
        <div className="md:hidden flex flex-col gap-4">
          {recentUniqueQPs.map((qp) => {
            const slug = getSubjectSlug(qp.subjectId)
            return (
              <div
                id={`recent-qp-mobile-card-${qp._id}`}
                key={qp._id}
                className="p-4 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-none">
                      {getSubjectCode(qp.subjectId)}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                      {qp.exam_period}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-sm text-[#111827] dark:text-[#F9FAFB] mt-2 select-text">
                    {slug ? (
                      <Link id={`mobile-subject-link-${qp._id}`} href={`/subject/${slug}`} className="hover:underline hover:text-indigo-600 block">
                        {qp.subject_name}
                      </Link>
                    ) : (
                      qp.subject_name
                    )}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    <span>{qp.department}</span>
                    <span>•</span>
                    <span>Reg {qp.regulation}</span>
                  </div>
                </div>

                <a
                  id={`download-link-mobile-${qp._id}`}
                  href={qp.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full"
                >
                  <Button
                    id={`download-btn-mobile-${qp._id}`}
                    className="w-full text-xs flex items-center justify-center gap-1.5 h-9"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </Button>
                </a>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
