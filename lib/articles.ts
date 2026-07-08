import "server-only"
import { MOCK_ARTICLES } from "@/data/mock-articles"
import type { Article } from "@/data/mock-articles"
export type { Article }

export type GetArticlesResult = {
  articles: Article[]
  pagination: {
    currentPage: number
    totalPages: number
    totalArticles: number
  }
}

// In a real app, this would fetch from a database.
// For now, we're using mock data.

export const getArticles = async ({
  page = 1,
  limit = 2,
}: {
  page?: number
  limit?: number
} = {}): Promise<GetArticlesResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  // Sort by most recent
  const sortedArticles = [...MOCK_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const totalArticles = sortedArticles.length
  const totalPages = Math.ceil(totalArticles / limit)

  // Defense in depth: even if a caller passes a NaN/invalid `page`
  // (e.g. forwarded straight from an unsanitized query param), never
  // let it propagate into Array.prototype.slice, which silently
  // coerces NaN to 0 and can produce misleading results.
  const requestedPage = Number.isFinite(page) && page > 0 ? page : 1
  const safePage = Math.max(1, Math.min(requestedPage, totalPages || 1))
  const startIndex = (safePage - 1) * limit
  const articles = sortedArticles.slice(startIndex, startIndex + limit)

  return {
    articles,
    pagination: { currentPage: safePage, totalPages, totalArticles },
  }
}

export const findArticleBySlug = async (slug: string): Promise<Article | null> => {
  if (!slug) return null
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  const article = MOCK_ARTICLES.find(article => article.slug === slug)
  return article || null
}