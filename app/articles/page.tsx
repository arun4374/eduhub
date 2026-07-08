import { getArticles } from "@/lib/articles"
import type { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Articles - Arivon",
  description: "Helpful articles and guides for university students on exam preparation, projects, and career advice.",
}

type ArticlesPageProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const pageRaw = searchParams?.page
  const pageNumber = Array.isArray(pageRaw) ? pageRaw[0] : pageRaw
  const page = parseInt(pageNumber || "1", 10)
  const { articles, pagination } = await getArticles({ page, limit: 2 })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="space-y-3 mb-12 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Articles & Guides
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tips and advice for your academic journey.
        </p>
      </div>

      <div className="space-y-10">
        {articles.map(article => (
          <article key={article._id}>
            <Link href={`/articles/${article.slug}`} className="group block">
              <div className="flex items-center gap-x-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <p>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</p>
                {article.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <p>{article.tags.join(", ")}</p>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {article.title}
              </h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                {article.excerpt}
              </p>
              <p className="mt-4 inline-block font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                Read more →
              </p>
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{pagination.currentPage}</span> of{" "}
              <span className="font-medium">{pagination.totalPages}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pagination.currentPage > 1 ? (
              <Link
                href={`/articles?page=${pagination.currentPage - 1}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-md text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </span>
            )}
            {pagination.currentPage < pagination.totalPages ? (
              <Link
                href={`/articles?page=${pagination.currentPage + 1}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            ) : (
              <span className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-md text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}