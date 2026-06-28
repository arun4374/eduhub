'use client'

import React from "react"
import Image from "next/image"
import { Smartphone, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

export function MobileAppSection() {
  return (
    <section 
      id="mobile-app-section" 
      className="relative z-20 backdrop-blur-md pt-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/80 via-white/80 to-white/80 dark:from-indigo-900/20 dark:via-[#0F0F0F]/80 dark:to-[#0F0F0F]/80 border-t border-[#E5E7EB] dark:border-[#2A2A2A]"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full mb-6 border border-indigo-100 dark:border-indigo-900/30">
          <Smartphone className="h-3.5 w-3.5" />
          <span>Mobile App</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight mb-4">
          Access Everything on the single app
        </h2>
        
        <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF] mb-8 max-w-lg mx-auto">
          Get question papers, syllabus, GPA calculators, and attendance trackers right in your pocket. Coming soon to all mobile platforms.
        </p>
        
        <Button disabled variant="outline" className="px-6 py-5 rounded-full border-[#E5E7EB] dark:border-[#2A2A2A] bg-[#F9FAFB] dark:bg-[#151515] text-[#6B7280] dark:text-[#9CA3AF]">
          <Sparkles className="h-4 w-4 mr-2" />
          In Process
        </Button>

        {/* Smartphone Mockups Grid */}
        <div className="mt-16 sm:mt-20 h-[300px] sm:h-[400px] overflow-hidden relative">
          <style dangerouslySetInnerHTML={{__html: `
            .mobile-app-grid {
              display: grid;
              grid-template-areas: "center";
              grid-template-columns: minmax(200px, 240px);
              justify-content: center;
              gap: 1.5rem;
            }
            @media (min-width: 640px) {
              .mobile-app-grid {
                grid-template-areas: "left center right";
                grid-template-columns: 1fr 1.25fr 1fr;
                justify-content: stretch;
              }
            }
          `}} />
          
          {/* Fade out bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 dark:from-[#0F0F0F]/80 to-transparent z-30 pointer-events-none" />
          
          <div className="mobile-app-grid items-start max-w-3xl mx-auto px-4 sm:px-0">
            {[
              { id: "left", seed: "app-dashbd", delay: 0.1, finalY: 40, classes: "hidden sm:block opacity-50 dark:opacity-30" },
              { id: "center", seed: "app-grades", delay: 0.3, finalY: 0, classes: "z-10 relative" },
              { id: "right", seed: "app-sched", delay: 0.5, finalY: 40, classes: "hidden sm:block opacity-50 dark:opacity-30" }
            ].map((mockup, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: mockup.finalY + 40 }}
              whileInView={{ opacity: 1, y: mockup.finalY }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: mockup.delay, ease: "easeOut" }}
              style={{ gridArea: mockup.id }}
              className={`relative mx-auto w-full aspect-[9/19] bg-white dark:bg-[#151515] rounded-[1.75rem] sm:rounded-[2.25rem] border-[4px] sm:border-[6px] border-gray-200/80 dark:border-gray-800 overflow-hidden ${mockup.classes}`}
            >
              <Image 
                src={`https://picsum.photos/seed/${mockup.seed}/400/840`} 
                alt={`App Screenshot ${idx + 1}`} 
                fill 
                sizes="(max-width: 640px) 240px, 300px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
