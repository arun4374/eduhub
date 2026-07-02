"use client"

import { Inbox, Download } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import type { Document } from "@/data/mock-documents"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

export function QPResultsTable({
  documents,
  hasQuery,
  currentPage,
}: {
  documents: (Document & { code?: string })[]
  hasQuery: boolean
  currentPage: number
}) {
  if (documents.length === 0) {
    return (
      <div id="empty-search-state" className="text-center py-16 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F9FAFB] dark:bg-[#1A1A1A] rounded-xl select-none">
        <Inbox className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h3 className="font-bold text-base text-[#111827] dark:text-[#F9FAFB] mb-1">No question papers found</h3>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
          {hasQuery
            ? "We couldn't find any matches for that search. Try a different subject code or name."
            : "No question papers are available yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table id="query-qp-results-table">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-white/5">
              <TableHead>Exam Period</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.tbody
              key={`page-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {documents.map((qp) => (
                <TableRow id={`row-qp-item-${qp._id}`} key={qp._id} className="hover:bg-indigo-50/5 dark:hover:bg-[#1E1E1E]">
                  <TableCell className="font-mono text-xs">{qp.exam_period}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10">
                      {qp.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-gray-850 dark:text-gray-100">{qp.subject_name}</TableCell>
                  <TableCell className="text-right">
                    <a id={`query-download-link-${qp._id}`} href={qp.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex">
                      <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 shadow-none border-[#E5E7EB] dark:border-[#2A2A2A]">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </Table>
      </div>

      {/* Mobile Card Deck View */}
      <div className="md:hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`page-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full origin-top flex flex-col divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]"
          >
            {documents.map((qp) => (
              <div id={`query-card-item-${qp._id}`} key={qp._id} className="p-4 flex flex-col justify-between gap-4 bg-white dark:bg-[#1A1A1A]">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <Badge variant="secondary" className="font-mono text-xs text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10 px-2 py-0.5">
                      {qp.code}
                    </Badge>
                    <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF] text-right">{qp.exam_period}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB] line-clamp-2 select-text">{qp.subject_name}</h4>
                </div>
                <a id={`query-download-link-mob-${qp._id}`} href={qp.file_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button variant="outline" className="w-full text-xs flex items-center justify-center gap-1.5 h-9 cursor-pointer">
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </Button>
                </a>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}