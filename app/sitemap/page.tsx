import type { Metadata } from "next"
import { getQuestionPapers } from "@/lib/documents"
import { getAllSubjects } from "@/lib/subjects"
import { DEPARTMENTS } from "@/config/departments"
import { SitemapClient } from "../../components/sitemap/SitemapClient"

export const metadata: Metadata = {
  title: "Sitemap | Arivon",
  description: "A complete sitemap of Arivon, helping you navigate all our pages including departments, subjects, question papers, and legal information.",
  alternates: {
    canonical: "https://myarivon.in/sitemap",
  },
  robots: {
    index: false,
  },
}

export default async function SitemapPage() {
  // Fetch dynamic content concurrently
  const [questionPapersData, subjectsData] = await Promise.all([
    getQuestionPapers(),
    getAllSubjects(),
  ])

  const staticPages = [
    { name: "Home", href: "/" },
    { name: "All Question Papers", href: "/question-papers" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ]

  return (
    <main className="bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Sitemap
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            A complete overview of all pages on Arivon.
          </p>
        </div>

        {/* Main Content */}
        <SitemapClient
          staticPages={staticPages}
          departments={DEPARTMENTS}
          subjects={subjectsData}
          questionPapers={questionPapersData}
        />
      </div>
    </main>
  )
}