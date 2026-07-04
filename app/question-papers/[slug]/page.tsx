// app/question-papers/[slug]/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { findDocBySlug, getRelatedDocuments } from "@/lib/documents"
import { notFound } from "next/navigation"
import { Download } from "lucide-react"

// ─── Static Generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const docs = await getQuestionPapers()
  return docs
    .filter((d) => d.type === "question_paper")
    // The slug is now a field on the document, fetched from the DB.
    // `slug` may not exist on the fetched document type, cast to any to avoid
    // TypeScript error — we filter out falsy slugs below.
    .map((doc) => ({ slug: (doc as any).slug }))
    .filter((doc) => doc.slug) // Ensure we don't generate pages for docs without slugs
}

// The `params` prop is typed as a Promise to maintain consistency with other pages in the project,
// even though Next.js typically passes it as a plain object.
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await findDocBySlug(slug)

  if (!doc) {
    // To prevent build errors if a slug is invalid, though `notFound()` is better at runtime.
    return { title: "Question Paper Not Found" }
  }

  const title = `${doc.subject_name} (${doc.code}) - ${doc.exam_period} Question Paper`
  const description = `Download free PDF for Anna University's ${doc.subject_name} (${doc.code}) previous year question paper for the ${doc.exam_period} examination. Regulation ${doc.regulation}.`
  const canonicalUrl = `https://myarivon.in/question-papers/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
    },
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function QuestionPaperPage({ params }: Props) {
  const { slug } = await params
  const doc = await findDocBySlug(slug) // This now hits the DB directly and is cached.

  if (!doc) {
    notFound()
  }

  // Find related documents efficiently by querying the database directly
  // instead of fetching all documents and filtering in memory.
  const relatedDocs =
    doc.code && doc.department && doc.semester
      ? await getRelatedDocuments(doc._id, doc.code, doc.department, doc.semester)
      : []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <header className="space-y-3 mb-8">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
          Anna University Question Paper
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
          {doc.subject_name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          <span>Code: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{doc.code}</span></span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>Exam: <span className="font-medium text-gray-800 dark:text-gray-200">{doc.exam_period}</span></span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>Regulation: <span className="font-medium text-gray-800 dark:text-gray-200">{doc.regulation}</span></span>
        </div>
      </header>

      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ready to view? You can preview the document here or download it for offline access.
          </p>
          <Link
            href={doc.file_url}
            target="_blank"
            rel="noopener noreferrer"
            download={doc.pdf_filename}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="aspect-video border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-sm">
          <iframe
            src={`${doc.file_url}#view=fitH`}
            title={`${doc.subject_name} Question Paper PDF`}
            className="w-full h-full"
            allow="fullscreen"
          />
        </div>
        <p className="text-xs text-center mt-2 text-gray-500">
          PDF viewer may not work on all browsers. Use the download button for the best experience.
        </p>
      </div>

      {relatedDocs.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB] mb-6">
            Related Question Papers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDocs.map((relatedDoc) => (
              <Link
                key={relatedDoc._id}
                href={`/question-papers/${(relatedDoc as any).slug}`}
                className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 bg-white dark:bg-gray-900/50"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={relatedDoc.subject_name}>
                  {relatedDoc.subject_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {relatedDoc.exam_period}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {relatedDoc.code}
                  </span>
                  <span>Reg: {relatedDoc.regulation}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * IMPORTANT: For these changes to work with existing data, you'll need to run a
 * one-time migration script to populate the `slug` field for all existing
 * question paper documents in your database.
 */
