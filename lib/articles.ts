import "server-only"
import { MOCK_ARTICLES } from "@/data/mock-articles"
import type { Article } from "@/data/mock-articles"
export type { Article }

// In a real app, this would fetch from a database.
// For now, we're using mock data.

export const getArticles = async (): Promise<Article[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  // Sort by most recent
  return MOCK_ARTICLES.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export const findArticleBySlug = async (slug: string): Promise<Article | null> => {
  if (!slug) return null
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  const article = MOCK_ARTICLES.find(article => article.slug === slug)
  return article || null
}