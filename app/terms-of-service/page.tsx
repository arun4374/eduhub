import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Arivon",
  description: "Terms and Conditions for using the Arivon platform and its services, available at myarivon.in.",
  alternates: {
    canonical: "https://myarivon.in/terms-of-service",
  },
}

export default function TermsOfServicePage() {
  return (
    <main className="bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Last Updated: May 21, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-h2:font-bold prose-h2:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:underline">
          
          <h2>1. General Scope and Agreement</h2>
          <p>
            These Terms and Conditions ("T&C") govern the relationship between you ("user," "you") and Arivon ("we," "us," "our") while you interact with our services through our website <strong>myarivon.in</strong> and/or our application.
          </p>
          <p>
            By navigating, accessing, or interacting with our website and/or application, you expressly agree to these T&C without reservation. If you do not agree to these terms, you must not use our services.
          </p>
          <p>
            We reserve the right to modify or adapt these T&C at any time without prior notice. The updated T&C are applicable as soon as they are published on our platform. Your continued use of the service after such changes constitutes your acceptance of the new terms.
          </p>
          <p>
            You are not permitted to use our services for any illegal or unauthorized purpose. You must not attempt to hack, alter, or disrupt the functions of our services, transmit viruses, or conduct any form of attack against our platform's integrity.
          </p>

          <h2>2. Intellectual Property and Content</h2>
          <p>
            The content provided on our services, whether free or paid, is intended for personal, non-commercial use only. All materials available on our services, including text, graphics, logos, and software, are protected by copyright and other intellectual property rights owned by Arivon or its licensors.
          </p>
          <p>
            You are not allowed to reproduce, modify, copy, translate, sell, exploit, or transmit any content from our services without our express written permission. This includes our brand name, logo, and visual identity.
          </p>

          <h2>3. User Accounts and Registration</h2>
          <p>
            Some parts of our service may require you to register for an account. Each registration is for a single user only. You are prohibited from sharing your account credentials with anyone else.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account. You must notify us immediately at <a href="mailto:support@myarivon.in">support@myarivon.in</a> if you suspect any unauthorized use of your account.
          </p>
          <p>
            We may cancel or suspend your access to our services if you share your credentials or violate these terms.
          </p>

          <h2>4. User-Generated Content</h2>
          <p>
            If you upload, post, or submit any content (such as comments or questions) to our services, you represent that you have the necessary legal rights to do so.
          </p>
          <p>
            You shall not publish any content that is abusive, obscene, illegal, defamatory, or constitutes fake news. You agree not to impersonate anyone or use our services to transmit malware or spam. Hate speech and discrimination are strictly prohibited.
          </p>
          <p>
            We reserve the right to moderate, censor, modify, or delete any user-generated content or user account that violates these rules, without prior notice or compensation.
          </p>

          <h2>5. Disclaimer of Warranties and Limitation of Liability</h2>
          <p>
            Our services and all content are provided on an "as is" and "as available" basis. We do not guarantee that the information on our services will be accurate, complete, or error-free. You use our services at your own risk.
          </p>
          <p>
            Arivon, its directors, employees, and affiliates will not be liable for any direct, indirect, incidental, punitive, or special damages of any kind, including loss of profits, revenue, or data, arising from your use of the service.
          </p>
          <p>
            We do not guarantee that the use of our services will be uninterrupted, timely, or secure. We reserve the right to modify or remove services at any time without prior notice.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            Our services may contain links to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy of these sites. We are not liable for any harm or damages related to your use of third-party websites.
          </p>

          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Arivon and our affiliates from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these T&C or your violation of any law or the rights of a third-party.
          </p>

          <h2>8. Termination</h2>
          <p>
            These T&C are effective unless and until terminated by either you or us. You may terminate this agreement by notifying us that you no longer wish to use our services, or by ceasing to access our platform.
          </p>
          <p>
            We may terminate this agreement at our sole discretion, at any time and without notice, if you fail to comply with any term or provision of these T&C.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These T&C and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of <strong>INDIA</strong>. Any disputes will be subject to the exclusive jurisdiction of the courts in that jurisdiction.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            If you have any questions regarding these Terms of Service, you can contact us directly at: <a href="mailto:support@myarivon.in">support@myarivon.in</a> or by visiting our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}
