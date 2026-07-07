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
        <div className="space-y-8">
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => handleModeChange("ticket")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        mode === "ticket"
                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-600 dark:hover:text-gray-300"
                    }`}
                >
                    By Ticket ID
                </button>
                <button
                    type="button"
                    onClick={() => handleModeChange("email")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${mode === "email"
                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-600 dark:hover:text-gray-300"}`}
                >
                    By Email
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
                <div className="overflow-hidden border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-gray-950/50">
                    <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 dark:bg-white/5">
                        <code className="font-mono text-sm font-bold">{ticketResult.ticketId}</code>
                        <Badge className={STATUS_BADGE_CLASSES[ticketResult.status]}>
                            {STATUS_LABELS[ticketResult.status]}
                        </Badge>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Category</p>
                                <p className="text-sm font-medium">{CATEGORY_LABELS[ticketResult.category]}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Submitted</p>
                                <p className="text-sm font-medium">{new Date(ticketResult.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Page URL</p>
                            <a href={ticketResult.pageUrl} className="text-sm font-medium text-indigo-600 break-all dark:text-indigo-400 hover:underline">{ticketResult.pageUrl}</a>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Description</p>
                            <p className="p-3 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg dark:bg-white/5 dark:text-gray-300">
                                {ticketResult.description}
                            </p>
                            {ticketResult.fileUrl && (
                                <a href={ticketResult.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    View attached file
                                </a>
                            )}
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-medium">Progress</p>
                            <StatusTimeline history={ticketResult.statusHistory} currentStatus={ticketResult.status} />
                        </div>
                    </div>
                </div>
            )}

            {/* Email mode: minimal list — category + status only, no ticket, no description */}
            {emailResults && (
                emailResults.length > 0 ? (
                    <div className="space-y-3">
                        {emailResults.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-950/50 dark:border-gray-800"
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
                        <p className="pt-1 text-xs text-center text-gray-500 dark:text-gray-400">
                            For full details on a report, look it up by its Ticket ID.
                        </p>
                    </div>
                ) : (
                    <div className="px-4 py-10 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:text-gray-400">
                        No reports found for this email address.
                    </div>
                )
            )}
        </div>
    )
}

function StatusTimeline({ history, currentStatus }: { history: StatusHistoryEntry[]; currentStatus: StatusValue }) {
    const historyMap = new Map(history.map(h => [h.status, h]));

    return (
        <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
            {STATUS_ORDER.map((step) => {
                const entry = historyMap.get(step);
                // A step is "reached" if it has an entry in the history, or if the ticket is closed.
                const reached = Boolean(entry) || currentStatus === "closed";
                // A step is "current" if it matches the current status, but only if the ticket isn't closed.
                const isCurrent = step === currentStatus && currentStatus !== "closed";

                const Icon = reached ? CheckCircle2 : isCurrent ? Clock : Circle;
                const iconColor = reached
                    ? "text-green-600 dark:text-green-400"
                    : isCurrent
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-gray-500";
                
                const ringColor = reached
                    ? "bg-green-100 dark:bg-green-900/50"
                    : isCurrent
                    ? "bg-indigo-100 dark:bg-indigo-900/50"
                    : "bg-gray-100 dark:bg-gray-800";

                const textColor = reached || isCurrent ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400";

                return (
                    <li key={step} className="mb-6 ms-7 last:mb-0">
                        <span className={`absolute -start-3.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-950/50 ${ringColor}`}>
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                        </span>
                        <div className="ps-2">
                            <p className={`text-sm font-medium ${textColor}`}>
                                {STATUS_LABELS[step]}
                            </p>
                            {entry && (
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(entry.changedAt).toLocaleString()}
                                    {entry.note ? <span className="italic"> — {entry.note}</span> : ""}
                                </p>
                            )}
                        </div>
                    </li>
                )
            })}
        </ol>
    );
}

export default ReportStatusForm