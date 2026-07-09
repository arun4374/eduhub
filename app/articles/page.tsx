import { getArticles } from "@/lib/articles"
import type { Metadata } from "next"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Eye, Flame } from "lucide-react"

export const metadata: Metadata = {
  title: "Articles - Arivon",
  description: "Helpful articles and guides for university students on exam preparation, projects, and career advice.",
}

type ArticlesPageProps = {
  // Next.js 15+: searchParams is now a Promise, must be awaited
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Formats raw view counts the way social feeds do: 1234 -> "1.2k"
function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}m`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
  return `${views}`
}

// Deterministic placeholder gradient for articles without a cover image,
// keyed off the title so the same article always gets the same look.
function placeholderGradient(title: string): string {
  const gradients = [
    "from-indigo-500 to-violet-600",
    "from-rose-500 to-orange-500",
    "from-emerald-500 to-teal-600",
    "from-sky-500 to-indigo-600",
    "from-amber-500 to-rose-500",
  ]
  const index = title.charCodeAt(0) % gradients.length
  return gradients[index]
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams
  const pageRaw = resolvedSearchParams?.page
  const pageNumber = Array.isArray(pageRaw) ? pageRaw[0] : pageRaw

  // Guard against invalid/garbage `page` query params (e.g. ?page=abc)
  const parsedPage = parseInt(pageNumber ?? "1", 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1

  // Bumped from 2 -> 10: a feed layout with a featured post + trending rail
  // needs enough articles on screen to not look sparse.
  const { articles, pagination } = await getArticles({ page, limit: 10 })

  // Featured post is the most-viewed article on this page, shown large at
  // the top — only makes sense on page 1, where it reads as "start here."
  const sortedByViews = [...articles].sort((a, b) => b.views - a.views)
  const featured = page === 1 ? sortedByViews[0] : null
  const rest = featured ? articles.filter(a => a._id !== featured._id) : articles
  // Trending rail: top 5 by views from the articles we already fetched.
  // Note: this ranks within the current page's results, not site-wide —
  // wire up a dedicated getMostViewedArticles() in lib/articles.ts if you
  // want a true global "trending" list independent of pagination.
  const trending = sortedByViews.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Articles & Guides
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Tips and advice for your academic journey.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main feed */}
          <div className="lg:col-span-2 space-y-8">

            {/* Featured post */}
            {featured && (
              <Link href={`/articles/${featured.slug}`} className="group block">
                <article className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
                  <div className="relative h-56 sm:h-72 w-full overflow-hidden">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${placeholderGradient(featured.title)} flex items-center justify-center`}>
                        <span className="text-white/90 text-6xl font-bold">{featured.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wide shadow-sm">
                      <Flame className="h-3.5 w-3.5" />
                      Most read
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-x-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{format(new Date(featured.publishedAt), "MMMM d, yyyy")}</span>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {formatViews(featured.views)} views
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300 line-clamp-2">
                      {featured.excerpt}
                    </p>
                    {featured.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {featured.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            )}

            {/* Feed list */}
            <div className="space-y-4">
              {rest.map(article => (
                <Link key={article._id} href={`/articles/${article.slug}`} className="group block">
                  <article className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200">
                    <div className="relative shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`h-full w-full bg-gradient-to-br ${placeholderGradient(article.title)} flex items-center justify-center`}>
                          <span className="text-white/90 text-2xl font-bold">{article.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-x-2.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                        <span>{format(new Date(article.publishedAt), "MMM d, yyyy")}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(article.views)}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2">
                        {article.excerpt}
                      </p>
                      {article.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[11px] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.currentPage}</span> of{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  {pagination.currentPage > 1 ? (
                    <Link
                      href={`/articles?page=${pagination.currentPage - 1}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1.5" />
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 border border-gray-100 dark:border-gray-800 text-sm font-medium rounded-full text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed">
                      <ChevronLeft className="h-4 w-4 mr-1.5" />
                      Previous
                    </span>
                  )}
                  {pagination.currentPage < pagination.totalPages ? (
                    <Link
                      href={`/articles?page=${pagination.currentPage + 1}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 border border-gray-100 dark:border-gray-800 text-sm font-medium rounded-full text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed">
                      Next
                      <ChevronRight className="h-4 w-4 ml-1.5" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Trending now
                  </h3>
                </div>
                <ol className="space-y-4">
                  {trending.map((article, i) => (
                    <li key={article._id}>
                      <Link href={`/articles/${article.slug}`} className="group flex gap-3 items-start">
                        <span className="shrink-0 text-lg font-bold text-gray-200 dark:text-gray-700 group-hover:text-indigo-400 transition-colors tabular-nums">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {article.title}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <Eye className="h-3 w-3" />
                            {formatViews(article.views)} views
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}