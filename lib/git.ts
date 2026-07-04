import "server-only"
import { execSync } from "child_process"
import path from "path"

// A cache to avoid running git command multiple times for the same file during a single build
const dateCache = new Map<string, Date>()

export function getLastUpdatedDateForFile(filePath: string): Date {
  const absoluteFilePath = path.resolve(filePath)

  if (dateCache.has(absoluteFilePath)) {
    return dateCache.get(absoluteFilePath)!
  }

  try {
    const repoRoot = execSync("git rev-parse --show-toplevel").toString().trim()
    const relativeFilePath = path.relative(repoRoot, absoluteFilePath)

    // Use `git log` to get the committer date (ISO 8601 format) of the last commit that touched this file
    const lastCommitDateStr = execSync(`git log -1 --format=%cI -- "${relativeFilePath}"`, { cwd: repoRoot }).toString().trim()

    if (lastCommitDateStr) {
      const date = new Date(lastCommitDateStr)
      dateCache.set(absoluteFilePath, date)
      return date
    }
  } catch (error) {
    console.warn(`Could not get git last-updated date for ${filePath}. Falling back to current date.`)
  }

  // Fallback to the current date if git command fails
  const now = new Date()
  dateCache.set(absoluteFilePath, now)
  return now
}