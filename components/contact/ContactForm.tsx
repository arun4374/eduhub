"use client"

import { useState, type FormEvent } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label";
import { Alertcard as AlertCard, type AlertType } from "@/components/ui/Alertcard"

const positions = ['Student', 'Faculty', 'Developer', 'Other']

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: 'Student',
        message: '',
        honeypot: '',
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null)
    const [errors, setErrors] = useState<Partial<Record<keyof Omit<typeof formData, 'honeypot'>, string>>>({})
    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as { name: keyof typeof formData; value: string }
        setFormData(prev => ({ ...prev, [name]: value }))
        if (name !== 'honeypot' && errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handlePositionChange = (value: string) => {
        setFormData(prev => ({ ...prev, position: value }))
        if (errors.position) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors.position
                return newErrors
            })
        }
    }

    const validateSingleField = (name: keyof Omit<typeof formData, 'honeypot'>, value: string): string | undefined => {
        switch (name) {
            case 'name':
                return !value.trim() ? 'Full Name is required.' : undefined
            case 'email':
                if (!value.trim()) return 'Email is required.'
                if (!/\S+@\S+\.\S+/.test(value)) return 'A valid email is required.'
                return undefined
            case 'phone':
                return !value.trim() ? 'Phone Number is required.' : undefined
            case 'message':
                return !value.trim() ? 'Message cannot be empty.' : undefined
            default:
                return undefined
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as { name: keyof Omit<typeof formData, 'honeypot'>; value: string }
        const error = validateSingleField(name, value)
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }))
        }
    }

    const validateForm = () => {
        const newErrors = {
            name: validateSingleField('name', formData.name),
            email: validateSingleField('email', formData.email),
            phone: validateSingleField('phone', formData.phone),
            message: validateSingleField('message', formData.message),
        }
        const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([, v]) => v != null))
        setErrors(filteredErrors)
        return Object.keys(filteredErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setAlert(null)

        if (!validateForm()) {
            return
        }
        setStatus('loading')

        if (!executeRecaptcha) {
            setStatus('error')
            setAlert({ type: 'error', message: 'reCAPTCHA not available. Please try again later.' })
            return
        }

        if (formData.honeypot) {
            // Silently handle bot submission
            setStatus('success')
            setAlert({ type: 'success', message: 'Message sent successfully!' })
            return
        }

        try {
            const gRecaptchaToken = await executeRecaptcha('contactFormSubmit')

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, gRecaptchaToken }),
            })

            const data = await res.json()

            if (res.ok && data.success) {
                setStatus('success')
                setAlert({ type: 'success', message: data.message || 'Message sent successfully!' })
                setFormData({ name: '', email: '', phone: '', position: 'Student', message: '', honeypot: '' })
                setErrors({})
            } else {
                setStatus('error')
                setAlert({ type: 'error', message: data.message || 'An unknown error occurred.' })
            }
        } catch (error) {
            setStatus('error')
            setAlert({ type: 'error', message: 'Failed to connect to the server. Please try again later.' })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} className="hidden" aria-hidden="true" />

                <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input type="text" name="name" id="name" autoComplete="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Your Name" />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" id="email" autoComplete="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@gmail.com" />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input type="tel" name="phone" id="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="+91 12345 67890" />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="position">I am a...</Label>
                    <Select name="position" value={formData.position} onValueChange={handlePositionChange}>
                        <SelectTrigger id="position">
                            <SelectValue placeholder="Select your position" />
                        </SelectTrigger>
                        <SelectContent>
                            {positions.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} onBlur={handleBlur} placeholder="Let us know how we can help..." />
                    {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                </div>

                <div>
                    <Button type="submit" disabled={status === 'loading'} className="w-full">
                        {status === 'loading' ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                        ) : (
                            <><Send className="mr-2 h-4 w-4" /> Send Message</>
                        )}
                    </Button>
                </div>
            </form>

            <AlertCard
                open={!!alert}
                type={alert?.type ?? 'info'}
                message={alert?.message ?? ''}
                onClose={() => setAlert(null)}
                autoCloseMs={alert?.type === 'success' ? 5000 : undefined}
            />
        </>
    )
}