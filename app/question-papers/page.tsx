// app/question-papers/page.tsx
import { Suspense } from "react"
import { getQuestionPapers, isSafeFileUrl } from "@/lib/documents"
import { QPSearchInput } from "@/components/question-papers/qp-search-input"
import { QPResultsTable } from "@/components/question-papers/qp-results-table"
import { QPPagination } from "@/components/question-papers/qp-pagination"
import type { Metadata } from "next"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

const ROWS_PER_PAGE = 5

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const search = params.search

  if (search) {
    return {
      title: `${search} Question Paper - Anna University | Arivon`,
      description: `Download ${search} previous year question papers, exam papers for Anna University Regulation 2021 students. Free PDF download.`,
      alternates: { canonical: `https://eduhub-tau-rosy.vercel.app/question-papers?search=${encodeURIComponent(search)}` },
    }
  }

  return {
    title: "Anna University Question Papers - All Departments | Arivon",
    description: "Download Anna University previous year question papers for CSE, ECE, EEE, Mech, Civil and more. Semester-wise, subject-wise, all regulations. Free PDF download.",
    keywords: [
      "anna university question papers",
      "anna university previous year question papers",
      "anna university PYQ",
      "AU question bank",
      "regulation 2021 question papers",
      "CSE question papers anna university",
    ],
    alternates: { canonical: "https://eduhub-tau-rosy.vercel.app/question-papers" },
    openGraph: {
      title: "Anna University Question Papers - Arivon",
      description: "Free download of previous year Anna University question papers, all departments and semesters.",
      url: "https://eduhub-tau-rosy.vercel.app/question-papers",
      type: "website",
    },
  }
}

function QPSkeleton() {
  return (
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
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="animate-pulse">
              <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" /></TableCell>
              <TableCell><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" /></TableCell>
              <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></TableCell>
              <TableCell className="text-right"><div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

async function QPResults({
  search,
  page,
}: {
  search: string
  page: number
}) {
  let allDocs
  try {
    allDocs = await getQuestionPapers()
  } catch (err) {
    console.error("QP fetch failed:", err)
    return (
      <div className="text-center py-16 border border-dashed border-red-300 bg-red-50 dark:bg-red-950/10 rounded-xl">
        <p className="text-sm text-red-600 dark:text-red-400">
          Couldn&apos;t load question papers right now. Please try again in a moment.
        </p>
      </div>
    )
  }

  const qps = allDocs.filter((doc) => doc.type === "question_paper")

  const term = search.toLowerCase().trim()
  const filtered = term
    ? qps.filter((qp) => {
        const code = (qp.code || "").toLowerCase()
        const name = qp.subject_name.toLowerCase()
        return (
          name.includes(term) ||
          code.includes(term) ||
          qp.exam_period.toLowerCase().includes(term) ||
          qp.regulation.toString().includes(term)
        )
      })
    : qps

  // Strip out any doc with an unsafe file_url before it ever reaches the client
  const safeFiltered = filtered.filter((qp) => isSafeFileUrl(qp.file_url))

  const totalRows = safeFiltered.length
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE
  const paginated = safeFiltered.slice(startIndex, startIndex + ROWS_PER_PAGE)

  return (
    <>
      <div className="flex items-center justify-between text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] py-2 border-b border-dashed border-[#E5E7EB]/80 dark:border-[#2A2A2A]/80">
        <span>Showing {totalRows} {totalRows === 1 ? "question paper" : "question papers"}</span>
        {totalPages > 1 && <span>Page {currentPage} of {totalPages}</span>}
      </div>

      <QPResultsTable documents={paginated} hasQuery={term.length > 0} currentPage={currentPage} />

      {totalPages > 1 && (
        <QPPagination currentPage={currentPage} totalPages={totalPages} search={search} />
      )}
    </>
  )
}

export default async function QuestionPapersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search ?? ""
  const rawPage = Number(params.page)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
          Anna University Question Papers
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#9CA3AF] max-w-2xl mx-auto sm:mx-0 leading-relaxed">
          Download previous year question papers for all departments and semesters —
          Regulation 2021, free PDF downloads. Search by subject name or code (e.g. CS3491, OS).
        </p>
      </div>

      <div className="space-y-6">
        <QPSearchInput defaultValue={search} />
        <Suspense key={`${search}-${page}`} fallback={<QPSkeleton />}>
          <QPResults search={search} page={page} />
        </Suspense>
      </div>
    </div>
  )
}