"use client"

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ContactForm } from '@/components/contact/ContactForm'

export function ContactFormWrapper() {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!recaptchaSiteKey) {
        console.error("reCAPTCHA site key not found. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.")
        return (
            <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-red-500/50">
                <p className="font-semibold text-red-600 dark:text-red-400">Contact form is currently unavailable.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">The site administrator has not configured reCAPTCHA correctly.</p>
            </div>
        )
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey} scriptProps={{ async: true, defer: true, appendTo: 'body' }}>
            <ContactForm />
        </GoogleReCaptchaProvider>
    )
}