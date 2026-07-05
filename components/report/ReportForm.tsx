"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, FileUp, Send, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alertcard as AlertCard, type AlertType } from "@/components/ui/Alertcard"

type ReportCategory = "bug" | "incorrect_data" | "suggestion" | "other"

const CATEGORY_OPTIONS: { value: ReportCategory; label: string }[] = [
    { value: "bug", label: "Bug" },
    { value: "incorrect_data", label: "Incorrect Data" },
    { value: "suggestion", label: "Suggestion" },
    { value: "other", label: "Other" },
]

interface FormDataState {
    name: string
    email: string
    pageUrl: string
    description: string
    category: ReportCategory
    file: File | null
}

const MAX_DESC_LENGTH = 1500

export function ReportForm() {
    const searchParams = useSearchParams()
    const fromPath = searchParams.get('from')

    const [formData, setFormData] = useState<FormDataState>({
        name: '', email: '', pageUrl: '', description: '', category: 'bug', file: null,
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null)
    const [errors, setErrors] = useState<Partial<Record<keyof Omit<FormDataState, 'file'>, string>>>({})
    const [fileName, setFileName] = useState<string>('')
    const [ticketId, setTicketId] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (fromPath) {
            const fullUrl = `${window.location.origin}${fromPath}`
            setFormData(prev => ({ ...prev, pageUrl: fullUrl }))
        }
    }, [fromPath])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as { name: keyof FormDataState; value: string }
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name as keyof typeof errors]: undefined }))
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
                setAlert({ type: 'error', message: 'Only PDF and image files are allowed.' })
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setAlert({ type: 'error', message: 'File size cannot exceed 5MB.' })
                return
            }
            setFormData(prev => ({ ...prev, file }))
            setFileName(file.name)
            setAlert(null)
        }
    }

    const validateForm = () => {
        const newErrors: Partial<Record<keyof Omit<FormDataState, 'file'>, string>> = {}
        if (!formData.pageUrl.trim()) newErrors.pageUrl = 'Page URL is required.'
        if (!formData.description.trim()) newErrors.description = 'Please provide a description of the issue.'
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).every(key => !newErrors[key as keyof typeof newErrors])
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setAlert(null)
        if (!validateForm()) return

        setStatus('loading')
        const submissionData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value) submissionData.append(key, value)
        })

        try {
            const res = await fetch('/api/report', { method: 'POST', body: submissionData })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Submission failed')

            setStatus('success')
            setTicketId(data.ticketId || null)
            setAlert({ type: 'success', message: data.message || 'Report submitted successfully. Thank you!' })
            setFormData({ name: '', email: '', pageUrl: '', description: '', category: 'bug', file: null })
            setFileName('')
            setErrors({})
        } catch (error: any) {
            setStatus('error')
            setAlert({ type: 'error', message: error.message || 'An unknown error occurred.' })
        }
    }

    const handleCopyTicket = () => {
        if (!ticketId || !navigator.clipboard) return
        navigator.clipboard.writeText(ticketId).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <>
            {status === 'success' && ticketId && (
                <div className="mb-6 rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 p-4">
                    <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                        Your report has been submitted. Save this ticket ID to check its status later:
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 font-mono text-base font-bold text-green-900 dark:text-green-200 bg-white dark:bg-black/30 border border-green-200 dark:border-green-900 rounded-md px-3 py-2">
                            {ticketId}
                        </code>
                        <Button type="button" variant="outline" size="sm" onClick={handleCopyTicket} className="h-10 shrink-0">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-2">
                        No ticket? You can also look up your report status using the email you provided.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5"><Label htmlFor="name">Name (Optional)</Label><Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Your Name" /></div>
                    <div className="space-y-1.5"><Label htmlFor="email">Email (Optional)</Label><Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />{errors.email && <p className="text-sm text-red-500 pt-1">{errors.email}</p>}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5"><Label htmlFor="pageUrl">Page URL with Issue</Label><Input type="url" name="pageUrl" id="pageUrl" value={formData.pageUrl} onChange={handleChange} placeholder="https://myarivon.in/..." />{errors.pageUrl && <p className="text-sm text-red-500 pt-1">{errors.pageUrl}</p>}</div>
                    <div className="space-y-1.5">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {CATEGORY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="description">Description of Issue</Label>
                    <Textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} placeholder="Please describe the bug, incorrect data, or your suggestion..." maxLength={MAX_DESC_LENGTH} />
                    <div className="flex justify-between items-start text-sm min-h-[1.25rem] pt-1">
                        <div>
                            {errors.description && <p className="text-red-500">{errors.description}</p>}
                        </div>
                        <p className={`ml-auto font-mono text-xs ${formData.description.length >= MAX_DESC_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {formData.description.length}/{MAX_DESC_LENGTH}
                        </p>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="file-upload">Attach a PDF or Screenshot (Optional)</Label>
                    <div className="relative">
                        <Input id="file-upload" name="file" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf,image/*" />
                        <label htmlFor="file-upload" className="flex items-center w-full h-10 px-3 py-2 text-sm border border-input rounded-md cursor-pointer bg-transparent hover:bg-accent text-muted-foreground">
                            <FileUp className="mr-2 h-4 w-4 shrink-0" />
                            <span className="truncate">{fileName || 'Choose a file (max 5MB)'}</span>
                        </label>
                    </div>
                </div>
                <div>
                    <Button type="submit" disabled={status === 'loading'} className="w-full">
                        {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Submit Report</>}
                    </Button>
                </div>
            </form>
            <AlertCard open={!!alert} type={alert?.type ?? 'info'} message={alert?.message ?? ''} onClose={() => setAlert(null)} />
        </>
    )
}