import "server-only"
import dbConnect from "@/lib/dbConnect"
import SubjectModel from "@/models/subject"
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