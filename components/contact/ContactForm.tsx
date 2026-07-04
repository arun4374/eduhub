"use client"

import { useState, type FormEvent } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"

const positions = ['Student', 'Faculty', 'Developer', 'Other']

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: 'Student',
        message: '',
        honeypot: '', // for spam prevention
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setFeedbackMessage('')

        if (!executeRecaptcha) {
            setStatus('error')
            setFeedbackMessage('reCAPTCHA not available. Please try again later.')
            return
        }

        if (formData.honeypot) {
            // Silently handle bot submission
            setStatus('success')
            setFeedbackMessage('Message sent successfully!')
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
                setFeedbackMessage(data.message || 'Message sent successfully!')
                setFormData({ name: '', email: '', phone: '', position: 'Student', message: '', honeypot: '' })
            } else {
                setStatus('error')
                setFeedbackMessage(data.message || 'An unknown error occurred.')
            }
        } catch (error) {
            setStatus('error')
            setFeedbackMessage('Failed to connect to the server. Please try again later.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} className="hidden" aria-hidden="true" />

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" name="name" id="name" autoComplete="name" required value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-900" />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" id="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-900" />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input type="tel" name="phone" id="phone" autoComplete="tel" required value={formData.phone} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-900" />
            </div>

            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a...</label>
                <select id="position" name="position" required value={formData.position} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-900">
                    {positions.map(pos => <option key={pos}>{pos}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea id="message" name="message" rows={4} required value={formData.message} onChange={handleChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-900" />
            </div>

            <div>
                <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                    {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Message'}
                </button>
            </div>

            {feedbackMessage && (
                <div className={`flex items-center gap-3 p-3 rounded-md text-sm ${status === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                    {status === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                    <span>{feedbackMessage}</span>
                </div>
            )}
        </form>
    )
}