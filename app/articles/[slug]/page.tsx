import { findArticleBySlug, getArticles } from "@/lib/articles"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
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

const SITE_URL = "https://myarivon.in"

// Generate dynamic metadata for each article
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await findArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  const articleUrl = `${SITE_URL}/articles/${article.slug}`

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: articleUrl,
      siteName: "Arivon",
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title: article.metaTitle,
      description: article.metaDescription,
      images: article.coverImage ? [article.coverImage] : undefined,
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
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
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
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, href, ...props }) => {
              // Render PDF links as a styled download button instead of plain text
              if (href && href.toLowerCase().endsWith(".pdf")) {
                return (
                  <a
                    href={href}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="not-prose inline-flex items-center gap-2 px-4 py-2.5 my-2 rounded-lg
                      bg-indigo-600 text-white font-semibold text-sm no-underline
                      hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    📄 {props.children}
                  </a>
                )
              }
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