import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Report from "@/models/Report";
import { isValidTicketFormat } from "../../../../lib/ticket";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// --- Very basic best-effort rate limiting -----------------------------------
// This only limits requests within a single warm serverless instance — it is
// NOT reliable across multiple instances/regions. For real protection against
// ticket-guessing or email-scraping, swap this for a shared store, e.g.
// Upstash Redis + @upstash/ratelimit, keyed by IP.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const timestamps = (requestLog.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    timestamps.push(now);
    requestLog.set(key, timestamps);
    return timestamps.length > RATE_LIMIT_MAX;
}

export async function GET(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        if (isRateLimited(ip)) {
            return NextResponse.json({ success: false, message: "Too many requests. Please try again in a minute." }, { status: 429 });
        }

        const { searchParams } = new URL(req.url);
        const ticketIdRaw = searchParams.get("ticketId")?.trim();
        const emailRaw = searchParams.get("email")?.trim();

        if (!ticketIdRaw && !emailRaw) {
            return NextResponse.json({ success: false, message: "Provide a ticket ID or email to look up your report." }, { status: 400 });
        }

        await dbConnect();

        // --- Ticket ID lookup: full details + status history --------------
        if (ticketIdRaw) {
            if (!isValidTicketFormat(ticketIdRaw)) {
                return NextResponse.json({ success: false, message: "That doesn't look like a valid ticket ID." }, { status: 400 });
            }

            const report = await Report.findOne({
                ticketId: { $regex: `^${ticketIdRaw}$`, $options: "i" },
            }).lean();

            if (!report) {
                return NextResponse.json({ success: false, message: "No report found for that ticket ID." }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: {
                    ticketId: report.ticketId,
                    category: report.category,
                    status: report.status,
                    pageUrl: report.pageUrl,
                    description: report.description,
                    fileUrl: report.fileUrl || null,
                    statusHistory: report.statusHistory,
                    createdAt: report.createdAt,
                    updatedAt: report.updatedAt,
                },
            });
        }

        // --- Email lookup: category + status only, no ticket / no details -
        if (emailRaw) {
            if (!EMAIL_PATTERN.test(emailRaw)) {
                return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
            }

            const reports = await Report.find({ email: emailRaw.toLowerCase() })
                .sort({ createdAt: -1 })
                .select("category status createdAt")
                .lean();

            if (reports.length === 0) {
                return NextResponse.json({ success: false, message: "No reports found for that email." }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: reports.map((r) => ({
                    category: r.category,
                    status: r.status,
                    createdAt: r.createdAt,
                })),
            });
        }

        // Unreachable, but keeps TS happy about all paths returning.
        return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });

    } catch (error) {
        console.error("GET /api/report/status error:", error);
        return NextResponse.json({ success: false, message: "An internal server error occurred." }, { status: 500 });
    }
}