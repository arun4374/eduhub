'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Search, Sun, Moon, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MOCK_SUBJECTS, Subject } from "@/data/mock-subjects"

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Mounted check to avoid hydration issues for system theme
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Close overlays on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchOpen(false)
    setMobileMenuOpen(false)
    setSearchQuery("")
  }, [pathname])

  const toggleTheme = () => {
    if (!mounted) return
    const currentTheme = theme === "system" ? resolvedTheme : theme
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  // Filter subjects based on query
  const filteredSubjects = searchQuery
    ? MOCK_SUBJECTS.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.code.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Questions", href: "/question-papers" },
    { name: "Departments", href: "/department" },
    { name: "CGPA Calc", href: "/tools/cgpa-calculator" },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <>
      <header id="main-header" className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] dark:border-[#2A2A2A] bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-lg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link id="nav-brand" href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 overflow-hidden rounded-lg">
              <Image
                src="/app_icon.png" 
                alt="Arivon Logo"
                width={36}
                height={36}
                className="transition-transform scale-125 group-hover:scale-[1.3]"
              />
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#111827] dark:text-[#F9FAFB]">
              Ariv<span className="text-indigo-600 dark:text-indigo-400">on</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors relative py-2 ${
                    active
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Action Tools */}
          <div id="nav-actions" className="flex items-center gap-2">
            {/* Search Toggle Button */}
            <Button
              id="search-toggle-btn"
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Subjects"
              className="text-[#6B7280] dark:text-[#9CA3AF]"
            >
              <Search className="h-6 w-6" />
            </Button>

            {/* Dark Mode Toggle Button */}
            <Button
              id="theme-toggle-btn"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative text-[#6B7280] dark:text-[#9CA3AF]"
            >
              <Sun className="h-6 w-6 absolute transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-amber-500" />
              <Moon className="h-6 w-6 absolute transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu Toggle Button */}
            <Button
              id="mobile-menu-toggle-btn"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#6B7280] dark:text-[#9CA3AF]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer/Overlay menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="fixed inset-0 top-20 z-40 bg-white dark:bg-[#0F0F0F] md:hidden flex flex-col p-6 transition-colors duration-200 animate-in fade-in-50">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                    active
                      ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-[#E5E7EB] dark:border-[#2A2A2A] text-center text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Arivon • Anna University Education Hub
          </div>
        </div>
      )}

      {/* Global Search Overlay Modal */}
      {searchOpen && (
        <div id="search-modal-overlay" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-28 px-4">
          <div id="search-modal-container" className="bg-white dark:bg-[#151515] w-full max-w-2xl rounded-2xl border border-[#E5E7EB] dark:border-[#2A2A2A] overflow-hidden shadow-2xl">
            <div className="p-5 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-3 flex-1">
                <Search className="h-6 w-6 text-[#6B7280] dark:text-[#9CA3AF]" />
                <Input
                  id="search-overlay-input"
                  type="text"
                  placeholder="Type subject name or subject code (e.g. CS3401, OS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent h-10 ring-0 focus-visible:ring-0 px-0 shadow-none text-lg w-full"
                  autoFocus
                />
              </div>
              <Button
                id="close-search-modal-btn"
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
                className="text-[#6B7280] dark:text-[#9CA3AF]"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Results pane */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {searchQuery ? (
                filteredSubjects.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] px-2 mb-1">
                      Matching Subjects ({filteredSubjects.length})
                    </p>
                    {filteredSubjects.map((sub) => (
                      <Link
                        id={`search-result-link-${sub.code.toLowerCase()}`}
                        key={sub._id}
                        href={`/subject/${sub.slug}`}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-[#111827] dark:text-[#F9FAFB] transition-colors"
                        onClick={() => setSearchOpen(false)}
                      >
                        <div>
                          <div className="font-semibold text-base flex items-center gap-2">
                            <span className="text-sm px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded font-bold">
                              {sub.code}
                            </span>
                            {sub.name}
                          </div>
                          <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                            {sub.department} • Semester {sub.semester} • Regulation {sub.regulation}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-indigo-500" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#6B7280] dark:text-[#9CA3AF]">
                    No subjects found for &quot;{searchQuery}&quot;
                  </div>
                )
              ) : (
                <div className="py-8 px-2 text-base text-[#6B7280] dark:text-[#9CA3AF]">
                  <p className="font-medium mb-2">Try searching for popular codes:</p>
                  <div className="flex flex-wrap gap-2">
                    {["CS3401", "CS3451", "EC3452", "EE3301", "CE3351"].map((code) => (
                      <button
                        key={code}
                        onClick={() => setSearchQuery(code)}
                        className="text-sm px-3 py-1.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-[#111827] dark:text-[#F9FAFB] rounded-lg border border-[#E5E7EB] dark:border-[#2A2A2A] transition-colors cursor-pointer"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
