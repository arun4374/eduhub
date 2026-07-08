import { findArticleBySlug, getArticles } from "@/lib/articles"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { ShareButton } from "@/components/articles/ShareButton"

type ArticlePageProps = {

  params: Promise<{ slug: string }>
}

// Generate static paths at build time
export async function generateStaticParams() {
  // Fetch all articles to generate static pages for them.
  // Using MOCK_ARTICLES.length instead of a hardcoded 1000 so this
  // never silently truncates as the article count grows.
  const { pagination } = await getArticles({ limit: 1 })
  const { articles } = await getArticles({ limit: pagination.totalArticles || 1 })
  return articles.map(article => ({
    slug: article.slug,
  }))
}

// Generate dynamic metadata for each article
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await findArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await findArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-8">
        <Link href="/articles" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
          ← Back to all articles
        </Link>
      </div>

      <article className="prose prose-indigo dark:prose-invert lg:prose-lg max-w-none">
        <div className="mb-6 border-b pb-6 border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <img src={article.author.avatarUrl} alt={article.author.name} className="h-8 w-8 rounded-full bg-gray-200" />
                <span>{article.author.name}</span>
              </div>
              <span>•</span>
              <time dateTime={article.publishedAt}>
                {format(new Date(article.publishedAt), "MMMM d, yyyy")}
              </time>
            </div>
            <ShareButton title={article.title} slug={article.slug} />
          </div>
        </div>

        <ReactMarkdown
          components={{
            a: ({ node, href, ...props }) => {
              // Render external links with an icon
              if (href && (href.startsWith("http") || href.startsWith("//"))) {
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {props.children}
                    <ExternalLink className="inline-block w-4 h-4 ml-1 opacity-70" />
                  </a>
                )
              }
              // Render internal links with Next.js Link for SPA navigation
              if (href && href.startsWith("/")) {
                return <Link href={href} {...props} />
              }
              return <a href={href} {...props} />
            },
            img: ({ node, ...props }) => (
              <img className="rounded-lg border border-gray-200 dark:border-gray-700" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="not-italic bg-gray-50 dark:bg-gray-800/50 border-l-4 border-indigo-500 dark:border-indigo-400 p-4" {...props} />
            ),
          }}
        >{article.content_markdown}</ReactMarkdown>
      </article>
    </div>
  )
}