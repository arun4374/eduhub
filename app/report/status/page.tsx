import type { Metadata } from "next"
import { ReportStatusForm } from "@/components/report/Reportstatusform"
import { ListChecks } from "lucide-react"

export const metadata: Metadata = {
  title: "Check Report Status | Arivon",
  description: "Track the status of a bug report or suggestion you submitted using your ticket ID or email.",
  alternates: {
    canonical: "https://myarivon.in/report/status",
  },
}

export default function ReportStatusPage() {
  return (
    <main className="bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <ListChecks className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Check Report Status
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Enter your ticket ID for full details, or your email if you've lost it.
          </p>
        </div>
        <ReportStatusForm />
      </div>
    </main>
  )
}