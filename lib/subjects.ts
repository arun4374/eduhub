import "server-only"
import dbConnect from "@/lib/dbConnect"
import SubjectModel from "@/models/subject" // Assuming this model exists
import DocumentModel from "@/models/document" // Assuming this model exists
import { unstable_cache } from "next/cache"
import type { Document } from "@/data/mock-documents"

// This is an assumed type based on usage in the page component.
// You should adjust it to match your actual Subject schema.
export interface Subject {
  _id: string;
  name: string;
  code: string;
  slug: string;
  department: string;
  regulation: number;
  pageTitle: string;
  metaDescription: string;
  keywords: string[];
  views: number;
  updatedAt: string | Date;
  syllabus_markdown: string;
  description: string;
  tags: string[];
}

const _findSubjectBySlug = async (slug: string): Promise<Subject | null> => {
  if (!slug) return null

  await dbConnect()
  const subject = await SubjectModel.findOne({ slug }).lean()

  if (!subject) {
    return null
  }

  // Serialize the document, converting ObjectId to string
  return {
    ...subject,
    _id: subject._id.toString(),
  } as Subject
}

export const findSubjectBySlug = unstable_cache(_findSubjectBySlug, ["subject_by_slug"], { revalidate: 3600 }) // Cache for 1 hour

const _getDocumentsForSubject = async (subjectId: string): Promise<(Document & { code?: string })[]> => {
  if (!subjectId) return []

  await dbConnect()
  const documents = await DocumentModel.find({ subjectId }).lean()

  const serializedDocs = documents.map((doc: any) => ({
    ...doc,
    _id: doc._id.toString(),
  }))

  return serializedDocs as (Document & { code?: string })[]
}

export const getDocumentsForSubject = unstable_cache(_getDocumentsForSubject, ["documents_by_subject_id"], { revalidate: 300 }) // Cache for 5 minutes