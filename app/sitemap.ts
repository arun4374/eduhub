// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getQuestionPapers } from "@/lib/documents"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getQuestionPapers()

  const subjectPages = docs
    .filter((d) => d.type === "question_paper")
    .map((d) => ({
      url: `https://eduhub-tau-rosy.vercel.app/question-papers/${slugify(`${d.code}-${d.subject_name}`)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

  return [
    {
      url: "https://eduhub-tau-rosy.vercel.app/question-papers",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...subjectPages,
  ]
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}