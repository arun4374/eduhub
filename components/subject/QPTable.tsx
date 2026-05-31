'use client'

import React from "react"
import { Download, FileText } from "lucide-react"
import { Document } from "@/data/mock-documents"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface QPTableProps {
  documents: Document[]
}

export function QPTable({ documents }: QPTableProps) {
  // Filter only question papers
  const qps = documents.filter((doc) => doc.type === "question_paper")

  if (qps.length === 0) {
    return (
      <div id="no-qps-box" className="text-center py-12 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] select-none text-xs text-[#6B7280] dark:text-[#9CA3AF] flex flex-col items-center justify-center gap-2">
        <FileText className="h-6 w-6 text-gray-400" />
        <span>Question papers are being compiled. Check back soon for updates!</span>
      </div>
    )
  }

  return (
    <div id="subject-qps-list" className="border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A]">
      <Table id="subject-qp-tbl">
        <TableHeader>
          <TableRow>
            <TableHead>Exam Period</TableHead>
            <TableHead>Regulation</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qps.map((qp) => (
            <TableRow id={`row-qp-${qp._id}`} key={qp._id} className="hover:bg-indigo-50/10 dark:hover:bg-[#1E1E1E]">
              <TableCell className="font-semibold">{qp.exam_period}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs px-2.5 py-0.5 border-indigo-200 text-indigo-700 dark:border-indigo-900/40 dark:text-indigo-300">
                  Reg {qp.regulation}
                </Badge>
              </TableCell>
              <TableCell>Semester {qp.semester}</TableCell>
              <TableCell className="text-right">
                <a
                  id={`subject-download-link-${qp._id}`}
                  href={qp.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button
                    id={`subject-download-btn-${qp._id}`}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
