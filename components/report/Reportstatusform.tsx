"use client"

import { useState, type FormEvent } from "react"
import { Loader2, Search, CheckCircle2, Circle, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type LookupMode = "ticket" | "email"

type StatusValue = "pending" | "in_progress" | "resolved" | "closed"
type CategoryValue = "bug" | "incorrect_data" | "suggestion" | "other"

interface StatusHistoryEntry {
    status: StatusValue
    changedAt: string
    note?: string
}

interface TicketResult {
    ticketId: string
    category: CategoryValue
    status: StatusValue
    pageUrl: string
    description: string
    fileUrl: string | null
    statusHistory: StatusHistoryEntry[]
    createdAt: string
    updatedAt: string
}

interface EmailResultItem {
    category: CategoryValue
    status: StatusValue
    createdAt: string
}

const STATUS_LABELS: Record<StatusValue, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
}

const CATEGORY_LABELS: Record<CategoryValue, string> = {
    bug: "Bug",
    incorrect_data: "Incorrect Data",
    suggestion: "Suggestion",
    other: "Other",
}

const STATUS_BADGE_CLASSES: Record<StatusValue, string> = {
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    in_progress: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    resolved: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300",
    closed: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
}

// Full lifecycle order, used to render the timeline consistently even if a
// step hasn't happened yet.
const STATUS_ORDER: StatusValue[] = ["pending", "in_progress", "resolved"]

export function ReportStatusForm() {
    const [mode, setMode] = useState<LookupMode>("ticket")
    const [value, setValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [ticketResult, setTicketResult] = useState<TicketResult | null>(null)
    const [emailResults, setEmailResults] = useState<EmailResultItem[] | null>(null)

    const handleModeChange = (newMode: LookupMode) => {
        setMode(newMode)
        setValue("")
        setError(null)
        setTicketResult(null)
        setEmailResults(null)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setTicketResult(null)
        setEmailResults(null)

        const trimmed = value.trim()
        if (!trimmed) {
            setError(mode === "ticket" ? "Please enter your ticket ID." : "Please enter your email.")
            return
        }

        setIsLoading(true)
        try {
            const params = new URLSearchParams(mode === "ticket" ? { ticketId: trimmed } : { email: trimmed })
            const res = await fetch(`/api/report/status?${params.toString()}`)
            const data = await res.json()

            if (!res.ok || !data.success) {
                setError(data.message || "Something went wrong looking that up.")
                return
            }

            if (mode === "ticket") {
                setTicketResult(data.data as TicketResult)
            } else {
                setEmailResults(data.data as EmailResultItem[])
            }
        } catch (err) {
            console.error("Status lookup failed:", err)
            setError("Failed to reach the server. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2 border-b border-[#E5E7EB] dark:border-[#2A2A2A]">
                <button
                    type="button"
                    onClick={() => handleModeChange("ticket")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        mode === "ticket"
                            ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                    By Ticket ID
                </button>
                <button
                    type="button"
                    onClick={() => handleModeChange("email")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        mode === "email"
                            ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                    Forgot Ticket? Use Email
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="lookup-value">
                        {mode === "ticket" ? "Ticket ID" : "Email Address"}
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="lookup-value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={mode === "ticket" ? "e.g. ARV86f13f" : "you@example.com"}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            <span className="ml-2 hidden sm:inline">Check</span>
                        </Button>
                    </div>
                </div>
            </form>

            {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Ticket mode: full details + timeline */}
            {ticketResult && (
                <div className="border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#1A1A1A] p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <code className="font-mono text-sm font-bold">{ticketResult.ticketId}</code>
                        <Badge className={STATUS_BADGE_CLASSES[ticketResult.status]}>
                            {STATUS_LABELS[ticketResult.status]}
                        </Badge>
                    </div>

                    <div className="text-sm space-y-1">
                        <p><span className="text-gray-500 dark:text-gray-400">Category:</span> {CATEGORY_LABELS[ticketResult.category]}</p>
                        <p><span className="text-gray-500 dark:text-gray-400">Page:</span> <a href={ticketResult.pageUrl} className="text-indigo-600 dark:text-indigo-400 hover:underline break-all">{ticketResult.pageUrl}</a></p>
                        <p className="text-gray-500 dark:text-gray-400">Submitted: {new Date(ticketResult.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2">Description</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                            {ticketResult.description}
                        </p>
                    </div>

                    {ticketResult.fileUrl && (
                        <a href={ticketResult.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                            View attached file
                        </a>
                    )}

                    <div>
                        <p className="text-sm font-medium mb-3">Progress</p>
                        <StatusTimeline history={ticketResult.statusHistory} currentStatus={ticketResult.status} />
                    </div>
                </div>
            )}

            {/* Email mode: minimal list — category + status only, no ticket, no description */}
            {emailResults && (
                <div className="space-y-2">
                    {emailResults.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#1A1A1A] px-4 py-3"
                        >
                            <div>
                                <p className="text-sm font-medium">{CATEGORY_LABELS[item.category]}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Submitted {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Badge className={STATUS_BADGE_CLASSES[item.status]}>
                                {STATUS_LABELS[item.status]}
                            </Badge>
                        </div>
                    ))}
                    <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                        For full details on a report, use its ticket ID.
                    </p>
                </div>
            )}
        </div>
    )
}

function StatusTimeline({ history, currentStatus }: { history: StatusHistoryEntry[]; currentStatus: StatusValue }) {
    // "closed" reports still walk through pending -> in_progress -> resolved
    // visually; closed itself is shown as a distinct final badge above rather
    // than a timeline step, since it can happen from any prior state.
    const historyMap = new Map(history.map(h => [h.status, h]))

    return (
        <ol className="space-y-3">
            {STATUS_ORDER.map((step, i) => {
                const entry = historyMap.get(step)
                const reached = Boolean(entry) || currentStatus === "closed"
                const isCurrent = step === currentStatus

                return (
                    <li key={step} className="flex items-start gap-3">
                        {reached ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        ) : isCurrent ? (
                            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        ) : (
                            <Circle className="h-5 w-5 text-gray-300 dark:text-gray-700 shrink-0 mt-0.5" />
                        )}
                        <div>
                            <p className={`text-sm font-medium ${reached ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-600"}`}>
                                {STATUS_LABELS[step]}
                            </p>
                            {entry && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(entry.changedAt).toLocaleString()}
                                    {entry.note ? ` — ${entry.note}` : ""}
                                </p>
                            )}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}

export default ReportStatusForm