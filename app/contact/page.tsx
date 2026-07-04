import type { Metadata } from "next"
import { Mail, Building } from "lucide-react"
import { ContactFormWrapper } from "../../components/contact/ContactFormWrapper"

export const metadata: Metadata = {
  title: "Contact Us | Arivon",
  description: "Get in touch with the Arivon team. We'd love to hear your questions, feedback, or suggestions.",
  alternates: {
    canonical: "https://myarivon.in/contact",
  },
}

export default function ContactPage() {
    return (
        <main className="bg-white dark:bg-black transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Contact Us
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Have a question or feedback? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get in Touch</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Reach out to us directly through the following channels. We typically respond within 24-48 hours.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-indigo-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-400">For support and general inquiries.</p>
                                    <a href="mailto:support@myarivon.in" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline">
                                        support@myarivon.in
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Building className="h-6 w-6 text-indigo-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Address</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                       Tamil Nadu,
                                        <br />
                                        INDIA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ContactFormWrapper />
                </div>
            </div>
        </main>
    )
}