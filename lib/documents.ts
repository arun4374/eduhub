// lib/documents.ts
import "server-only"
import type { Document } from "@/data/mock-documents"
export type { Document }
import dbConnect from "@/lib/dbConnect"
import DocumentModel from "../models/document" // Assuming a Mongoose model exists at /models/document.js
import { unstable_cache } from "next/cache"

const ALLOWED_URL_SCHEMES = ["http:", "https:"]

export function isSafeFileUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_URL_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

export const createSlug = (doc: { subject_name: string; code: string; exam_period: string }): string => {
  // Creates a unique, human-readable slug for a question paper.
  // e.g., "design-and-analysis-of-algorithms-cs3401-nd-2025"
  return slugify(`${doc.subject_name}-${doc.code}-${doc.exam_period}`)
}

// This function fetches data directly from the database.
const _getQuestionPapers = async (): Promise<(Document & { code?: string })[]> => {
  await dbConnect()
  // Using .lean() for performance, as we only need plain JS objects.
  const documents = await DocumentModel.find({}).lean()

  // The result from Mongoose needs to be serialized correctly.
  // Specifically, `_id` needs to be converted from an ObjectId to a string.
  const serializedDocs = documents.map((doc: any) => {
    return {
      ...doc,
      // The slug field is now expected to be on the document from the DB
      _id: doc._id.toString(),
    }
  })

  return serializedDocs as (Document & { code?: string })[]
}

// The original fetch used `next: { revalidate: 300 }`.
// We replicate this caching behavior for the direct DB call using `unstable_cache`.
// This prevents hitting the DB on every request for data that rarely changes.
export const getQuestionPapers = unstable_cache(
  _getQuestionPapers,
  ["all_documents"], // A unique cache key for this data
  {
    revalidate: 300, // Revalidate every 5 minutes
  }
)

const _findDocBySlug = async (slug: string): Promise<(Document & { code?: string }) | null> => {
  if (!slug) return null

  await dbConnect()
  // This assumes the 'slug' field is now part of your DocumentModel schema and is indexed.
  const document = await DocumentModel.findOne({ slug, type: "question_paper" }).lean()

  if (!document) {
    return null
  }

  // Serialize the document, converting ObjectId to string
  return {
    ...document,
    _id: document._id.toString(),
  } as (Document & { code?: string })
}

// Cache individual document lookups. The slug is part of the cache key.
export const findDocBySlug = unstable_cache(
  _findDocBySlug,
  ["document_by_slug"], // Cache key prefix
  { revalidate: 300 } // Revalidate every 5 minutes
)

const _getRelatedDocuments = async (
  docId: string,
  code: string,
  department: string,
  semester: string
): Promise<(Document & { code?: string; slug?: string })[]> => {
  await dbConnect()

  // 1. Find papers with the same subject code (highest priority)
  const sameSubjectPapers = await DocumentModel.find({
    type: "question_paper",
    code: code,
    _id: { $ne: docId },
  })
    .limit(4)
    .lean()

  const needed = 4 - sameSubjectPapers.length

  let sameSemesterPapers: any[] = []
  if (needed > 0) {
    // 2. Find papers from the same department and semester, excluding already found ones
    const excludeIds = [docId, ...sameSubjectPapers.map((p) => p._id)]
    sameSemesterPapers = await DocumentModel.find({
      type: "question_paper",
      department: department,
      semester: semester,
      _id: { $nin: excludeIds },
    })
      .limit(needed)
      .lean()
  }

  const combined = [...sameSubjectPapers, ...sameSemesterPapers]

  // Serialize results, ensuring _id is a string
  return combined.map((d: any) => ({
    ...d,
    _id: d._id.toString(),
  }))
}

export const getRelatedDocuments = unstable_cache(
  _getRelatedDocuments,
  ["related_documents"],
  { revalidate: 300 }
)

// ADD THIS to your existing lib/documents.ts, below getRelatedDocuments.
// Uses the same dbConnect / DocumentModel / unstable_cache pattern as the
// rest of the file. Matches your real route.ts filter fields and sort order.

export type SearchDocumentsResult = {
  documents: (Document & { code?: string; slug?: string })[]
  pagination: { currentPage: number; totalPages: number; totalDocuments: number }
}

// Escapes regex special characters so searches like "C++" or "(OS)" don't
// throw — this was the cause of the 500 errors your route.ts could hit on
// certain input.
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const _searchQuestionPapers = async ({
  query,
  page = 1,
  limit = 10,
}: {
  query: string
  page?: number
  limit?: number
}): Promise<SearchDocumentsResult> => {
  await dbConnect()

  // Clamp inputs — prevents a malformed ?page=-5 or ?limit=99999 request
  // from producing a negative skip or an unbounded query.
  const safePage = Math.max(1, Math.floor(page) || 1)
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit) || 10))
  const skip = (safePage - 1) * safeLimit

  const filter: Record<string, any> = { type: "question_paper" }

  const trimmed = query.trim()
  if (trimmed) {
    const searchRegex = new RegExp(escapeRegex(trimmed), "i")
    filter.$or = [
      { subject_name: searchRegex },
      { code: searchRegex },
      { exam_period: searchRegex },
      { regulation: searchRegex },
    ]
  }

  const [documents, totalDocuments] = await Promise.all([
    DocumentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    DocumentModel.countDocuments(filter),
  ])

  // JSON round-trip is the safest way to strip Mongoose lean() output of any
  // non-plain values (ObjectId, Date, etc.) before this ever gets passed as
  // a prop into a Client Component — avoids the RSC serialization error.
  const serializedDocs = JSON.parse(JSON.stringify(documents)) as (Document & {
    code?: string
    slug?: string
  })[]

  return {
    documents: serializedDocs,
    pagination: {
      currentPage: safePage,
      totalDocuments,
      totalPages: Math.max(1, Math.ceil(totalDocuments / safeLimit)),
    },
  }
}

// Not cached with unstable_cache: search queries are too varied (arbitrary
// user input) to benefit from caching the way getQuestionPapers/findDocBySlug
// do — every distinct query+page would just create a new, mostly-unused
// cache entry.
export const searchQuestionPapers = _searchQuestionPapers

// Used by generateMetadata to decide whether a search query looks like a
// real Anna University subject code (e.g. CS3491) vs free text, so only
// clean, canonical-looking queries get marked indexable.
export function looksLikeSubjectCode(query: string): boolean {
  return /^[A-Za-z]{2,4}\d{4}$/.test(query.trim())
}