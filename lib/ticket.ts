import crypto from "crypto"
import Report from "@/models/Report"

const TICKET_PREFIX = "ARV"
const TICKET_ID_PATTERN = /^ARV[a-f0-9]{6}$/i

// e.g. "ARV86f13f" — prefix + 6 lowercase hex chars (3 random bytes).
function generateTicketCandidate(): string {
    const suffix = crypto.randomBytes(3).toString("hex")
    return `${TICKET_PREFIX}${suffix}`
}

/**
 * Generates a ticket ID guaranteed unique against the Report collection.
 * Assumes the caller has already established a DB connection (dbConnect()).
 */
export async function generateUniqueTicketId(maxAttempts = 5): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidate = generateTicketCandidate()
        const existing = await Report.findOne({ ticketId: candidate }).select("_id").lean()
        if (!existing) return candidate
    }
    throw new Error("Failed to generate a unique ticket ID after multiple attempts.")
}

export function isValidTicketFormat(ticketId: string): boolean {
    return TICKET_ID_PATTERN.test(ticketId.trim())
}