// components/qp-search-input.tsx  (Client — only the input needs interactivity)
"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function QPSearchInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      params.delete("page") // reset to page 1 on new search

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    }, 350) // debounce so we don't hit the server on every keystroke

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full shadow-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#6B7280] dark:text-[#9CA3AF]">
        <Search className="h-5 w-5" />
      </div>
      <Input
        id="qp-main-search-input"
        type="text"
        placeholder="Search by subject name or subject code (e.g. CS3401, OS)..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-11 h-12 bg-white dark:bg-[#1A1A1A] border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl text-sm"
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
          searching…
        </span>
      )}
    </div>
  )
}