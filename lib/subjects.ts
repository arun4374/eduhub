import "server-only"
import dbConnect from "@/lib/dbConnect"
import SubjectModel from "@/models/subject"
import DocumentModel from "@/models/document"
import { unstable_cache } from "next/cache"

// This function fetches data directly from the database.
// It's cached to avoid hitting the DB on every request for the same department.
const _getSubjectsByDepartment = async (department: string, regulation?: string): Promise<any[]> => {
  await dbConnect()

  const filter: { department?: RegExp; regulation?: string } = {}
  if (department) {
    filter.department = new RegExp(`^${department}$`, 'i')
  }
  if (regulation) {
    filter.regulation = regulation
  }

  // Using .lean() for performance, as we only need plain JS objects.
  const subjects = await SubjectModel.find(filter).sort({ semester: 1, name: 1 }).lean()

  // JSON.parse(JSON.stringify()) is a robust way to ensure plain objects for serialization.
  return JSON.parse(JSON.stringify(subjects))
}

export const getSubjectsByDepartment = unstable_cache(
  _getSubjectsByDepartment,
  ["subjects_by_department"], // A unique cache key for this data
  { revalidate: 3600 } // Revalidate every hour
)

const _getAvailableRegulations = async (department: string): Promise<string[]> => {
  await dbConnect();
  const regulations = await SubjectModel.distinct('regulation', {
    department: new RegExp(`^${department}$`, 'i')
  });

  // Sort regulations numerically in descending order (e.g., 2021, 2017)
  return regulations.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
};

export const getAvailableRegulations = unstable_cache(
  _getAvailableRegulations,
  ['regulations_by_department'],
  { revalidate: 3600 } // Revalidate every hour
);

// ---------------------------------------------------------------------------
// Below are the three functions your sitemap and subject detail pages
// import but that didn't exist yet in this file.
// ---------------------------------------------------------------------------

// Used by the sitemap page. Returns every subject, but only the lightweight
// fields needed to render links (avoids shipping syllabus_markdown,
// description, etc. to the sitemap for no reason).
const _getAllSubjects = async (): Promise<any[]> => {
  await dbConnect()

  const subjects = await SubjectModel.find({})
    .select("name code slug department year semester regulation")
    .sort({ department: 1, semester: 1, name: 1 })
    .lean()

  return JSON.parse(JSON.stringify(subjects))
}

export const getAllSubjects = unstable_cache(
  _getAllSubjects,
  ["all_subjects"],
  { revalidate: 3600 } // Revalidate every hour
)

// Used by the subject detail page (generateMetadata + the page body).
// Returns the full subject document since the page needs metaDescription,
// keywords, pageTitle, syllabus_markdown, tags, views, etc.
const _findSubjectBySlug = async (slug: string): Promise<any | null> => {
  if (!slug) return null

  await dbConnect()
  const subject = await SubjectModel.findOne({ slug }).lean()

  if (!subject) {
    return null
  }

  return JSON.parse(JSON.stringify(subject))
}

export const findSubjectBySlug = unstable_cache(
  _findSubjectBySlug,
  ["subject_by_slug"],
  { revalidate: 3600 } // Revalidate every hour
)

// Used by the subject detail page to fetch question papers / notes tied to
// a given subject. Assumes DocumentModel has a `subjectId` field storing the
// Subject's _id as a string (per your existing data architecture).
const _getDocumentsForSubject = async (subjectId: string): Promise<any[]> => {
  if (!subjectId) return []

  await dbConnect()
  const documents = await DocumentModel.find({ subjectId }).lean()

  return JSON.parse(JSON.stringify(documents))
}

export const getDocumentsForSubject = unstable_cache(
  _getDocumentsForSubject,
  ["documents_for_subject"],
  { revalidate: 300 } // Revalidate every 5 minutes — same cadence as getQuestionPapers
)