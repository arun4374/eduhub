'use client'

import React from "react"
import Image from "next/image"
import { Smartphone, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function MobileAppSection() {
  const features = [
    "Instant access to question papers.",
    "Syllabus and notes in your pocket.",
    "GPA/CGPA and attendance calculators.",
    "Real-time notifications and updates."
  ];

  const mockups = [
    {
      id: "left",
      src: "/App/Notification.jpg",
      alt: "App Notification Screen",
      rotation: -15,
      delay: 0.3,
    },
    {
      id: "center",
      src: "/App/Home_page.jpg",
      alt: "App Home Screen",
      rotation: 0,
      delay: 0.1,
    },
    {
      id: "right",
      src: "/App/Tools.jpg",
      alt: "App Tools Screen",
      rotation: 15,
      delay: 0.5,
    },
  ];

  return (
    <section 
      id="mobile-app-section" 
      className="py-16 md:py-24 bg-white dark:bg-[#0F0F0F] border-t border-[#E5E7EB] dark:border-[#2A2A2A] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-semibold rounded-full mb-6 border border-sky-100 dark:border-sky-900/30">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Coming Soon</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight mb-5">
              Your Campus, in Your Pocket.
            </h2>
            
            <p className="text-base text-[#6B7280] dark:text-[#9CA3AF] mb-8">
              The official Arivon app brings all the essential tools and resources directly to your fingertips. Stay organized, prepared, and ahead of the curve.
            </p>

            <ul className="space-y-3 text-left mb-10 max-w-md mx-auto md:mx-0">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-sky-500 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <a href="#" aria-label="Get it on Google Play" className="inline-block transition-transform hover:scale-105 duration-300">
                <Image
                  src="/App/Google_Play_Badge.jfif"
                  alt="Get it on Google Play"
                  width={162}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </a>
            </div>
          </motion.div>

          {/* Right: Image Mockups */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative h-[450px] md:h-[550px] flex items-center justify-center"
          >
            {mockups.map((mockup) => (
              <motion.div
                key={mockup.id}
                initial={{ opacity: 0, y: 50, rotate: mockup.rotation > 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, y: mockup.id === 'center' ? 0 : 20, rotate: mockup.rotation }}
                whileHover={{ y: mockup.id === 'center' ? -8 : 12, transition: { duration: 0.3, ease: "easeOut" } }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: mockup.delay, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[200px] md:w-[240px] aspect-[9/19] rounded-[1.75rem] md:rounded-[2.25rem] border-[6px] border-gray-800 bg-gray-800 overflow-hidden shadow-2xl cursor-pointer"
                style={{
                  zIndex: mockup.id === 'center' ? 10 : 1,
                }}
              >
                <Image 
                  src={mockup.src}
                  alt={mockup.alt}
                  fill 
                  sizes="(max-width: 768px) 200px, 240px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
