"use client"

import React, { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { Users } from "lucide-react"

function ReportIssueLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const reportUrl = `/report?from=${encodeURIComponent(currentPath)}`

  return (
    <Link
      id="footer-link-report"
      href={reportUrl}
      className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      Report an Issue
    </Link>
  )
}

function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // This endpoint will atomically increment and return the new count.
        const response = await fetch('/api/visitors');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCount(data.count);
          }
        }
      } catch (error) {
        console.error("Failed to fetch visitor count:", error);
        // Silently fail, don't show an error in the footer.
      }
    };

    fetchVisitorCount();
  }, []);

  if (count === 0) {
    // Show a placeholder while the initial count is being fetched
    return <span className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>;
  }

  return <span className="font-mono font-semibold tracking-wider">{count.toLocaleString('en-IN')}</span>;
}

export function Footer() {
  return (
    <footer id="main-footer" className="border-t border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F9FAFB] dark:bg-[#121212] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="footer-sections-grid" className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Tagline */}
          <div className="md:col-span-1 flex flex-col space-y-4">
            <Link id="footer-logo-brand" href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 overflow-hidden rounded-md">
                <Image
                  src="/app_icon.png" 
                  alt="Arivon Logo"
                  width={28}
                  height={28}
                  className="scale-125"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                Ariv<span className="text-indigo-600 dark:text-indigo-400">on</span>
              </span>
            </Link>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed max-w-xs">
              The premier education resource hub supporting Anna University engineering undergraduates with question papers, notes, and tools.
            </p>
          </div>

          {/* Column 1 — Menu */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#111827] dark:text-[#F9FAFB]">
              Menu
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  id="footer-link-notes-qp"
                  href="/question-papers"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Notes / QP
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-dept"
                  href="/department"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Departments
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-cgpa"
                  href="/tools/cgpa-calculator"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  CGPA Calculator
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-sitemap"
                  href="/sitemap"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#111827] dark:text-[#F9FAFB]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  id="footer-link-contact"
                  href="/contact"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Suspense fallback={
                  <Link href="/report" className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Report an Issue
                  </Link>
                }>
                  <ReportIssueLink />
                </Suspense>
              </li>
              <li>
                <Link
                  id="footer-link-terms"
                  href="/terms-of-service"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-privacy"
                  href="/privacy-policy"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Column 3 — Explore */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#111827] dark:text-[#F9FAFB]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  id="footer-link-tools"
                  href="/tools"
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Calculators & Tools 
                </Link>
              </li>
              
              <li>
                <a
                  id="footer-link-google-play"
                  href="/#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get our app on Google Play"
                >
                  <Image
                    src="/App/Google_Play_Badge.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={87}
                  />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E7EB] dark:border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          <p className="order-1">© {new Date().getFullYear()} Arivon. All rights reserved.</p>
          <div className="order-3 md:order-2 flex items-center gap-2 mt-2 md:mt-0">
            <Users className="h-4 w-4" />
            <VisitorCounter />
          </div>
          <p className="order-2 md:order-3 mt-2 md:mt-0">Made for Anna University Students</p>
        </div>
      </div>
    </footer>
  )
}
