import React from "react"
import { User, Calendar, Eye } from "lucide-react"

interface BannerHeaderProps {
  title: string
  backgroundImage?: string
  adminName: string
  lastUpdated: string
  totalViews: number
}

export function BannerHeader({
  title,
  backgroundImage,
  adminName = "EduHub Team",
  lastUpdated = "March 2026",
  totalViews = 0,
}: BannerHeaderProps) {
  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K"
    }
    return views.toString()
  }

  return (
    <div id="banner-header" className="relative w-full h-[280px] overflow-hidden flex flex-col justify-center items-center px-4 text-center select-none shadow-inner border-b border-indigo-700/10">
      
      {/* Background with light/dark adaptive behavior */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 scale-102"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/65" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900" />
      )}

      {/* Content wrapper */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-sm">
          {title}
        </h1>
        
        {/* Metadata section */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 text-xs md:text-sm font-medium text-slate-200">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <User className="h-4 w-4 text-indigo-300" />
            <span>Admin: {adminName}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <Calendar className="h-4 w-4 text-indigo-300" />
            <span>Updated: {lastUpdated}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <Eye className="h-4 w-4 text-indigo-300" />
            <span>{formatViews(totalViews)} Views</span>
          </div>
        </div>
      </div>
    </div>
  )
}
