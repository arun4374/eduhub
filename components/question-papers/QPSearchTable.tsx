'use client'

import React, { useState, useEffect, useRef, useTransition } from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Search, Download, Inbox, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// TODO: replace with your real Document type (from @/lib/documents or @/models/Document)
// The mock type was fine for prototyping but shouldn't ship in the live search table.
import type { Document } from "@/data/mock-documents"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alertcard, type AlertType } from "@/components/ui/Alertcard"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

type QPDocument = Document & { code?: string; slug?: string }

type QPSearchTableProps = {
  initialQuery?: string
  initialPage?: number
  initialDocuments?: QPDocument[]
  initialPagination?: { currentPage?: number; totalPages: number; totalDocuments: number }
}

const DEBOUNCE_MS = 400

// Wrap implementation with a child to handle state after Suspense resolves searchParams
function SearchTableContent({
  initialQuery = "",
  initialPage = 1,
  initialDocuments = [],
  initialPagination = { totalPages: 1, totalDocuments: 0 },
}: QPSearchTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const urlSearch = searchParams.get("search") || ""
  const urlPage = parseInt(searchParams.get("page") || "1", 10)

  // `inputValue` is what the text box shows — updates instantly on every
  // keystroke so typing feels responsive.
  const [inputValue, setInputValue] = useState(initialQuery)
  // `query` is the debounced value that actually drives the URL + fetch.
  const [query, setQuery] = useState(initialQuery)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isPending, startTransition] = useTransition()
  const rowsPerPage = 5

  const [documents, setDocuments] = useState<QPDocument[]>(initialDocuments)
  const [pagination, setPagination] = useState(initialPagination)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null)

  // Skip the very first client-side fetch when the server already fetched
  // matching data for the current URL (the common case: first page load).
  const hasHydratedFromServer = useRef(
    initialQuery === urlSearch && initialPage === urlPage && initialDocuments.length >= 0
  )

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync local state when the URL changes from outside this component
  // (back/forward navigation, pagination buttons, reset button).
  useEffect(() => {
    setInputValue(urlSearch)
    setQuery(urlSearch)
    setCurrentPage(urlPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlPage])

  // Fetch whenever the debounced query or page changes.
  useEffect(() => {
    if (hasHydratedFromServer.current) {
      hasHydratedFromServer.current = false
      return
    }

    const fetchDocuments = async () => {
      setIsLoading(true)
      const params = new URLSearchParams({
        search: query,
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
      })

      try {
        const response = await fetch(`/api/documents?${params.toString()}`)
        const result = await response.json()

        if (result.success) {
          setDocuments(result.data.documents)
          setPagination(result.data.pagination)
        } else {
          console.error("Error from API:", result.error)
          setDocuments([])
          setPagination({ totalPages: 1, totalDocuments: 0 })
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [query, currentPage])

  const QPSkeleton = () => (
    <>
      <div className="flex items-center justify-between py-2 border-b border-dashed border-[#E5E7EB]/80 dark:border-[#2A2A2A]/80 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="hidden md:block border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-white/5">
              <TableHead>Exam Period</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></TableCell>
                <TableCell><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div></TableCell>
                <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></TableCell>
                <TableCell className="text-right"><div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden flex flex-col gap-4">
        {Array.from({ length: rowsPerPage }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] animate-pulse">
            <div className="flex justify-between items-center gap-2 mb-2">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    </>
  )

  const paginatedQPs = documents
  const totalRows = pagination.totalDocuments
  const totalPages = pagination.totalPages

  const updateUrlParams = (newQuery: string, newPage: number, options?: { scroll?: boolean }) => {
    const params = new URLSearchParams(searchParams)
    params.set("search", newQuery)
    params.set("page", String(newPage))
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, options)
    })
  }

  // Text box updates instantly; the URL/fetch only fire DEBOUNCE_MS after
  // the user stops typing.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQuery(value)
      setCurrentPage(1)
      updateUrlParams(value, 1)
    }, DEBOUNCE_MS)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleResetFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setInputValue("")
    setQuery("")
    setCurrentPage(1)
    updateUrlParams("", 1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    updateUrlParams(query, newPage, { scroll: false })
  }

  const handleCopyCode = (code: string) => {
    if (!code || !navigator.clipboard) return
    navigator.clipboard.writeText(code).then(
      () => {
        setAlert({ type: "success", message: `Copied "${code}" to clipboard` })
      },
      (err) => {
        console.error("Failed to copy text: ", err)
        setAlert({ type: "error", message: "Failed to copy to clipboard" })
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#6B7280] dark:text-[#9CA3AF]">
          <Search className="h-5 w-5" />
        </div>
        <Input
          id="qp-main-search-input"
          type="text"
          placeholder="Search by subject name or subject code (e.g. CS3401, OS)..."
          value={inputValue}
          onChange={handleSearchChange}
          className="pl-11 h-12 bg-white dark:bg-[#1A1A1A] border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl text-sm"
        />
      </div>

      {isLoading || isPending ? <QPSkeleton /> : (
        <>
          <div className="flex items-center justify-between text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] py-2 border-b border-dashed border-[#E5E7EB]/80 dark:border-[#2A2A2A]/80">
            <span>{totalRows} {totalRows === 1 ? "Result" : "Results"}</span>
          </div>

          {paginatedQPs.length > 0 ? (
            <div className="border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A] shadow-sm">
              <div className="hidden md:block">
                <Table id="query-qp-results-table">
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-white/5">
                      <TableHead className="text-sm font-medium">Exam Period</TableHead>
                      <TableHead className="text-sm font-medium">Code</TableHead>
                      <TableHead className="text-sm font-medium">Subject Name</TableHead>
                      <TableHead className="text-right text-sm font-medium">Download</TableHead>
                    </TableRow>
                  </TableHeader>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.tbody
                      key={`page-${currentPage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      {paginatedQPs.map((qp) => (
                        <TableRow id={`row-qp-item-${qp._id}`} key={qp._id} className="hover:bg-indigo-50/5 dark:hover:bg-[#1E1E1E]">
                          <TableCell className="font-mono text-sm">{qp.exam_period}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="font-mono text-sm text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                              onClick={() => handleCopyCode(qp.code || "")}
                              title={`Copy "${qp.code}"`}
                            >
                              {qp.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-sm text-gray-850 dark:text-gray-100">
                            {qp.slug ? (
                              <Link
                                href={`/question-papers/${qp.slug}`}
                                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                              >
                                {qp.subject_name}
                              </Link>
                            ) : (
                              qp.subject_name
                            )}
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
                                className="h-9 px-3 text-sm flex items-center gap-1.5 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 shadow-none border-[#E5E7EB] dark:border-[#2A2A2A]"
                              >
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
                    {paginatedQPs.map((qp) => (
                      <div
                        id={`query-card-item-${qp._id}`}
                        key={qp._id}
                        className="p-4 flex flex-col justify-between gap-4 bg-white dark:bg-[#1A1A1A]"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <Badge
                              variant="secondary"
                              className="font-mono text-sm text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10 px-2 py-0.5 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                              onClick={() => handleCopyCode(qp.code || "")}
                              title={`Copy "${qp.code}"`}
                            >
                              {qp.code}
                            </Badge>
                            <span className="text-sm font-mono text-[#6B7280] dark:text-[#9CA3AF] text-right">
                              {qp.exam_period}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-[#111827] dark:text-[#F9FAFB] line-clamp-2">
                            {qp.slug ? (
                              <Link
                                href={`/question-papers/${qp.slug}`}
                                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                              >
                                {qp.subject_name}
                              </Link>
                            ) : (
                              qp.subject_name
                            )}
                          </h4>
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
                            className="w-full text-sm flex items-center justify-center gap-1.5 h-10 cursor-pointer"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download PDF
                          </Button>
                        </a>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="p-4 border-t border-[#E5E7EB] dark:border-[#2A2A2A] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#151515]">
                  <span className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] select-none font-mono">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      id="pagination-prev-btn"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading || isPending}
                      className="flex items-center gap-1.5 text-sm px-3 cursor-pointer h-9"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      id="pagination-next-btn"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading || isPending}
                      className="flex items-center gap-1.5 text-sm px-3 cursor-pointer h-9"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}

      <Alertcard
        open={!!alert}
        type={alert?.type ?? "info"}
        message={alert?.message ?? ""}
        onClose={() => setAlert(null)}
      />
    </div>
  )
}

export function QPSearchTable(props: QPSearchTableProps) {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-[#6B7280]">Loading filters and records...</div>}>
      <SearchTableContent {...props} />
    </React.Suspense>
  )
}
export default QPSearchTable