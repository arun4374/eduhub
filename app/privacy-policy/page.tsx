import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Arivon",
  description: "This privacy policy describes how Arivon collects, uses, and discloses your personal information when you use our services via myarivon.in.",
  alternates: {
    canonical: "https://myarivon.in/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Last Updated: May 21, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-h2:font-bold prose-h2:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:underline">
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to Arivon. This privacy policy describes how Arivon ("we", "us", or "our") collects, uses, and discloses your personal information when you use our services through our website (myarivon.in) and/or our application. Your privacy is important to us, and we are committed to protecting it.
          </p>
          <p>
            Please note that while our services are branded as "Arivon," our primary domain is <strong>myarivon.in</strong>. This policy applies to all interactions with our platform.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect several types of information to provide and improve our service to you:</p>
          <ul>
            <li>
              <strong>Personal Identification Information:</strong> When you register or use our services, you may provide us with your name, email address, phone number, college, and department.
            </li>
            <li>
              <strong>User-Generated Content:</strong> We collect information you provide when you post comments, ask questions, or upload materials. This may include text, images, and videos.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically collect information on how you access and use the service. This includes your IP address, browser type, device model, operating system, and pages visited.
            </li>
          </ul>
          <p>We may also receive data indirectly from third-party services that help us analyze usage and performance, such as:</p>
          <ul>
            <li>Firebase (https://www.firebase.google.com)</li>
            <li>Google Analytics (https://analytics.google.com)</li>
            <li>Other similar analytics and application performance tools.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>Arivon uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our service, including managing your account.</li>
            <li>To personalize your experience and show you relevant content.</li>
            <li>To communicate with you, including sending you updates, security alerts, and support messages.</li>
            <li>To send you marketing communications about products and services we think you might like (you can opt-out at any time).</li>
            <li>To improve our website and services by analyzing usage patterns.</li>
            <li>To ensure the security of our platform and prevent fraudulent activity.</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <p>
            Your data is securely stored on servers which may be located in various regions. We take the security of your data seriously and implement appropriate technical and organizational measures to protect it against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p>
            We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, or for a longer period if required by law. Generally, we will keep your data for up to 10 years after your last activity, after which it will be deleted.
          </p>

          <h2>5. Your Data Protection Rights</h2>
          <p>
            You have certain rights regarding your personal data. Every user is entitled to the following:
          </p>
          <div className="space-y-4 not-prose">
            <details className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
              <summary className="font-semibold cursor-pointer">The Right to Access</summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">You have the right to request copies of your personal data from us.</p>
            </details>
            <details className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
              <summary className="font-semibold cursor-pointer">The Right to Rectification</summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</p>
            </details>
            <details className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
              <summary className="font-semibold cursor-pointer">The Right to Erasure</summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">You have the right to request that we erase your personal data, under certain conditions.</p>
            </details>
            <details className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
              <summary className="font-semibold cursor-pointer">The Right to Restrict Processing</summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>
            </details>
             <details className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
              <summary className="font-semibold cursor-pointer">The Right to Data Portability</summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
            </details>
          </div>
          <p className="mt-6">
            If you would like to exercise any of these rights, please contact us at our email: <a href="mailto:support@myarivon.in">support@myarivon.in</a>. We have one month to respond to you.
          </p>

          <h2>6. Cookie Policy</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p>
            We use cookies to:
          </p>
          <ul>
            <li>Understand and save your preferences for future visits.</li>
            <li>Compile aggregate data about site traffic and site interactions to offer better site experiences.</li>
            <li>Provide targeted advertising.</li>
          </ul>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>
          

          <h2>7. Links to Other Websites</h2>
          <p>
            Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li>By email: <a href="mailto:support@myarivon.in">support@myarivon.in</a></li>
            <li>By visiting this page on our website: <Link href="/contact">myarivon.in/contact</Link></li>
          </ul>
        </div>
      </div>
    </main>
  )
}
