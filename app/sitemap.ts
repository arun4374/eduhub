// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getQuestionPapers } from "@/lib/documents"
import { getAllSubjects } from "@/lib/subjects"
import { DEPARTMENTS } from "@/config/departments"

// Use your production URL here. This should match the `siteUrl` in your root metadata.
const SITE_URL = "https://myarivon.in"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/question-papers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // 2. Department Pages
  const departmentPages: MetadataRoute.Sitemap = DEPARTMENTS.map((dept) => ({
    url: `${SITE_URL}/department/${dept.slug}`,
    lastModified: new Date(), // This could be improved to be dynamic
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  // 3. Subject (Syllabus) Pages
  const subjects = await getAllSubjects()
  // NOTE: This assumes subject pages exist at `/subjects/[slug]`. Adjust if your route is different.
  const subjectPages: MetadataRoute.Sitemap = subjects
    .filter((subject) => subject.slug)
    .map((subject) => ({
      url: `${SITE_URL}/subjects/${subject.slug}`,
      lastModified: new Date(subject.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }))

  // 4. Question Paper Pages
  const questionPapers = await getQuestionPapers()
  const questionPaperPages: MetadataRoute.Sitemap = questionPapers
    .filter((doc) => doc.type === "question_paper" && (doc as any).slug)
    .map((doc) => ({
      url: `${SITE_URL}/question-papers/${(doc as any).slug}`,
      lastModified: new Date((doc as any).updatedAt || doc.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }))

  return [...staticPages, ...departmentPages, ...subjectPages, ...questionPaperPages]
}