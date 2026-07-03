// lib/documents.ts
import "server-only"
import type { Document } from "@/data/mock-documents"
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