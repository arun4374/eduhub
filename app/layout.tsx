import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arivon — Anna University Study Materials, QP, Notes & Syllabus',
  description: 'Access Anna University question papers, lecture notes, syllabus checklists, and CGPA calculators for all engineering departments. Built for CSE, ECE, EEE, MECH, and CIVIL branches.',
  keywords: 'Anna University, Question Papers, Engineering Notes, Regulation 2021, Syllabus, CSE, ECE, EEE, MECH, CIVIL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white dark:bg-[#0F0F0F] text-[#111827] dark:text-[#F9FAFB] font-sans antialiased selection:bg-indigo-500/20 transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* Main Top Header Navbar */}
          <Navbar />
          
          {/* Central content canvas */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Standard Page Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
