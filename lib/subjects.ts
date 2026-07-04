import "server-only"
import dbConnect from "@/lib/dbConnect"
import SubjectModel from "@/models/subject" // Assuming this model exists
import DocumentModel from "@/models/document" // Assuming this model exists
import { unstable_cache } from "next/cache"
import type { Document } from "@/data/mock-documents"

// This is an assumed type based on usage in the page component.
// You should adjust it to match your actual Subject schema.
export interface Subject {
  _id: string
  pageTitle: string
  slug: string
  code: string
  name: string
  department: "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL"
  year: "1st" | "2nd" | "3rd" | "4th"
  semester: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
  regulation: string
  description: string
  syllabus_markdown: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  tags: string[]
  views: number
  downloads: number
  createdAt: string | Date
  updatedAt: string | Date
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

const _getSubjectsByDepartment = async (departmentShortName: string): Promise<Subject[]> => {
  if (!departmentShortName) return []

  await dbConnect()
  const subjects = await SubjectModel.find({ department: departmentShortName.toUpperCase() }).sort({ semester: 1, name: 1 }).lean()

  if (!subjects) {
    return []
  }

  // Serialize the documents
  return subjects.map((subject: any) => ({
    ...subject,
    _id: subject._id.toString(),
  })) as Subject[]
}

export const getSubjectsByDepartment = unstable_cache(_getSubjectsByDepartment, ["subjects_by_department"], { revalidate: 3600 }) // Cache for 1 hour

const _getAllSubjects = async (): Promise<Subject[]> => {
  await dbConnect()
  const subjects = await SubjectModel.find({}).sort({ name: 1 }).lean()

  if (!subjects) {
    return []
  }

  // Serialize the documents
  return subjects.map((subject: any) => ({
    ...subject,
    _id: subject._id.toString(),
  })) as Subject[]
}

export const getAllSubjects = unstable_cache(_getAllSubjects, ["all_subjects"], { revalidate: 3600 }) // Cache for 1 hour