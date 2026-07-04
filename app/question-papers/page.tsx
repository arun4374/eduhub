// app/question-papers/page.tsx
import QPSearchTable from "@/components/question-papers/QPSearchTable"
import type { Metadata } from "next"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { search?: string }
}): Promise<Metadata> {
  const search = searchParams?.search

  if (search) {
    return {
      title: `${search} Question Paper - Anna University | Arivon`,
      description: `Download ${search} previous year question papers, exam papers for Anna University Regulation 2021 students. Free PDF download.`,
      alternates: { canonical: `https://eduhub-tau-rosy.vercel.app/question-papers?search=${encodeURIComponent(search)}` },
    }
  }

  return {
    title: "Anna University Question Papers - All Departments | Arivon",
    description: "Download Anna University previous year question papers for CSE, ECE, EEE, Mech, Civil and more. Semester-wise, subject-wise, all regulations. Free PDF download.",
    keywords: [
      "anna university question papers",
      "anna university previous year question papers",
      "anna university PYQ",
      "AU question bank",
      "regulation 2021 question papers",
      "CSE question papers anna university",
    ],
    alternates: { canonical: "https://eduhub-tau-rosy.vercel.app/question-papers" },
    openGraph: {
      title: "Anna University Question Papers - Arivon",
      description: "Free download of previous year Anna University question papers, all departments and semesters.",
      url: "https://eduhub-tau-rosy.vercel.app/question-papers",
      type: "website",
    },
  }
}

export default function QuestionPapersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
          Anna University Question Papers
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#9CA3AF] max-w-2xl mx-auto sm:mx-0 leading-relaxed">
          Search for papers by subject name or code (e.g. CS3491, OS). All
          question papers are for Anna University Regulation 2021.
        </p>
      </div>

      <QPSearchTable />
    </div>
  )
}