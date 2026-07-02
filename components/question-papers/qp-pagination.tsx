// components/qp-pagination.tsx  (Server-renderable — plain <Link>, works with JS disabled)
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QPPagination({
  currentPage,
  totalPages,
  search,
}: {
  currentPage: number
  totalPages: number
  search: string
}) {
  const hrefFor = (page: number) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (page > 1) params.set("page", String(page))
    const qs = params.toString()
    return qs ? `?${qs}` : "?"
  }

  return (
    <div className="p-4 border-t border-[#E5E7EB] dark:border-[#2A2A2A] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#151515]">
      <span className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] select-none font-mono">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Link href={hrefFor(Math.max(currentPage - 1, 1))} aria-disabled={currentPage === 1}>
          <Button variant="outline" size="sm" disabled={currentPage === 1} className="flex items-center gap-1 text-xs px-2 h-8">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
        <Link href={hrefFor(Math.min(currentPage + 1, totalPages))} aria-disabled={currentPage === totalPages}>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} className="flex items-center gap-1 text-xs px-2 h-8">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}