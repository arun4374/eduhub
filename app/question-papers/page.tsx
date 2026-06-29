import React from "react"
import { Metadata } from "next"
import { FileText } from "lucide-react"
import { QPSearchTable } from "@/components/question-papers/QPSearchTable"

export const metadata: Metadata = {
  title: "Previous Year Question Papers — Arivon Anna University",
  description: "Browse and download official Anna University previous year semester exam question papers for all branches including CSE, ECE, EEE, MECH and CIVIL branches under Regulation 2021/2019.",
}

export default function QuestionPapersPage() {
  return (
    <div id="question-papers-page" className="py-12 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Top Header Section */}
        <div className="mb-10 text-center md:text-left select-none">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2.5">
            <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <FileText className="h-6 w-6" />
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">
              Material Archives
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
            Question Papers Vault
          </h1>
        </div>

        {/* Dynamic searchable and filterable database spreadsheet with pagination */}
        <div id="central-searchtable-box">
          <QPSearchTable />
        </div>

      </div>
    </div>
  )
}
export const dynamic = "force-dynamic"
