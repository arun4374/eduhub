// app/question-papers/[slug]/page.tsx
import type { Metadata } from "next"
import { getQuestionPapers } from "@/lib/documents"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const docs = await getQuestionPapers()
  return docs
    .filter((d) => d.type === "question_paper")
    .map((d) => ({ slug: slugify(`${d.code}-${d.subject_name}`) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = await findDocBySlug(slug)
  if (!doc) return {}

  return {
    title: `${doc.code} ${doc.subject_name} Question Paper - Anna University`,
    description: `Download ${doc.subject_name} (${doc.code}) previous year question paper - ${doc.exam_period}, Regulation ${doc.regulation}. Free PDF.`,
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await findDocBySlug(slug)
  if (!doc) notFound()

  return (
    <div>
      <h1>{doc.subject_name} ({doc.code}) Question Paper</h1>
      <p>Anna University {doc.exam_period} exam, Regulation {doc.regulation}</p>
      {/* download button etc */}
    </div>
  )
}

async function findDocBySlug(slug: string) {
  const docs = await getQuestionPapers()
  return docs.find(
    (d) => d.type === "question_paper" && slugify(`${d.code}-${d.subject_name}`) === slug
  )
}
