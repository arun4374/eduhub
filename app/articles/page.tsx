import { findArticleBySlug, getArticles } from "@/lib/articles"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

type Props = {
  params: { slug: string }
}

// Generate static paths at build time
export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(article => ({
    slug: article.slug,
  }))
}

// Generate dynamic metadata for each article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await findArticleBySlug(params.slug)

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

export default async function ArticlePage({ params }: Props) {
  const article = await findArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
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
          <div className="mt-4 flex items-center gap-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <img src={article.author.avatarUrl} alt={article.author.name} className="h-8 w-8 rounded-full bg-gray-200" />
              <span>{article.author.name}</span>
            </div>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), "MMMM d, yyyy")}
            </time>
          </div>
        </div>
        
        <ReactMarkdown>{article.content_markdown}</ReactMarkdown>
      </article>
    </div>
  )
}