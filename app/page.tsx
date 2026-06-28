import React from "react"
import { NotificationMarquee } from "@/components/shared/NotificationMarquee"
import { HeroSection } from "@/components/home/HeroSection"
import { DepartmentGrid } from "@/components/home/DepartmentGrid"
import { RecentQPSection } from "@/components/home/RecentQPSection"
import { ToolsSection } from "@/components/home/ToolsSection"
import { MobileAppSection } from "@/components/home/MobileAppSection"

export default function HomePage() {
  return (
    <div id="home-page-container" className="flex flex-col min-h-screen">

      {/* Main Educational Search Hero */}
      <HeroSection />

      {/* Engineering Branch Directory Grid */}
      <DepartmentGrid />

      {/* Recently Published Semester Exams */}
      <RecentQPSection />

      {/* Utilities Bench & Calculators */}
      <ToolsSection />

      {/* Mobile App Section */}
      <MobileAppSection />

    </div>
  )
}

