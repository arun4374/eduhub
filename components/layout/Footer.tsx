"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"

export function Footer() {
  const [reportUrl, setReportUrl] = useState("/report")
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // This logic is moved into useEffect to ensure it only runs on the client-side
    // after hydration. This prevents build errors when prerendering special pages
    // like the 404 page, where navigation hooks might not be available.
    const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    setReportUrl(`/report?from=${encodeURIComponent(currentPath)}`)
  }, [pathname, searchParams])

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
                <Link
                  id="footer-link-report"
                  href={reportUrl}
                  className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Report an Issue
                </Link>
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
          <p>© {new Date().getFullYear()} Arivon. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made for Anna University Students</p>
        </div>
      </div>
    </footer>
  )
}
