import type { Metadata } from "next"
import { ReportForm } from "@/components/report/ReportForm"
import { Bug } from "lucide-react"

export const metadata: Metadata = {
  title: "Report an Issue | Arivon",
  description: "Found a bug, incorrect data, or have a suggestion? Let us know by filling out the report form. We appreciate your help in improving Arivon.",
  alternates: {
    canonical: "https://myarivon.in/report",
  },
}

export default function ReportPage() {
  return (
    <main className="bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <Bug className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Report an Issue
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Help us improve Arivon. If you've found a bug, incorrect information, or have a suggestion, please let us know.
          </p>
        </div>
        <ReportForm />
      </div>
    </main>
  )
}