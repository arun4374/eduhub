'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RegulationSelectorProps {
  regulations: string[];
  currentRegulation: string;
}

export function RegulationSelector({ regulations, currentRegulation }: RegulationSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleValueChange = (newRegulation: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set('regulation', newRegulation)
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${pathname}${query}`)
  }

  if (regulations.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="regulation-select" className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Regulation:
      </label>
      <Select onValueChange={handleValueChange} defaultValue={currentRegulation}>
        <SelectTrigger id="regulation-select" className="w-[120px] h-9 text-sm">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {regulations.map((reg) => (
            <SelectItem key={reg} value={reg}>
              {reg}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}