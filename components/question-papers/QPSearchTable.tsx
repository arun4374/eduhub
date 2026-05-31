'use client'

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Download, Inbox, ChevronLeft, ChevronRight, SlidersHorizontal, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import type { Document } from "@/data/mock-documents"
import { MOCK_SUBJECTS } from "@/data/mock-subjects"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Wrap implementation with a child to handle state after Suspense resolves searchParams
function SearchTableContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  // Core filter states
  const [query, setQuery] = useState(initialSearch)
  const [selectedDept, setSelectedDept] = useState("all")
  const [selectedSem, setSelectedSem] = useState("all")
  const [selectedReg, setSelectedReg] = useState("all")
  
  // Pagination page
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // API Data states
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Update query state if search parameter updates
  useEffect(() => {
    const s = searchParams.get("search")
    if (s !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(s)
      setCurrentPage(1)
    }
  }, [searchParams])

  // Fetch real data from the API route
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/documents')
        const result = await response.json()
        
        if (result.success) {
          setDocuments(result.data)
        } else {
          console.error("Error from API:", result.error)
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDocuments()
  }, [])

  // Reset pagination on filter change
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, val: string) => {
    setter(val)
    setCurrentPage(1)
  }

  // Get subject code helper
  const getSubjectCode = (subjId: string) => {
    const subject = MOCK_SUBJECTS.find((sub) => sub._id === subjId)
    return subject ? subject.code : ""
  }

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#6B7280] dark:text-[#9CA3AF]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Loading...</p>
      </div>
    )
  }

  // Obtain all question papers
  const qps = documents.filter((doc) => doc.type === "question_paper")

  // Apply sequential filtering
  const filteredQPs = qps.filter((qp) => {
    const code = getSubjectCode(qp.subjectId).toLowerCase()
    const name = qp.subject_name.toLowerCase()
    const searchTerms = query.toLowerCase()

    const matchesSearch =
      name.includes(searchTerms) ||
      code.includes(searchTerms) ||
      qp.exam_period.toLowerCase().includes(searchTerms) ||
      qp.regulation.includes(searchTerms)

    const matchesDept =
      selectedDept === "all" || qp.department.toLowerCase() === selectedDept.toLowerCase()

    const matchesSem =
      selectedSem === "all" || qp.semester === selectedSem

    const matchesReg =
      selectedReg === "all" || qp.regulation === selectedReg

    return matchesSearch && matchesDept && matchesSem && matchesReg
  })

  // Pagination bounds
  const totalRows = filteredQPs.length
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedQPs = filteredQPs.slice(startIndex, startIndex + rowsPerPage)

  const handleResetFilters = () => {
    setQuery("")
    setSelectedDept("all")
    setSelectedSem("all")
    setSelectedReg("all")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      
      {/* Search Input Box */}
      <div className="relative w-full shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#6B7280] dark:text-[#9CA3AF]">
          <Search className="h-5 w-5" />
        </div>
        <Input
          id="qp-main-search-input"
          type="text"
          placeholder="Search by subject name or subject code (e.g. CS3401, OS)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="pl-11 h-12 bg-white dark:bg-[#1A1A1A] border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl text-sm"
        />
      </div>

      {/* Selector Dropdown Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
        
        {/* Dept Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dept-filter-select" className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3 text-indigo-500" />
            Department
          </label>
          <Select
            value={selectedDept}
            onValueChange={(val) => handleFilterChange(setSelectedDept, val)}
          >
            <SelectTrigger id="dept-filter-select">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cse">CSE - Computer Science</SelectItem>
              <SelectItem value="ece">ECE - Electronics & Comm</SelectItem>
              <SelectItem value="eee">EEE - Electrical & Elect</SelectItem>
              <SelectItem value="mech">MECH - Mechanical</SelectItem>
              <SelectItem value="civil">CIVIL - Civil Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sem Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sem-filter-select" className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF]">Semester</label>
          <Select
            value={selectedSem}
            onValueChange={(val) => handleFilterChange(setSelectedSem, val)}
          >
            <SelectTrigger id="sem-filter-select">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Regulation Selector */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-filter-select" className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF]">Regulation</label>
          <Select
            value={selectedReg}
            onValueChange={(val) => handleFilterChange(setSelectedReg, val)}
          >
            <SelectTrigger id="reg-filter-select">
              <SelectValue placeholder="All Regulations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regulations</SelectItem>
              <SelectItem value="2021">2021 Regulation</SelectItem>
              <SelectItem value="2019">2019 Regulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Reset (For large screen formatting) */}
        {(query || selectedDept !== "all" || selectedSem !== "all" || selectedReg !== "all") && (
          <div className="sm:col-span-3 lg:col-span-1 pt-5">
            <Button
              id="reset-filters-btn"
              variant="outline"
              onClick={handleResetFilters}
              className="w-full text-xs hover:text-indigo-600 dark:hover:text-indigo-400 h-10 border-[#E5E7EB] dark:border-[#2A2A2A] rounded-lg cursor-pointer"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Metadata Summary */}
      <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] py-2 border-b border-dashed border-[#E5E7EB]/80 dark:border-[#2A2A2A]/80">
        <span>Showing {totalRows} {totalRows === 1 ? "question paper" : "question papers"}</span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Main Results Board */}
      {paginatedQPs.length > 0 ? (
        <div className="border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-sm">
          <div className="w-full relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`page-${currentPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full origin-top"
              >
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table id="query-qp-results-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Dept</TableHead>
                        <TableHead>Sem</TableHead>
                        <TableHead>Exam Period</TableHead>
                        <TableHead>Regulation</TableHead>
                        <TableHead className="text-right">Download</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedQPs.map((qp, idx) => (
                        <TableRow id={`row-qp-item-${qp._id}`} key={qp._id} className="hover:bg-indigo-50/5 dark:hover:bg-[#1E1E1E]">
                          <TableCell className="text-center text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                            {startIndex + idx + 1}
                          </TableCell>
                          <TableCell className="font-bold text-gray-850 dark:text-gray-100">
                            {qp.subject_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-xs text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10">
                              {getSubjectCode(qp.subjectId)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{qp.department}</TableCell>
                          <TableCell>Sem {qp.semester}</TableCell>
                          <TableCell className="font-mono text-xs">{qp.exam_period}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              Reg {qp.regulation}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <a
                              id={`query-download-link-${qp._id}`}
                              href={qp.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex"
                            >
                              <Button
                                id={`query-download-btn-${qp._id}`}
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs flex items-center gap-1 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 shadow-none border-[#E5E7EB] dark:border-[#2A2A2A]"
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

                {/* Mobile Card Deck View */}
                <div className="md:hidden flex flex-col divide-y divide-[#E5E7EB] dark:divide-[#2A2A2A]">
                  {paginatedQPs.map((qp, idx) => (
                    <div
                      id={`query-card-item-${qp._id}`}
                      key={qp._id}
                      className="p-4 flex flex-col justify-between gap-3 bg-white dark:bg-[#1A1A1A]"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                            #{startIndex + idx + 1}
                          </span>
                          <Badge variant="secondary" className="font-mono text-xs text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10 px-2 py-0">
                            {getSubjectCode(qp.subjectId)}
                          </Badge>
                        </div>
                        
                        <h4 className="font-bold text-sm text-[#111827] dark:text-[#F9FAFB] line-clamp-2 select-text">
                          {qp.subject_name}
                        </h4>
                        
                        <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                          <span>{qp.department}</span>
                          <span>•</span>
                          <span>Semester {qp.semester}</span>
                          <span>•</span>
                          <span className="font-mono">{qp.exam_period}</span>
                          <span>•</span>
                          <span>Reg {qp.regulation}</span>
                        </div>
                      </div>

                      <a
                        id={`query-download-link-mob-${qp._id}`}
                        href={qp.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          id={`query-download-btn-mob-${qp._id}`}
                          variant="outline"
                          className="w-full text-xs flex items-center justify-center gap-1.5 h-8.5 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download PDF
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Table bottom pagination row */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E5E7EB] dark:border-[#2A2A2A] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#151515]">
              <Button
                id="pagination-prev-btn"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-xs px-2 cursor-pointer h-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] select-none font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                id="pagination-next-btn"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-xs px-2 cursor-pointer h-8"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Empty results state */
        <div id="empty-search-state" className="text-center py-16 border border-dashed border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F9FAFB] dark:bg-[#1A1A1A] rounded-xl select-none">
          <Inbox className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-base text-[#111827] dark:text-[#F9FAFB] mb-1">
            No question papers found
          </h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find any matches for those filters. Try searching with popular codes or resetting filters.
          </p>
          <Button
            id="empty-reset-btn"
            variant="default"
            size="sm"
            onClick={handleResetFilters}
            className="mt-5 cursor-pointer"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export function QPSearchTable() {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-[#6B7280]">Loading filters and records...</div>}>
      <SearchTableContent />
    </React.Suspense>
  )
}
export default QPSearchTable
