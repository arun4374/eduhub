// app/question-papers/page.tsx
import QPSearchTable from "@/components/question-papers/QPSearchTable"
import type { Metadata } from "next"
import { searchQuestionPapers, looksLikeSubjectCode } from "@/lib/documents"

// Keep this identical to the SITE_URL used in app/question-papers/[slug]/page.tsx
const SITE_URL = "https://myarivon.in"

type Props = {
  searchParams: Promise<{ search?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const search = params?.search?.trim()
  const page = parseInt(params?.page || "1", 10)

  if (search) {
    // Quick, cheap check of result count so we don't index thin/zero-result
    // or messy free-text queries — only clean subject-code or well-matched
    // searches with real results earn an indexable URL.
    const { pagination } = await searchQuestionPapers({ query: search, page: 1, limit: 1 })
    const hasResults = pagination.totalDocuments > 0
    const isCleanQuery = looksLikeSubjectCode(search) || pagination.totalDocuments >= 2
    const shouldIndex = hasResults && isCleanQuery && page === 1

    return {
      title: `${search} Question Paper - Anna University | Arivon`,
      description: `Download ${search} previous year question papers, exam papers for Anna University Regulation 2021 students. Free PDF download.`,
      alternates: {
        canonical: `${SITE_URL}/question-papers?search=${encodeURIComponent(search)}`,
      },
      robots: shouldIndex ? { index: true, follow: true } : { index: false, follow: true },
    }
  }

  return {
    title: "Anna University Question Papers - All Departments | Arivon",
    description:
      "Download Anna University previous year question papers for CSE, ECE, EEE, Mech, Civil and more. Semester-wise, subject-wise, all regulations. Free PDF download.",
    alternates: { canonical: `${SITE_URL}/question-papers` },
    openGraph: {
      title: "Anna University Question Papers - Arivon",
      description:
        "Free download of previous year Anna University question papers, all departments and semesters.",
      url: `${SITE_URL}/question-papers`,
      type: "website",
    },
  }
}

export default async function QuestionPapersPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params?.search?.trim() || ""
  const page = parseInt(params?.page || "1", 10)

  // Fetch the first page of results on the server so Googlebot (and users on
  // slow connections) get real content in the initial HTML instead of a
  // loading skeleton. QPSearchTable hydrates from this and takes over
  // client-side for subsequent searches/pagination.
  const initial = await searchQuestionPapers({ query: search, page, limit: 10 })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
          {search ? `${search} Question Papers - Anna University` : "Anna University Question Papers"}
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#9CA3AF] max-w-2xl mx-auto sm:mx-0 leading-relaxed">
          Search for papers by subject name or code (e.g. CS3491, OS). All
          question papers are for Anna University Regulation 2021.
        </p>
      </div>

      <QPSearchTable
        initialQuery={search}
        initialPage={initial.pagination.currentPage}
        initialDocuments={initial.documents}
        initialPagination={initial.pagination}
      />

      {/* Structured data: real content now, since it's server-rendered */}
      {initial.documents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: initial.documents.slice(0, 10).map((doc: any, i: number) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/question-papers/${doc.slug}`,
                name: `${doc.subject_name} (${doc.code}) - ${doc.exam_period}`,
              })),
            }),
          }}
        />
      )}
    </div>
  )
}