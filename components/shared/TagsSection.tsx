import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Hash } from "lucide-react"

interface TagsSectionProps {
  tags: string[]
}

export function TagsSection({ tags }: TagsSectionProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div id="tags-section-wrapper" className="p-6 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] transition-colors duration-200">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#111827] dark:text-[#F9FAFB] mb-4 flex items-center gap-2">
        <Hash className="h-4 w-4 text-indigo-500" />
        Related Tags
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <Link
            id={`tag-element-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            key={idx}
            href={`/question-papers?search=${encodeURIComponent(tag)}`}
            className="group"
          >
            <Badge
              variant="outline"
              className="py-1 px-3 border-[#E5E7EB] dark:border-[#2A2A2A] text-[#6B7280] dark:text-[#9CA3AF] bg-white dark:bg-transparent hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:border-transparent transition-all cursor-pointer rounded-lg text-xs"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
