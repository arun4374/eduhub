'use client'

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, useInView } from "motion/react"

function AnimatedCounter({ end, suffix, label }: { end: number, suffix: string, label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    let animationFrame: number;
    const duration = 2000;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      // easeOutExpo
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(easeOut * end));
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, isInView]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-2 sm:p-4 aspect-square w-24 sm:w-32 rounded-2xl bg-white/60 dark:bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm dark:shadow-none shrink-0 transition-all duration-300 hover:-translate-y-1">
      <span className="text-xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
        {count}{suffix}
      </span>
      <span className="text-[10px] sm:text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 sm:mt-2 font-bold uppercase tracking-wider select-none text-center leading-tight">
        {label}
      </span>
    </div>
  )
}

export function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/question-papers?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleChipClick = (term: string) => {
    router.push(`/question-papers?search=${encodeURIComponent(term)}`)
  }

  const popularSearches = ["CS3401", "EC3452", "MA3303", "DBMS", "Thermodynamics"]

  return (
    <section id="hero-section" className="relative w-full py-16 md:py-24 bg-white dark:bg-[#0F0F0F] transition-colors duration-200">
      
      {/* Decorative ambient blobs using Tailwind transparency (no animations/heavy assets) */}
      <div className="absolute right-10 top-1/4 h-52 w-52 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 h-52 w-52 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        
        {/* Primary Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight leading-tight max-w-2xl select-text">
          Anna University <br />
          <span className="text-indigo-600 dark:text-indigo-400">Study Materials</span>
        </h1>

        {/* Supporting Subheading */}
        <p className="mt-4 text-base sm:text-lg text-[#6B7280] dark:text-[#9CA3AF] max-w-xl leading-relaxed select-text">
          Access question papers, notes, and syllabus checklists for all departments. Entirely free and built specifically for engineering students.
        </p>

        {/* Search Layout Form */}
        <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-xl flex flex-col sm:flex-row gap-2.5 shadow-sm p-1.5 rounded-xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A]">
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="h-5 w-5 text-[#6B7280] dark:text-[#9CA3AF] shrink-0" />
            <Input
              id="hero-search-input"
              type="text"
              placeholder="Search subject name or subject code (e.g. CS3401)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none bg-transparent h-10 w-full ring-0 focus-visible:ring-0 px-0 shadow-none text-sm text-[#111827] dark:text-[#F9FAFB] placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF]"
            />
          </div>
          <Button id="hero-search-btn" type="submit" className="h-10 px-6 font-semibold shrink-0 cursor-pointer">
            Search
          </Button>
        </form>

        {/* Popular searches suggestions row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          <span className="font-medium mr-1 select-none">Popular searches:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => handleChipClick(term)}
              className="px-2.5 py-1 rounded bg-[#F9FAFB] dark:bg-[#1A1A1A] hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-[#111827] dark:text-[#F9FAFB] font-sans border border-[#E5E7EB] dark:border-[#2A2A2A] hover:border-indigo-400 transition-colors cursor-pointer text-xs"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Animated Statistics Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 sm:mt-20 w-full flex items-center justify-center gap-3 sm:gap-6 flex-nowrap pt-4"
        >
          <AnimatedCounter end={2} suffix="M+" label="Students" />
          <AnimatedCounter end={15} suffix="k+" label="Faculty" />
          <AnimatedCounter end={500} suffix="+" label="Colleges" />
        </motion.div>

      </div>
    </section>
  )
}

