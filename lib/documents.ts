// lib/documents.ts
import "server-only"
import type { Document } from "@/data/mock-documents"

const ALLOWED_URL_SCHEMES = ["http:", "https:"]

export function isSafeFileUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_URL_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

// Direct DB call is best (skip the network hop to your own API route).
// If you already have a Mongo model + dbConnect, swap this to query it directly.
// Keeping fetch() here as a drop-in if you want to keep /api/documents as-is.
export async function getQuestionPapers(): Promise<(Document & { code?: string })[]> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://eduhub-tau-rosy.vercel.app"

  const res = await fetch(`${base}/api/documents`, {
    // SSR-friendly caching: revalidate every 5 min instead of no-store,
    // since question papers don't change every request.
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch documents: ${res.status}`)
  }

  const result = await res.json()
  if (!result.success) {
    throw new Error(result.error || "Unknown error fetching documents")
  }

  return result.data as (Document & { code?: string })[]
}