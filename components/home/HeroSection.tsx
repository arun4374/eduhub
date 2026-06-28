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
    <div ref={ref} className="flex flex-col items-center justify-center p-2 sm:p-4 aspect-square w-28 sm:w-36 rounded-3xl bg-white/60 dark:bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/80 dark:border-white/10 shrink-0 transition-colors duration-300">
      <span className="text-2xl sm:text-4xl font-black text-sky-600 dark:text-sky-400 tracking-tight">
        {count}{suffix}
      </span>
      <span className="text-xs sm:text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-2 sm:mt-3 font-bold uppercase tracking-wider select-none text-center leading-tight">
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

  const counterData = [
    { end: 2, suffix: "M+", label: "Students" },
    { end: 15, suffix: "k+", label: "Faculty" },
    { end: 500, suffix: "+", label: "Colleges" },
  ]

  return (
    <section id="hero-section" className="relative w-full pt-3 pb-20 md:pt-22 md:pb-32 bg-white dark:bg-[#0F0F0F] transition-colors duration-200 overflow-hidden">
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>

      {/* Decorative ambient blobs */}
      <div className="absolute -top-32 -right-32 h-[30rem] w-[30rem] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-[30rem] w-[30rem] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text content & Search */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight leading-tight max-w-2xl mx-auto md:mx-0 select-text">
              The Ultimate Hub <br />
              <span className="text-sky-600 dark:text-sky-400">Anna University Engineers</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#6B7280] dark:text-[#9CA3AF] max-w-xl mx-auto md:mx-0 leading-relaxed select-text">
              From exam schedules and study materials to CGPA calculators and official circulars, Arivon centralizes everything you need for your engineering journey.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-10 w-full max-w-xl mx--auto md:mx-0 flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl border border-[#E5E7EB] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="h-6 w-6 text-[#6B7280] dark:text-[#9CA3AF] shrink-0" />
                <Input
                  id="hero-search-input"
                  type="text"
                  placeholder="Search subject name or code..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-none bg-transparent h-12 w-full ring-0 focus-visible:ring-0 px-0 shadow-none text-base text-[#111827] dark:text-[#F9FAFB] placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF]"
                />
              </div>
              <Button id="hero-search-btn" type="submit" className="h-12 px-8 font-semibold shrink-0 cursor-pointer text-base">
                Search
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="font-medium mr-1 select-none">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleChipClick(term)}
                  className="px-3 py-1.5 rounded-lg bg-[#F9FAFB] dark:bg-[#1A1A1A] hover:bg-sky-50 dark:hover:bg-sky-950/30 text-[#111827] dark:text-[#F9FAFB] border border-[#E5E7EB] dark:border-[#2A2A2A] hover:border-sky-400 transition-colors cursor-pointer text-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Animated Statistics (Desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden md:flex items-center justify-center gap-6 lg:gap-8"
          >
            <div className="flex flex-col gap-6 lg:gap-8">
              <AnimatedCounter {...counterData[0]} />
              <AnimatedCounter {...counterData[1]} />
            </div>
            <div className="flex flex-col gap-6 lg:gap-8 pt-20">
              <AnimatedCounter {...counterData[2]} />
            </div>
          </motion.div>
        </div>

        {/* Animated Statistics Block (Mobile) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:hidden mt-20 sm:mt-24 w-full flex items-center justify-center gap-4 sm:gap-8 flex-nowrap pt-4"
        >
          {counterData.map(counter => <AnimatedCounter key={counter.label} {...counter} />)}
        </motion.div>

      </div>
    </section>
  )
}
