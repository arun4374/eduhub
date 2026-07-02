// app/question-papers/[slug]/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { getQuestionPapers } from "@/lib/documents"
import { notFound } from "next/navigation"
import { Download } from "lucide-react"
import type { Document } from "@/data/mock-documents"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

const createSlug = (doc: Document): string => {
  // Creates a unique, human-readable slug for a question paper.
  // e.g., "design-and-analysis-of-algorithms-cs3401-nd-2025"
  return slugify(`${doc.subject_name}-${doc.code}-${doc.exam_period}`)
}

async function findDocBySlug(slug: string): Promise<Document | undefined> {
  const docs = await getQuestionPapers()
  // This is inefficient on a large dataset. In a real DB, you'd query by slug.
  // For this project's scale, it's acceptable.
  return docs.find(
    (d) => d.type === "question_paper" && createSlug(d) === slug
  )
}

// ─── Static Generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const docs = await getQuestionPapers()
  return docs
    .filter((d) => d.type === "question_paper")
    .map((doc) => ({ slug: createSlug(doc) }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params
  const doc = await findDocBySlug(slug)

  if (!doc) {
    // To prevent build errors if a slug is invalid, though `notFound()` is better at runtime.
    return { title: "Question Paper Not Found" }
  }

  const title = `${doc.subject_name} (${doc.code}) - ${doc.exam_period} Question Paper`
  const description = `Download free PDF for Anna University's ${doc.subject_name} (${doc.code}) previous year question paper for the ${doc.exam_period} examination. Regulation ${doc.regulation}.`
  const canonicalUrl = `https://eduhub-tau-rosy.vercel.app/question-papers/${slug}`

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

export default async function QuestionPaperPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const doc = await findDocBySlug(slug)

  if (!doc) {
    notFound()
  }

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
    </div>
  )
}
